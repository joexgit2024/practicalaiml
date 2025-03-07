
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  status: string;
}

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDocumentDeleted: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  isLoading,
  onDocumentDeleted
}) => {
  const { toast } = useToast();

  const handleDeleteDocument = async (doc: Document) => {
    try {
      if (doc.file_path) {
        const { error: storageError } = await supabase
          .storage
          .from('documents')
          .remove([doc.file_path]);
          
        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
        }
      }
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);
        
      if (error) throw error;
      
      onDocumentDeleted();
      
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
  };

  if (isLoading) {
    return <p>Loading documents...</p>;
  }

  if (documents.length === 0) {
    return <p>No documents uploaded yet.</p>;
  }

  return (
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
              onClick={() => handleDeleteDocument(doc)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
