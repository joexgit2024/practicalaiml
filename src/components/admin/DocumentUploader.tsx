
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, UploadCloud, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentUploaderProps {
  onUploadSuccess: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log(`Selected file: ${selectedFile.name}, type: ${selectedFile.type}, size: ${selectedFile.size}`);
      
      // Validate file type
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !['pdf', 'docx', 'txt'].includes(fileExt)) {
        setError('Please select a PDF, DOCX, or TXT file');
        return;
      }
      
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const uploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setError(null);
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log("Starting document upload...");
      
      // Use the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke(
        'upload-document',
        {
          body: formData,
        }
      );

      if (error) {
        console.error("Upload function error:", error);
        throw new Error(error.message || 'Failed to upload document');
      }
      
      if (!data) {
        console.error("Invalid response from upload function:", data);
        throw new Error('Invalid response from upload function');
      }
      
      console.log("Document uploaded successfully:", data);
      
      toast({
        title: "Success!",
        description: "Document uploaded successfully. It will now be processed for text extraction and analysis.",
      });
      
      // Trigger process-document function
      try {
        const { error: processError } = await supabase.functions.invoke(
          'process-document',
          {
            body: { documentId: data.documentId },
          }
        );
        
        if (processError) {
          console.warn("Process document warning:", processError);
          // Not throwing error here since the upload itself was successful
        }
      } catch (processErr) {
        console.warn("Failed to trigger document processing:", processErr);
        // Not failing the entire operation if just the processing trigger fails
      }
      
      // Notify parent component to refresh documents
      onUploadSuccess();
      
      // Reset form
      setFile(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || 'Failed to upload document');
      toast({
        title: "Upload failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex items-start gap-2">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">Document Processing:</p>
          <p>After upload, documents go through these steps:</p>
          <ol className="list-decimal pl-5 mt-1 space-y-1">
            <li>Storage in Supabase bucket</li>
            <li>Text extraction from the document</li>
            <li>Analysis and indexing for searching</li>
            <li>Status update when processing completes</li>
          </ol>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Documents will be processed and used for the chat interface. Max size: 10MB.
          </p>
        </div>
        <Button 
          type="submit" 
          disabled={!file || uploading || !!error} 
          className="w-full sm:w-auto"
        >
          {uploading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default DocumentUploader;
