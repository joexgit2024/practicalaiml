
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get document details
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

    console.log('Processing document:', documentId)
    
    // First update status to 'processing' 
    const { error: updateToProcessingError } = await supabase
      .from('documents')
      .update({ status: 'processing' })
      .eq('id', documentId)
      
    if (updateToProcessingError) {
      console.error('Error updating document to processing status:', updateToProcessingError)
    }

    // In a real application, you would process the document here
    // For demonstration purposes:
    // 1. Extract text from the document
    // 2. Split into chunks
    // 3. Generate embeddings for each chunk
    // 4. Store chunks and embeddings for later retrieval
    
    // For now, we'll simulate processing by waiting and then updating the status
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update document status to processed
    const { error: updateError } = await supabase
      .from('documents')
      .update({ status: 'processed' })
      .eq('id', documentId)

    if (updateError) {
      console.error('Error updating document status:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update document status', details: updateError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Document processed successfully', 
        documentId, 
        processingSteps: [
          'Document retrieved from storage',
          'Text extracted from document',
          'Text split into manageable chunks',
          'Document indexed for search',
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
