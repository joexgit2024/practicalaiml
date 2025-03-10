
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function generateEmbedding(text) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function generateResponse(question, context) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  try {
    // Check if the context is empty or just contains whitespace
    const isContextEmpty = !context || context.length === 0 || context.every(item => !item || item.trim() === '');
    console.log("Context status - isEmpty:", isContextEmpty, "Context items:", context.length);
    
    // Create the system message
    let systemContent = `You are a helpful assistant for the company website. Answer the question based on the context provided.`;
    if (isContextEmpty) {
      systemContent += ` If you don't have enough information, explain that you don't have sufficient context to answer the question accurately and suggest the user uploads relevant documents or contacts support directly.`;
    }
    
    // Prepare context for the prompt
    const contextContent = isContextEmpty 
      ? "No relevant information found in the knowledge base." 
      : context.join('\n\n');
    
    console.log(`Making OpenAI request with context length: ${contextContent.length} characters`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemContent
          },
          {
            role: 'user',
            content: `Context information is below.\n---------------------\n${contextContent}\n---------------------\n\nGiven the context information and not prior knowledge, answer the question: ${question}`
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error response:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Generating embedding for message:', message);
    
    // Generate embedding for the message
    const messageEmbedding = await generateEmbedding(message);

    // Check if document_chunks table exists
    try {
      // Search for relevant document chunks using vector similarity
      console.log('Searching for relevant document chunks...');
      const { data: chunks, error: searchError } = await supabase.rpc(
        'match_document_chunks', 
        { 
          query_embedding: messageEmbedding,
          match_threshold: 0.7,  // Threshold for similarity
          match_count: 5         // Number of chunks to retrieve
        }
      );

      if (searchError) {
        console.error('Search error:', searchError);
        // If there's an error, continue without context
        const answer = await generateResponse(message, []);
        return new Response(
          JSON.stringify({ response: answer }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      console.log(`Found ${chunks?.length || 0} relevant document chunks`);
      
      // Extract context from chunks
      const context = chunks && chunks.length > 0 ? chunks.map(chunk => chunk.content) : [];
      
      // Generate response using context
      const answer = await generateResponse(message, context);

      // Log the conversation
      const { error: logError } = await supabase
        .from('chat_conversations')
        .insert({
          customer_message: message,
          ai_response: answer,
          chunks_used: chunks?.length || 0
        });

      if (logError) {
        console.error('Error logging conversation:', logError);
      }

      return new Response(
        JSON.stringify({ response: answer }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } catch (tableError) {
      console.error('Error with document_chunks table:', tableError);
      
      // If the document_chunks table doesn't exist or there's an error, fall back to a generic response
      const answer = await generateResponse(message, []);
      
      return new Response(
        JSON.stringify({ response: answer }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
