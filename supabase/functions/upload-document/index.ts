
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Upload document function started')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get form data from the request
    let formData
    try {
      formData = await req.formData()
    } catch (error) {
      console.error('Error parsing form data:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to parse form data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      console.error('No file found in request')
      return new Response(
        JSON.stringify({ error: 'No file found in request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`File details: name=${file.name}, size=${file.size}, type=${file.type}`)

    // Get file content
    const fileContent = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(fileContent)

    // Determine content type based on file extension if not available
    let contentType = file.type
    if (!contentType || contentType === 'application/octet-stream') {
      const extension = file.name.split('.').pop()?.toLowerCase()
      if (extension === 'pdf') contentType = 'application/pdf'
      else if (extension === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      else if (extension === 'txt') contentType = 'text/plain'
      else contentType = 'application/octet-stream'
    }
    
    console.log(`Using content type: ${contentType}`)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Create a record in the documents table
    const { data: document, error: insertError } = await supabase
      .from('documents')
      .insert({
        file_name: file.name,
        file_size: file.size,
        file_type: contentType,
        content_type: contentType,
        title: file.name,
        status: 'uploaded'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting document record:', insertError)
      return new Response(
        JSON.stringify({ error: `Failed to create document record: ${insertError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upload file to storage
    const filePath = `${document.id}/${file.name}`
    console.log(`Uploading file to path: ${filePath}`)
    
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('documents')
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: false
      })

    if (storageError) {
      console.error('Error uploading file to storage:', storageError)
      
      // Clean up the document record if storage upload fails
      await supabase.from('documents').delete().eq('id', document.id)
      
      return new Response(
        JSON.stringify({ error: `Failed to upload file: ${storageError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the document record with the file path
    const { error: updateError } = await supabase
      .from('documents')
      .update({ file_path: filePath })
      .eq('id', document.id)

    if (updateError) {
      console.error('Error updating document record with file path:', updateError)
      return new Response(
        JSON.stringify({ error: `Failed to update document with file path: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return success response with document ID
    return new Response(
      JSON.stringify({ 
        documentId: document.id,
        message: 'Document uploaded successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Unexpected error in upload-document function:', error)
    return new Response(
      JSON.stringify({ error: `An unexpected error occurred: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
