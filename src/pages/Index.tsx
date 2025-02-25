
import { Brain, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted relative overflow-hidden">
        <div className="container px-6 py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary mb-8 animate-fade-in">
              <span className="text-sm font-medium">AI & Machine Learning Experts</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Transform Your Business with AI Solutions
            </h1>
            <p className="text-lg text-muted-foreground mb-8 animate-slide-up">
              We help businesses in Sydney leverage the power of AI and machine learning
              to achieve breakthrough results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center px-6 py-3 rounded-full border border-foreground/20 hover:bg-muted transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground">
              Comprehensive AI solutions tailored to your business needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service cards will go here */}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding">
        <div className="container">
          {/* About content will go here */}
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          {/* Projects preview will go here */}
        </div>
      </section>

      {/* Contact Preview Section */}
      <section className="section-padding">
        <div className="container">
          {/* Contact preview will go here */}
        </div>
      </section>
    </main>
  );
};

export default Index;
