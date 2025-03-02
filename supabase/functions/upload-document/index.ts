
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const title = formData.get('title') || 'Untitled Document';
    const description = formData.get('description') || '';

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Sanitize filename and get extension
    const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
    const fileExt = sanitizedFileName.split('.').pop();
    const fileNameWithoutExt = sanitizedFileName.split('.')[0];
    const finalFileName = fileNameWithoutExt 
      ? sanitizedFileName 
      : `document_${new Date().toISOString().slice(0, -5)}.${fileExt}`;

    // Generate a unique path for the file
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Upload file to storage
    const { data, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Store document metadata in database
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        title: title,
        description: description,
        file_name: finalFileName,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        status: 'uploaded'
      })
      .select();

    if (dbError) {
      return new Response(
        JSON.stringify({ error: 'Failed to save document metadata', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Start document processing
    const documentId = docData[0].id;
    const processingResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/process-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({ documentId })
    });

    if (!processingResponse.ok) {
      console.error('Failed to start document processing:', await processingResponse.text());
      // We continue anyway, as the document was uploaded successfully
    }

    return new Response(
      JSON.stringify({ 
        message: 'Document uploaded successfully',
        documentId: documentId,
        processingStarted: processingResponse.ok
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error uploading document:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
