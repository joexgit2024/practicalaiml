
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DocumentStatsProps {
  totalDocuments: number;
  processedDocuments: number;
  pendingDocuments: number;
  errorDocuments?: number;
}

const DocumentStats: React.FC<DocumentStatsProps> = ({
  totalDocuments,
  processedDocuments,
  pendingDocuments,
  errorDocuments = 0
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Documents</p>
            <h3 className="text-2xl font-bold">{totalDocuments}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Processed</p>
            <h3 className="text-2xl font-bold">{processedDocuments}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <h3 className="text-2xl font-bold">{pendingDocuments}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Errors</p>
            <h3 className="text-2xl font-bold">{errorDocuments}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentStats;
