
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const DocumentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      formData.append('description', description);
      
      // Call the upload-document edge function
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'upload-document', 
        {
          body: formData,
          headers: {
            // No additional headers needed, the SDK handles this
          }
        }
      );
      
      if (functionError) {
        throw new Error(`Function error: ${functionError.message}`);
      }
      
      toast({
        title: 'Document Uploaded',
        description: 'Your document has been uploaded and is being processed',
      });
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      
      // If you have a file input ref, you could reset it here
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Document File</Label>
        <Input 
          id="file-upload"
          type="file" 
          onChange={handleFileChange}
          accept=".docx,.pdf,.txt,.md"
        />
        {file && (
          <p className="text-sm text-muted-foreground">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a brief description of this document"
          rows={3}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={uploading || !file}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </form>
  );
};

export default DocumentUploader;
