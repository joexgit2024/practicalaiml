
import { Brain, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="flex items-center justify-center bg-gradient-to-b from-background to-muted relative overflow-hidden">
        <div className="container px-6 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary mb-4 animate-fade-in">
              <span className="text-sm font-medium">AI & Machine Learning Experts</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
              Transform Your Business with AI Solutions
            </h1>
            <p className="text-lg text-muted-foreground mb-6 animate-slide-up">
              We help businesses leverage the power of practical AI and machine learning
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

      {/* AI Strategy Blueprint Section */}
      <section className="py-16 px-6">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Strategy Blueprint</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Discover how AI can transform your enterprise with our comprehensive guide.
                Learn about the strategic implementation of AI using the proven STARS model.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Download our detailed whitepaper to understand:
              </p>
              <ul className="text-left max-w-2xl mx-auto space-y-3 mb-8">
                <li className="flex items-start">
                  <Brain className="w-5 h-5 mr-2 mt-1 text-primary" />
                  <span>How AI drives business value and competitive advantage</span>
                </li>
                <li className="flex items-start">
                  <Brain className="w-5 h-5 mr-2 mt-1 text-primary" />
                  <span>Strategic frameworks for AI implementation</span>
                </li>
                <li className="flex items-start">
                  <Brain className="w-5 h-5 mr-2 mt-1 text-primary" />
                  <span>Practical steps to begin your AI transformation journey</span>
                </li>
              </ul>
              <a
                href="/AI-Strategy-Modern-Enterprises.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <FileText className="mr-2 h-5 w-5" />
                View AI Strategy Guide
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding">
        <div className="container">
          {/* About content will go here */}
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
