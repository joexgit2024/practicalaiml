
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatDialog = ({ open, onOpenChange }: ChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(uuidv4());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate a new session ID when the dialog opens
  useEffect(() => {
    if (open) {
      if (messages.length === 0) {
        sessionIdRef.current = uuidv4();
        
        // Add welcome message
        setMessages([{
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. I can answer questions based on documents that have been uploaded to our system. How can I help you today?'
        }]);
      }
    }
  }, [open, messages.length]);

  const recordConversation = async (userMessage: string, aiResponse: string) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .insert([
          {
            customer_message: userMessage,
            ai_response: aiResponse,
            session_id: sessionIdRef.current
          }
        ]);

      if (error) {
        console.error('Error recording conversation:', error);
      }
    } catch (error) {
      console.error('Failed to record conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: { message: userMessage },
      });

      if (error) throw error;

      const aiResponse = data.response;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse 
      }]);

      // Record the conversation
      await recordConversation(userMessage, aiResponse);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'m sorry, I encountered an error. Please try again or contact support if the issue persists.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">Live Chat Support</h2>
          <p className="text-sm text-muted-foreground">
            Ask us anything about our services. Our AI assistant uses our knowledge base to answer your questions.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted mr-4'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 mr-4">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <textarea
              className="flex-1 min-h-[44px] max-h-[144px] p-2 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
