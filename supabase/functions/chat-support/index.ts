
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { ChatCompletionMessage } from "https://cdn.skypack.dev/openai@4.28.0?dts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const baseSystemPrompt = `You are a customer support assistant for Practical AI & ML. 
You help customers with questions about our services, including:

1. Full-stack development with our prototype-first approach
2. AI consulting and implementation
3. Data analysis and machine learning solutions

Key points about our services:
- We focus on delivering value early through functional prototypes
- We transfer code ownership to clients via GitHub
- We implement enterprise-grade security and best practices
- We offer continuous support and maintenance

Use the context information below to answer questions. If the information isn't in the context, 
use your general knowledge but make it clear what's fact versus what might be your best guess.

If you cannot confidently answer a question based on this information, respond with: 
"I apologize, but I'm not able to provide a complete answer to your question. Please email us at support@practicalaiml.com.au for detailed assistance."`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, sessionId } = await req.json();
    console.log(`Processing message for session ${sessionId}: ${message.substring(0, 50)}...`);
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Get conversation history
    let messages: ChatCompletionMessage[] = [{ role: 'system', content: baseSystemPrompt }];
    
    const { data: historyData, error: historyError } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10); // Get last 10 messages
    
    if (!historyError && historyData.length > 0) {
      for (const entry of historyData) {
        messages.push({ role: 'user', content: entry.user_message });
        messages.push({ role: 'assistant', content: entry.ai_response });
      }
    }
    
    // Generate an embedding for the user's query
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        input: message,
        model: "text-embedding-3-small"
      })
    });
    
    const embeddingData = await embeddingResponse.json();
    
    if (!embeddingResponse.ok) {
      console.error('Error generating embedding:', embeddingData);
      throw new Error('Failed to generate embedding');
    }
    
    const queryEmbedding = embeddingData.data[0].embedding;
    
    // Retrieve relevant document chunks
    // Note: This uses the pgvector extension which must be enabled in Supabase
    const { data: relevantChunks, error: chunksError } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.7, // Adjust as needed
        match_count: 3 // Retrieve top 3 matches
      }
    );
    
    if (chunksError) {
      console.error('Error retrieving relevant chunks:', chunksError);
      // Fall back to regular completion without context
    }
    
    // Prepare context for the AI
    let context = "";
    if (relevantChunks && relevantChunks.length > 0) {
      context = "Here is relevant information from our knowledge base:\n\n";
      relevantChunks.forEach((chunk, i) => {
        context += `--- Excerpt ${i+1} ---\n${chunk.content}\n\n`;
      });
    }
    
    // Add the context to the system prompt
    const systemPromptWithContext = baseSystemPrompt + "\n\n" + context;
    messages[0] = { role: 'system', content: systemPromptWithContext };
    
    // Add the current message
    messages.push({ role: 'user', content: message });

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Store the conversation
    await supabase.from('chat_conversations').insert({
      session_id: sessionId,
      user_message: message,
      ai_response: aiResponse
    });

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process your request. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
