
const Projects = () => {
  return (
    <main className="pt-20">
      {/* Project List Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Projects</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Successful AI implementations and case studies
            </p>
          </div>
        </div>
      </section>

      {/* Visuals Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Project Showcase</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Visual demonstrations of our AI solutions
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Client Testimonials</h2>
            <p className="text-lg text-muted-foreground mb-8">
              What our clients say about working with us
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Projects;
