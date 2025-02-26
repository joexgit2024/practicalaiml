
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Box, BarChart2, AlertTriangle, Timer } from "lucide-react";

interface ProjectCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  tags: string[];
}

const projects: ProjectCard[] = [
  {
    title: "Freight Consolidation Planner",
    description: "An AI-powered solution that helps combine multiple shipments into a single truck or container to reduce costs for IT industry in Asia.",
    icon: <Box className="w-10 h-10 text-primary" />,
    url: "https://freight-harmony-synergy.lovable.app/",
    tags: ["Logistics", "Cost Optimization", "AI"]
  },
  {
    title: "Disruption Impact Analyzer",
    description: "Models the financial and operational impact of supply chain disruptions using advanced analytics.",
    icon: <AlertTriangle className="w-10 h-10 text-primary" />,
    url: "https://supply-chain-sentinel.lovable.app/auth",
    tags: ["Risk Analysis", "Financial Modeling", "Supply Chain"]
  },
  {
    title: "Shipment Delay Predictor",
    description: "Uses AI to forecast potential delays based on historical data and external factors like weather and traffic conditions.",
    icon: <Timer className="w-10 h-10 text-primary" />,
    url: "https://supply-chain-sentinel.lovable.app/auth",
    tags: ["AI Forecasting", "Logistics", "Real-time"]
  },
  {
    title: "Geospatial Supply Chain Mapper",
    description: "Visualizes supply chain nodes and their dependencies on a global map for better decision making.",
    icon: <Globe className="w-10 h-10 text-primary" />,
    url: "https://supply-chain-sentinel.lovable.app/auth",
    tags: ["Visualization", "Mapping", "Supply Chain"]
  },
  {
    title: "Risk Mitigation Scenario Planner",
    description: "Simulates alternate sourcing or routing scenarios for high-risk situations to ensure business continuity.",
    icon: <BarChart2 className="w-10 h-10 text-primary" />,
    url: "https://supply-chain-sentinel.lovable.app/auth",
    tags: ["Risk Management", "Simulation", "Planning"]
  }
];

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
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Project Showcase</h2>
            <p className="text-lg text-muted-foreground">
              Visual demonstrations of our AI solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-transform hover:scale-105 duration-300"
              >
                <Card className="h-full border-2 hover:border-primary transition-colors duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {project.icon}
                      <div className="flex gap-2">
                        {project.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </a>
            ))}
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
