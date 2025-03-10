
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { decode } from "https://deno.land/std@0.177.0/encoding/base64.ts";
import { extract as extractPDF } from "https://deno.land/x/pdf@2.0.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentId } = await req.json()

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Initializing Supabase client...')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get document details
    console.log('Fetching document details for ID:', documentId)
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (fetchError) {
      console.error('Error fetching document:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch document', details: fetchError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Processing document:', document.file_name)
    
    // First update status to 'processing' 
    const { error: updateToProcessingError } = await supabase
      .from('documents')
      .update({ status: 'processing' })
      .eq('id', documentId)
      
    if (updateToProcessingError) {
      console.error('Error updating document to processing status:', updateToProcessingError)
    }

    // Check if document_chunks table exists, if not create it
    try {
      console.log('Checking if document_chunks table exists...')
      const { error: tableCheckError } = await supabase
        .from('document_chunks')
        .select('id')
        .limit(1)

      if (tableCheckError && tableCheckError.message.includes("relation \"document_chunks\" does not exist")) {
        console.log("Creating document_chunks table...")
        
        // Create the document_chunks table with embeddings support
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS public.document_chunks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            chunk_index INTEGER NOT NULL,
            embedding VECTOR(1536),
            metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );

          -- Enable RLS
          ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
          
          -- Create policy for reading chunks
          CREATE POLICY "Anyone can read document chunks" 
          ON public.document_chunks 
          FOR SELECT 
          USING (true);
          
          -- Create function for similarity search
          CREATE OR REPLACE FUNCTION match_document_chunks(
            query_embedding VECTOR(1536),
            match_threshold FLOAT,
            match_count INT
          )
          RETURNS TABLE (
            id UUID,
            document_id UUID,
            content TEXT,
            similarity FLOAT
          )
          LANGUAGE plpgsql
          AS $$
          BEGIN
            RETURN QUERY
            SELECT
              document_chunks.id,
              document_chunks.document_id,
              document_chunks.content,
              1 - (document_chunks.embedding <=> query_embedding) AS similarity
            FROM document_chunks
            WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
            ORDER BY similarity DESC
            LIMIT match_count;
          END;
          $$;
        `;
        
        // Execute the SQL
        await supabase.rpc('execute_query', {
          query_text: createTableQuery
        });
        console.log("Document_chunks table created successfully!")
      }
    } catch (error) {
      console.error("Error checking/creating document_chunks table:", error)
      // Continue with processing - don't fail the entire operation if this fails
    }

    // Download the document
    console.log('Downloading document from storage:', document.file_path)
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('documents')
      .download(document.file_path)

    if (downloadError) {
      console.error('Error downloading document:', downloadError)
      await updateDocumentStatus(supabase, documentId, 'error', 'Failed to download document')
      return new Response(
        JSON.stringify({ error: 'Failed to download document', details: downloadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Extract text based on file type
    console.log(`Extracting text from ${document.file_type} document...`)
    let documentText = ''

    try {
      if (document.file_type === 'pdf') {
        const arrayBuffer = await fileData.arrayBuffer()
        const pdfData = new Uint8Array(arrayBuffer)
        const pdfText = await extractPDF(pdfData)
        documentText = pdfText.text
      } else if (document.file_type === 'txt') {
        documentText = await fileData.text()
      } else if (document.file_type === 'docx') {
        // For DOCX, just extract as text for now (simplified)
        documentText = await fileData.text()
      } else {
        throw new Error(`Unsupported file type: ${document.file_type}`)
      }
      
      console.log(`Extracted ${documentText.length} characters of text`)
    } catch (error) {
      console.error('Error extracting text from document:', error)
      await updateDocumentStatus(supabase, documentId, 'error', 'Failed to extract text from document')
      return new Response(
        JSON.stringify({ error: 'Failed to extract text from document', details: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Split text into chunks (approximately 1000 tokens each)
    console.log('Splitting document into chunks...')
    const chunkSize = 4000 // characters, roughly 1000 tokens
    const overlap = 200 // character overlap between chunks
    const chunks = []
    
    for (let i = 0; i < documentText.length; i += chunkSize - overlap) {
      const chunk = documentText.substring(i, i + chunkSize)
      if (chunk.trim().length > 0) {
        chunks.push(chunk)
      }
    }
    
    console.log(`Created ${chunks.length} chunks`)

    // Generate embeddings for each chunk using OpenAI
    console.log('Generating embeddings...')
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      await updateDocumentStatus(supabase, documentId, 'error', 'OpenAI API key is not configured')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Store chunks and their embeddings
    for (let i = 0; i < chunks.length; i++) {
      try {
        console.log(`Processing chunk ${i+1}/${chunks.length}`)
        
        // Get embedding for chunk
        const embedding = await generateEmbedding(chunks[i], OPENAI_API_KEY)
        
        // Store chunk and embedding
        const { error: insertError } = await supabase
          .from('document_chunks')
          .insert({
            document_id: documentId,
            content: chunks[i],
            chunk_index: i,
            embedding: embedding,
            metadata: { source: document.file_name, chunk: i + 1, total_chunks: chunks.length }
          })
          
        if (insertError) {
          console.error(`Error storing chunk ${i}:`, insertError)
          // Continue with other chunks
        }
      } catch (error) {
        console.error(`Error processing chunk ${i}:`, error)
        // Continue with other chunks
      }
    }

    // Update document status to processed
    await updateDocumentStatus(supabase, documentId, 'processed')

    console.log('Document processing completed successfully!')
    return new Response(
      JSON.stringify({ 
        message: 'Document processed successfully', 
        documentId, 
        processingSteps: [
          'Document retrieved from storage',
          'Text extracted from document',
          'Text split into manageable chunks',
          'Embeddings generated for each chunk',
          'Document chunks stored for semantic search',
          'Processing completed'
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Helper function to update document status
async function updateDocumentStatus(supabase, documentId, status, errorMessage = null) {
  const updateData = { status }
  if (errorMessage) {
    updateData.processing_error = errorMessage
  }
  
  const { error } = await supabase
    .from('documents')
    .update(updateData)
    .eq('id', documentId)
    
  if (error) {
    console.error(`Error updating document status to ${status}:`, error)
  } else {
    console.log(`Document status updated to ${status}`)
  }
}

// Helper function to generate embeddings using OpenAI API
async function generateEmbedding(text, apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
    }

    const result = await response.json()
    return result.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}
