
import { Brain, Code, Database, Network, Bot, Shield, ChartLine, Cloud, FileText, GraduationCap, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  const serviceCategories = [
    {
      title: "AI and Machine Learning Services",
      icon: <Brain className="w-8 h-8 text-primary" />,
      services: [
        "AI readiness assessment for businesses",
        "Custom AI roadmap development tailored to business goals",
        "Identifying high-impact AI use cases for your industry",
      ]
    },
    {
      title: "Machine Learning Model Development",
      icon: <Bot className="w-8 h-8 text-primary" />,
      services: [
        "Custom ML model design, development, and deployment",
        "Predictive analytics and forecasting solutions",
        "Natural Language Processing (NLP) for chatbots",
        "Computer Vision solutions for image recognition"
      ]
    },
    {
      title: "AI Integration",
      icon: <Network className="w-8 h-8 text-primary" />,
      services: [
        "Integrating AI/ML models into existing business systems",
        "API development for seamless AI model integration",
        "Cloud-based AI solutions (AWS, Azure, Google Cloud)"
      ]
    },
    {
      title: "AI Automation",
      icon: <Settings className="w-8 h-8 text-primary" />,
      services: [
        "Process automation using AI",
        "Robotic Process Automation (RPA) with AI capabilities"
      ]
    },
    {
      title: "AI Training and Support",
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      services: [
        "Training teams on AI tools and technologies",
        "Ongoing AI model maintenance and optimization"
      ]
    },
    {
      title: "Data Services",
      icon: <Database className="w-8 h-8 text-primary" />,
      services: [
        "Data pipeline design and implementation",
        "Data warehousing and ETL solutions",
        "Business intelligence dashboards",
        "Data encryption and governance"
      ]
    }
  ];

  const industrySpecific = [
    {
      title: "Retail & E-commerce",
      services: ["Personalized recommendations", "Inventory management"]
    },
    {
      title: "Healthcare",
      services: ["AI-powered diagnostics", "Predictive patient outcomes"]
    },
    {
      title: "Finance",
      services: ["Fraud detection", "AI-driven risk assessment"]
    },
    {
      title: "Manufacturing",
      services: ["Predictive maintenance", "Quality control via computer vision"]
    }
  ];

  return (
    <main className="pt-20">
      {/* Services List Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive AI solutions for your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    {category.icon}
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industry-Specific Solutions</h2>
            <p className="text-lg text-muted-foreground">
              Tailored AI solutions for different sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industrySpecific.map((industry, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{industry.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {industry.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Transform your business with our AI solutions today
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
