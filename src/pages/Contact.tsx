
const Contact = () => {
  return (
    <main className="pt-20">
      {/* Contact Information Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're here to help with your AI journey
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Send Us a Message</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have a question or ready to start your project?
            </p>
          </div>
        </div>
      </section>

      {/* Social Media Links Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Connect With Us</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Follow us on social media for the latest updates
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Visit Our Office</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Located in the heart of Sydney
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to common questions about our services
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
