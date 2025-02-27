
const About = () => {
  return (
    <main className="pt-20">
      {/* Personal Bio Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Personal Bio</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Meet the minds behind our AI consultancy
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-primary">
              Empowering Businesses Through Artificial Intelligence
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              We apply a practical, results-driven approach to quickly identify opportunities, 
              deliver tailored solutions, and drive measurable improvements—all with a focus 
              on continuous innovation and growth at the core of everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Team</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Expert professionals dedicated to your success
            </p>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Awards & Recognition</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our achievements in AI and machine learning
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Certifications</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Industry certifications and partnerships
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
