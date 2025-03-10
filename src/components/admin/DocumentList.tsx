
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Trash2, Search, Filter } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  // Filter documents based on search term and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = statusFilter === 'all';
    
    if (statusFilter === 'processed') {
      matchesStatus = doc.status === 'processed';
    } else if (statusFilter === 'processing') {
      // Fix: Include both 'processing' and 'uploaded' in the processing filter
      matchesStatus = doc.status === 'processing' || doc.status === 'uploaded';
    }
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center py-8"><FileText className="animate-pulse mr-2" /> Loading documents...</div>;
  }

  if (documents.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">No documents uploaded yet.</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48 flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredDocuments.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No documents match your search criteria.</p>
      ) : (
        <div className="divide-y">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="py-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 mt-1 text-primary" />
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
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteDocument(doc)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
