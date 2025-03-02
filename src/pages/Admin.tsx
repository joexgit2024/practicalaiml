
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    // If auth is loaded and user is not admin, redirect to home
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    // Fetch existing documents
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingDocs(false);
    }
  };

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
      console.log("File type:", file.type); // Log the file's content type
      
      // Use the Supabase Edge Function directly
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'upload-document',
        {
          body: formData,
          // Important: Do not set content-type header here, let the browser set it automatically
          // for FormData which includes the necessary multipart/form-data boundary
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
      
      // Refresh the document list
      fetchDocuments();
      
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

  // If still loading auth, show loading
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not admin or not logged in, component will redirect in useEffect

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Document Management</h1>

      {/* Upload Form */}
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

      {/* Document List */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        
        {loadingDocs ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <div className="divide-y">
            {documents.map((doc) => (
              <div key={doc.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{doc.file_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {new Date(doc.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Status: <span className={`font-medium ${doc.status === 'processed' ? 'text-green-600' : 'text-amber-600'}`}>
                        {doc.status === 'processed' ? 'Processed' : 'Processing'}
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const { error } = await supabase
                          .from('documents')
                          .delete()
                          .eq('id', doc.id);
                          
                        if (error) throw error;
                        
                        // Refresh the list
                        fetchDocuments();
                        
                        toast({
                          title: "Document deleted",
                          description: "The document and its chunks have been removed."
                        });
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message,
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
