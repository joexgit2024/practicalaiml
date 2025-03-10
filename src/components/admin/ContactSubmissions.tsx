
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ContactSubmission {
  id: string;
  email: string;
  message: string;
  created_at: string;
  status: string;
  replied_at: string | null;
}

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof ContactSubmission, direction: 'ascending' | 'descending'}>({
    key: 'created_at',
    direction: 'descending'
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      console.error("Error fetching contact submissions:", error);
      toast.error("Failed to load contact submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof ContactSubmission) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const sortedSubmissions = React.useMemo(() => {
    const sortableSubmissions = [...submissions];
    if (searchTerm) {
      return sortableSubmissions
        .filter(submission => 
          submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
    }
    
    return sortableSubmissions.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [submissions, searchTerm, sortConfig]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setSubmissions(submissions.map(submission => 
        submission.id === id ? {...submission, status: newStatus} : submission
      ));
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Contact Submissions</span>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or message..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">
                    <Button variant="ghost" className="hover:bg-transparent p-0" onClick={() => handleSort('email')}>
                      Email <ArrowUpDown className="h-4 w-4 ml-1" />
                    </Button>
                  </th>
                  <th className="py-2 px-4 text-left">
                    <Button variant="ghost" className="hover:bg-transparent p-0" onClick={() => handleSort('message')}>
                      Message <ArrowUpDown className="h-4 w-4 ml-1" />
                    </Button>
                  </th>
                  <th className="py-2 px-4 text-left">
                    <Button variant="ghost" className="hover:bg-transparent p-0" onClick={() => handleSort('created_at')}>
                      Date <ArrowUpDown className="h-4 w-4 ml-1" />
                    </Button>
                  </th>
                  <th className="py-2 px-4 text-left">
                    <Button variant="ghost" className="hover:bg-transparent p-0" onClick={() => handleSort('status')}>
                      Status <ArrowUpDown className="h-4 w-4 ml-1" />
                    </Button>
                  </th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">No contact submissions found</td>
                  </tr>
                ) : (
                  sortedSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{submission.email}</td>
                      <td className="py-2 px-4">
                        <div className="max-w-xs truncate">{submission.message}</div>
                      </td>
                      <td className="py-2 px-4">{formatDate(submission.created_at)}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          submission.status === 'replied' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {submission.status === 'pending' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(submission.id, 'replied')}
                          >
                            Mark as Replied
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(submission.id, 'pending')}
                          >
                            Mark as Pending
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactSubmissions;
