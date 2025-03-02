
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      console.error("No file provided in the request");
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate a unique file path for storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExt = file.name.split('.').pop();
    const fileName = file.name.replace(`.${fileExt}`, '');
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9]/g, '-');
    const storagePath = `${sanitizedFileName}-${timestamp}.${fileExt}`;

    console.log(`Uploading file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
    console.log(`Storage path: ${storagePath}`);
    
    // Upload the file to storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('documents')
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file to storage', details: storageError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = await supabase
      .storage
      .from('documents')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`File uploaded successfully. Public URL: ${publicUrl}`);

    // Insert the document record into the database
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        file_name: file.name,
        file_path: storagePath, // Use the same path used for storage
        file_size: file.size,
        content_type: file.type,
        status: 'uploaded'
      })
      .select()
      .single();

    if (documentError) {
      console.error("Error inserting document record:", documentError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert document record', details: documentError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Document record created with ID: ${documentData.id}`);

    return new Response(
      JSON.stringify({ 
        message: 'Document uploaded successfully', 
        documentId: documentData.id,
        filePath: storagePath
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Unexpected error in upload-document function:", error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
