import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            email: formData.email,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData({ email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit the form. Please try again.");
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-20">
      {/* Contact Methods Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Get in touch with our team of AI experts
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Phone className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Phone</h3>
                    <p className="text-muted-foreground">0437 443 634</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Mail className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <a 
                      href="mailto:support@practicalaiml.com.au"
                      className="text-primary hover:underline"
                    >
                      support@practicalaiml.com.au
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <MessageSquare className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Chat</h3>
                    <p className="text-muted-foreground">Live chat support</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground mb-8 text-center">
              Find answers to common questions about our services
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="full-stack">
                <AccordionTrigger>What is your approach to full-stack development?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="font-semibold">
                      Full-Stack Development with a Prototype-First Approach
                    </p>
                    <p>
                      We believe in delivering value early and often. Our process begins with building a functional prototype to align with your vision and gather feedback. Once approved, we transfer code ownership to you via GitHub, ensuring full transparency and control. From there, we scale the prototype into a production-ready application, implementing enterprise-grade security and best practices.
                    </p>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-4">Our Full-Stack Development Process</h4>
                      <div className="space-y-6">
                        <div>
                          <h5 className="font-semibold mb-2">1. Requirement Gathering and Planning</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Collaborate with the customer to understand their goals, features, and technical requirements.</li>
                            <li>Define the scope, timeline, and deliverables for the prototype.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">2. Prototype Development</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Develop a functional prototype that showcases the core features and user experience.</li>
                            <li>Use agile methodologies to deliver incremental updates and gather feedback.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">3. Customer Review and Sign-Off</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Present the prototype to the customer for review and testing.</li>
                            <li>Incorporate feedback and make necessary adjustments until the customer is satisfied.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">4. Code Ownership Transfer</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Once the prototype is approved, transfer code ownership to the customer via a private GitHub repository.</li>
                            <li>Provide documentation and support to ensure a smooth handover.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">5. Production Development</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Work with the customer to scale the prototype into a full production-ready application.</li>
                            <li>Implement enterprise-grade security, performance optimization, and best practices.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">6. Post-Launch Support</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Offer ongoing maintenance, updates, and technical support to ensure the application runs smoothly.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-4">Key Benefits of This Approach</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-semibold">Transparency and Collaboration:</span> Customers are involved throughout the process, ensuring the final product meets their expectations.</li>
                        <li><span className="font-semibold">Reduced Risk:</span> Prototyping allows for early feedback and adjustments, minimizing costly changes during production.</li>
                        <li><span className="font-semibold">Ownership and Control:</span> Customers gain full ownership of the codebase, giving them complete control over their product.</li>
                        <li><span className="font-semibold">Faster Time-to-Market:</span> A prototype-first approach accelerates the development cycle and delivers value sooner.</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pricing">
                <AccordionTrigger>How does your pricing work?</AccordionTrigger>
                <AccordionContent>
                  We offer flexible pricing plans tailored to your specific needs. Contact us for a
                  personalized quote.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data-security">
                <AccordionTrigger>How do you ensure data security?</AccordionTrigger>
                <AccordionContent>
                  We employ industry-leading security measures to protect your data.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
