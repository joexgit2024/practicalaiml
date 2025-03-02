
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { documentId } = await req.json();
    console.log(`Processing document ${documentId}`);

    // Fetch the document from storage
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (documentError) {
      console.error('Error fetching document:', documentError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch document', details: documentError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the document content from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(document.file_path);

    if (fileError) {
      console.error('Error downloading file:', fileError);
      return new Response(
        JSON.stringify({ error: 'Failed to download file', details: fileError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert file to text
    const text = await fileData.text();
    
    // Split the text into chunks (approx 1000 tokens each)
    const chunkSize = 4000; // characters, not tokens, but a rough approximation
    const chunks = [];
    
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    
    console.log(`Document split into ${chunks.length} chunks`);

    // Process each chunk and generate embeddings
    const processedChunks = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i+1}/${chunks.length}`);
      
      // Generate embedding using OpenAI
      const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          input: chunk,
          model: "text-embedding-3-small"
        })
      });
      
      const embeddingData = await embeddingResponse.json();
      
      if (!embeddingResponse.ok) {
        console.error('Error generating embedding:', embeddingData);
        continue;
      }
      
      const embedding = embeddingData.data[0].embedding;
      
      // Store the chunk and its embedding
      processedChunks.push({
        document_id: documentId,
        content: chunk,
        embedding: embedding,
        chunk_index: i
      });
    }
    
    // Insert the chunks into the database
    if (processedChunks.length > 0) {
      const { error: insertError } = await supabase
        .from('document_chunks')
        .upsert(processedChunks, { onConflict: 'document_id, chunk_index' });
        
      if (insertError) {
        console.error('Error inserting chunks:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to insert chunks', details: insertError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Update the document status
    await supabase
      .from('documents')
      .update({ status: 'processed', processed_at: new Date().toISOString() })
      .eq('id', documentId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Document processed successfully. Created ${processedChunks.length} chunks with embeddings.` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process document', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
