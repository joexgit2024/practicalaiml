
import React, { useState } from 'react';
import ChatDialog from '@/components/ChatDialog';
import ContactForm from '@/components/contact/ContactForm';
import CompanyInfo from '@/components/contact/CompanyInfo';
import LocationMap from '@/components/contact/LocationMap';

const Contact: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We'd love to hear from you. Fill out the form below or start a chat with our support team.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <ContactForm />
          </div>

          <div>
            <CompanyInfo onChatClick={() => setChatOpen(true)} />
          </div>
        </div>

        <LocationMap />
      </div>

      <ChatDialog 
        open={chatOpen} 
        onOpenChange={setChatOpen} 
      />
    </div>
  );
};

export default Contact;
