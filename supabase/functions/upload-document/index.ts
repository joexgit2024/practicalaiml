
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

    if (!file || !(file instanceof File)) {
      console.error("No file provided in the request");
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Received file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Generate a unique file path for storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExt = file.name.split('.').pop();
    const fileName = file.name.replace(`.${fileExt}`, '');
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9]/g, '-');
    const storagePath = `${sanitizedFileName}-${timestamp}.${fileExt}`;

    console.log(`Storage path: ${storagePath}`);

    // Check if the 'documents' bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const documentsBucketExists = buckets?.some(bucket => bucket.name === 'documents');

    if (!documentsBucketExists) {
      console.log("Creating 'documents' bucket...");
      const { error: bucketError } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });

      if (bucketError) {
        console.error("Failed to create bucket:", bucketError);
        return new Response(
          JSON.stringify({ error: 'Failed to create storage bucket', details: bucketError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }
    
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

    const publicUrl = publicUrlData?.publicUrl;
    console.log(`File uploaded successfully. Public URL: ${publicUrl}`);

    // Check if documents table exists, if not create it
    const { error: tableCheckError } = await supabase
      .from('documents')
      .select('id')
      .limit(1);

    if (tableCheckError && tableCheckError.message.includes("relation \"documents\" does not exist")) {
      console.log("Creating documents table...");
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          file_name TEXT NOT NULL,
          file_path TEXT NOT NULL,
          file_size INTEGER,
          content_type TEXT,
          status TEXT DEFAULT 'uploaded',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for admin users
        CREATE POLICY "Allow full access to admins" 
        ON public.documents 
        USING (true);
      `;
      
      // Execute the SQL in Supabase's SQL runner
      await supabase.rpc('execute_query', {
        query_text: createTableQuery
      });
    }

    // Insert the document record into the database
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        file_name: file.name,
        file_path: storagePath,
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
        filePath: storagePath,
        publicUrl: publicUrl
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
