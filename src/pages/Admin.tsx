
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DocumentUploader from '@/components/admin/DocumentUploader';
import DocumentList from '@/components/admin/DocumentList';
import DocumentStats from '@/components/admin/DocumentStats';
import ContactSubmissions from '@/components/admin/ContactSubmissions';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState("documents");

  useEffect(() => {
    fetchDocuments();
    
    // Set up real-time subscription for document status updates
    const subscription = supabase
      .channel('document-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'documents' 
      }, (payload) => {
        console.log('Document change detected:', payload);
        if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
          // Show notification for status changes
          const statusMsg = payload.new.status === 'processed' 
            ? 'Document processing completed successfully!' 
            : `Document status changed to: ${payload.new.status}`;
          
          toast(statusMsg);
        }
        // Refresh documents list
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
  const pendingDocuments = documents.filter(doc => ['uploaded', 'processing'].includes(doc.status)).length;
  const errorDocuments = documents.filter(doc => doc.status === 'error').length;

  return (
    <AdminLayout title="Admin Dashboard">
      <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="documents">Document Management</TabsTrigger>
          <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-6">
          <DocumentStats 
            totalDocuments={totalDocuments}
            processedDocuments={processedDocuments}
            pendingDocuments={pendingDocuments}
            errorDocuments={errorDocuments}
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
        </TabsContent>
        
        <TabsContent value="contacts">
          <ContactSubmissions />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Admin;
