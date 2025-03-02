
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ChatDialog from '@/components/ChatDialog';
import { MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill out all required fields');
      }

      // Send contact form data to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            email: formData.email,
            message: formData.message,
          },
        ]);

      if (error) throw error;

      // Show success message
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We will get back to you soon.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We'd love to hear from you. Fill out the form below or start a chat with our support team.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Our Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">To be updated soon<br />Tallawong 2762 NSW</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">support@practicalaiml.com.au</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">0437 443 634</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Business Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM<br />Saturday - Sunday: Closed</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setChatOpen(true)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat with Our Support Team
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Visit Our Office</h2>
          <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Google Map would be embedded here soon</p>
          </div>
        </div>
      </div>

      <ChatDialog 
        open={chatOpen} 
        onOpenChange={setChatOpen} 
      />
    </div>
  );
};

export default Contact;
