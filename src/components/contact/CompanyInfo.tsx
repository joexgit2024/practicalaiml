
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface CompanyInfoProps {
  onChatClick: () => void;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ onChatClick }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Our Information</h2>
      
      <div className="space-y-4">
               <div>
          <h3 className="font-medium">Email</h3>
          <p className="text-muted-foreground">support@practicalaiml.com.au</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={onChatClick}
        >
          <MessageSquare className="h-4 w-4" />
          Chat with Our Support Team
        </Button>
      </div>
    </div>
  );
};

export default CompanyInfo;
