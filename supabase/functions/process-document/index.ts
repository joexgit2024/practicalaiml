
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { encode } from 'https://deno.land/std@0.170.0/encoding/base64.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function generateEmbedding(text: string) {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get document from database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: 'Document not found', details: docError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Download file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(document.file_path);

    if (fileError || !fileData) {
      return new Response(
        JSON.stringify({ error: 'Failed to download file', details: fileError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Simple text extraction - note that in a real app, you would need more sophisticated
    // text extraction based on file type (PDF, DOCX, etc.)
    let textContent = "";
    
    if (document.content_type === 'text/plain') {
      textContent = await fileData.text();
    } else {
      // For PDF/DOCX we would use a specialized library
      // For this example, we'll just use a placeholder
      textContent = `Extracted content from ${document.filename}. In a real implementation, you would use specialized libraries for extracting text from PDFs or DOCXs.`;
    }

    // Split text into chunks (simplified)
    const chunkSize = 1000;
    const overlap = 200;
    const chunks = [];
    
    for (let i = 0; i < textContent.length; i += chunkSize - overlap) {
      const chunk = textContent.substring(i, i + chunkSize);
      if (chunk.length < 10) continue; // Skip very small chunks
      
      try {
        // Generate embedding for chunk
        const embedding = await generateEmbedding(chunk);
        
        // Store chunk with embedding
        chunks.push({
          document_id: document.id,
          content: chunk,
          embedding,
          chunk_order: chunks.length
        });
      } catch (error) {
        console.error(`Error processing chunk ${chunks.length}:`, error);
      }
    }

    // Save chunks to database
    if (chunks.length > 0) {
      const { error: chunksError } = await supabase
        .from('document_chunks')
        .insert(chunks);

      if (chunksError) {
        return new Response(
          JSON.stringify({ error: 'Failed to save document chunks', details: chunksError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Update document status to 'processed'
    const { error: updateError } = await supabase
      .from('documents')
      .update({ status: 'processed' })
      .eq('id', document.id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update document status', details: updateError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Document processed successfully',
        chunks: chunks.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
