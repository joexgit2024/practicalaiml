
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  onUploadSuccess: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log(`Selected file: ${selectedFile.name}, type: ${selectedFile.type}, size: ${selectedFile.size}`);
      setFile(selectedFile);
    }
  };

  const uploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log("Starting document upload...");
      
      // Use the Supabase Edge Function
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'upload-document',
        {
          body: formData,
        }
      );

      if (functionError) {
        console.error("Upload function error:", functionError);
        throw new Error(functionError.message || 'Failed to upload document');
      }
      
      if (!functionData || !functionData.documentId) {
        console.error("Invalid response from upload function:", functionData);
        throw new Error('Invalid response from upload function');
      }
      
      console.log("Document uploaded successfully, now processing...");
      
      // Trigger document processing
      const { error: processError } = await supabase.functions.invoke(
        'process-document',
        {
          body: { documentId: functionData.documentId },
        }
      );

      if (processError) {
        console.error("Process function error:", processError);
        throw new Error(processError.message || 'Failed to process document');
      }

      toast({
        title: "Success!",
        description: "Document uploaded and processing started.",
      });
      
      // Notify parent component to refresh documents
      onUploadSuccess();
      
      // Reset form
      setFile(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
      <form onSubmit={uploadDocument} className="space-y-4">
        <div>
          <label htmlFor="document" className="block text-sm font-medium mb-1">
            Select Document (PDF, DOCX, TXT)
          </label>
          <Input
            id="document"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Documents will be processed and used for the chat interface.
          </p>
        </div>
        <Button type="submit" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </form>
    </div>
  );
};

export default DocumentUploader;
