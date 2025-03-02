
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

console.log("Upload document function started");

serve(async (req) => {
  try {
    console.log("Received upload request");
    
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get("file");
    
    // Check if the file exists and is a File object
    if (!file || !(file instanceof File)) {
      console.error("No file found in form data or incorrect file format");
      return new Response(
        JSON.stringify({ error: "No file found in form data" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Create a Supabase client with the auth context from the request
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Check if the documents bucket exists, create it if it doesn't
    try {
      const { data: buckets, error: bucketsError } = await supabaseClient.storage.listBuckets();
      
      if (bucketsError) {
        throw new Error(`Error listing buckets: ${bucketsError.message}`);
      }
      
      const documentsBucketExists = buckets.some(bucket => bucket.name === "documents");
      
      if (!documentsBucketExists) {
        console.log("Creating documents bucket");
        const { error: createBucketError } = await supabaseClient.storage.createBucket("documents", {
          public: false,
          fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
        });
        
        if (createBucketError) {
          throw new Error(`Error creating documents bucket: ${createBucketError.message}`);
        }
        console.log("Documents bucket created successfully");
      }
    } catch (error) {
      console.error("Error checking/creating bucket:", error);
      return new Response(
        JSON.stringify({ error: "Error setting up storage bucket" }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Get file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    if (!['pdf', 'docx', 'txt'].includes(fileExt)) {
      return new Response(
        JSON.stringify({ error: "Only PDF, DOCX, and TXT files are supported" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create a unique filename
    const uniqueFilename = `${Date.now()}_${file.name}`;
    const filePath = `${uniqueFilename}`;

    // Upload the file to Supabase Storage
    console.log(`Uploading file to path: ${filePath}`);
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from("documents")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return new Response(
        JSON.stringify({ error: `Error uploading file: ${uploadError.message}` }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Get the public URL for the file
    const { data: urlData } = await supabaseClient.storage
      .from("documents")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    console.log(`File uploaded successfully. Public URL: ${publicUrl}`);

    // Create a record in the documents table
    const { data: documentData, error: documentError } = await supabaseClient
      .from("documents")
      .insert({
        file_path: filePath,
        file_name: file.name,
        file_type: fileExt,
        file_size: file.size,
        title: file.name,
        status: "uploaded",
        content_type: file.type || `application/${fileExt}`, // Save the content type
      })
      .select()
      .single();

    if (documentError) {
      console.error("Error creating document record:", documentError);
      return new Response(
        JSON.stringify({ error: `Error creating document record: ${documentError.message}` }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log(`Document record created with ID: ${documentData.id}`);

    // Return the document ID to the client
    return new Response(
      JSON.stringify({ documentId: documentData.id }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message}` }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
