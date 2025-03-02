
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
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Log environment variables (without exposing sensitive values)
    console.log('SUPABASE_URL available:', !!Deno.env.get('SUPABASE_URL'))
    console.log('SUPABASE_SERVICE_ROLE_KEY available:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))

    // Sanitize filename
    const originalFilename = file.name;
    const sanitizedFileName = originalFilename.replace(/[^\x00-\x7F]/g, '');
    const fileExt = sanitizedFileName.split('.').pop();
    const fileNameWithoutExt = sanitizedFileName.split('.').slice(0, -1).join('.');
    const finalFileName = fileNameWithoutExt 
      ? sanitizedFileName 
      : `uploaded_document_${new Date().toISOString().slice(0, -5)}.${fileExt}`;

    // Generate a unique file path
    const filePath = `documents/${crypto.randomUUID()}.${fileExt}`

    // Check if the documents bucket exists and create if not
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket('documents')
      
      if (bucketError && bucketError.message.includes('not found')) {
        // Create the documents bucket
        const { error: createBucketError } = await supabase.storage
          .createBucket('documents', {
            public: false,
          })
        
        if (createBucketError) {
          console.error('Failed to create bucket:', createBucketError)
          return new Response(
            JSON.stringify({ error: 'Failed to create storage bucket', details: createBucketError }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }
      }
    } catch (bucketCheckError) {
      console.error('Error checking bucket:', bucketCheckError)
    }

    // Upload file to storage
    console.log('Attempting to upload file to storage:', filePath)
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true // Changed to true to overwrite if file exists
      })

    if (storageError) {
      console.error('Storage error:', storageError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file to storage', details: storageError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create document record in database
    console.log('File uploaded successfully, creating database record')
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        filename: finalFileName,
        file_path: filePath,
        content_type: file.type,
        file_size: file.size,
        status: 'pending', // Will be processed later
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save document metadata', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Document uploaded successfully', 
        documentId: document.id,
        filePath 
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
