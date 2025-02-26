
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Box, BarChart2, AlertTriangle, Timer, Truck, Brain } from "lucide-react";

interface ProjectCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  tags: string[];
  features?: string[];
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
    title: "Supply Chain Sentinel",
    description: "A comprehensive supply chain management platform that combines risk analysis, delay prediction, visualization, and scenario planning in one powerful solution.",
    icon: <AlertTriangle className="w-10 h-10 text-primary" />,
    url: "https://supply-chain-sentinel.lovable.app/auth",
    tags: ["Supply Chain", "Risk Management", "AI"],
    features: [
      "Disruption Impact Analysis: Model financial and operational impacts of supply chain disruptions",
      "Shipment Delay Prediction: AI-powered forecasting of delays using weather and traffic data",
      "Geospatial Supply Chain Mapping: Interactive visualization of supply chain nodes and dependencies",
      "Risk Mitigation Planning: Simulation of alternate sourcing and routing scenarios"
    ]
  },
  {
    title: "Last-Mile Delivery Orchestrator",
    description: "A comprehensive suite of applications designed to optimize last-mile delivery operations, enhance customer satisfaction, and improve driver experience.",
    icon: <Truck className="w-10 h-10 text-primary" />,
    url: "https://last-mile-orchestrator.lovable.app/",
    tags: ["Logistics", "Delivery", "Optimization"],
    features: [
      "Customer Satisfaction Feedback Tracker: Real-time feedback analysis for continuous improvement",
      "Driver-Friendly Route Builder: Smart routing with rest stops and driver preferences",
      "Crowdsourced Returns Pickup: Efficient return logistics through local driver network",
      "Vehicle Loading Optimizer: AI-powered loading sequence optimization",
      "Urban Hub Selector: Strategic micro-fulfillment hub placement for urban deliveries"
    ]
  },
  {
    title: "Invent AI",
    description: "A revolutionary inventory management system powered by advanced AI, natural language processing, and reinforcement learning for optimal stock control and cost reduction.",
    icon: <Brain className="w-10 h-10 text-primary" />,
    url: "https://invent-ai.lovable.app/",
    tags: ["Inventory", "AI", "NLP"],
    features: [
      "Natural Language Database Query: Ask questions about inventory in plain English",
      "Cost Optimization Scenarios: AI-driven simulations for inventory cost reduction",
      "Supply Chain What-If Analysis: Test different inventory strategies with predictive modeling",
      "Reinforcement Learning Optimization: Continuously improving stock level recommendations",
      "Demand Forecasting: Advanced ML models for accurate stock predictions",
      "Automated Reordering: Smart reorder point calculation using multiple variables",
      "Inventory Health Analytics: Real-time monitoring of stock performance metrics"
    ]
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm text-muted-foreground">
                      {project.description}
                    </CardDescription>
                    {project.features && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Key Features:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                          {project.features.map((feature, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
