
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DocumentUploader from '@/components/admin/DocumentUploader';
import DocumentList from '@/components/admin/DocumentList';
import DocumentStats from '@/components/admin/DocumentStats';
import AdminLayout from '@/components/admin/AdminLayout';

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  status: string;
}

const Admin = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    fetchDocuments();
    
    // Set up real-time subscription for document status updates
    const subscription = supabase
      .channel('document-updates')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'documents' 
      }, () => {
        fetchDocuments();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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
      console.error("Error fetching documents:", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Calculate document statistics
  const totalDocuments = documents.length;
  const processedDocuments = documents.filter(doc => doc.status === 'processed').length;
  const pendingDocuments = totalDocuments - processedDocuments;

  return (
    <AdminLayout title="Admin Document Management">
      <DocumentStats 
        totalDocuments={totalDocuments}
        processedDocuments={processedDocuments}
        pendingDocuments={pendingDocuments}
      />

      <DocumentUploader onUploadSuccess={fetchDocuments} />

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        <DocumentList 
          documents={documents}
          isLoading={loadingDocs}
          onDocumentDeleted={fetchDocuments}
        />
      </div>
    </AdminLayout>
  );
};

export default Admin;
