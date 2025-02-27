import { Brain, Code, Database, Network, Bot, Shield, ChartLine, Cloud, FileText, GraduationCap, Settings, Puzzle, Users, Rocket, DollarSign, Lock, Boxes, Scale, HeartHandshake, Truck, Route, TrendingUp, AlertTriangle, Package, BoxSelect } from "lucide-react";
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

  const supplyChainFeatures = [
    {
      icon: <Package className="w-8 h-8 text-white" />,
      title: "Natural Language Query",
      description: "Ask complex supply chain questions in plain language and get instant, actionable insights."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "AI-Assisted Scenario Planning",
      description: "Simulate 'what-if' scenarios to predict outcomes, optimize inventory, and mitigate risks."
    },
    {
      icon: <ChartLine className="w-8 h-8 text-white" />,
      title: "Demand Forecasting",
      description: "Leverage predictive analytics to anticipate market demands and align supply chain operations."
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-white" />,
      title: "Real-Time Monitoring",
      description: "Gain visibility into your supply chain with real-time tracking and AI-powered alerts for disruptions."
    },
    {
      icon: <BoxSelect className="w-8 h-8 text-white" />,
      title: "Supplier Risk Assessment",
      description: "Use AI to evaluate supplier performance and identify potential risks before they impact your operations."
    },
    {
      icon: <Route className="w-8 h-8 text-white" />,
      title: "Route Optimization",
      description: "Automate logistics planning with AI-driven route optimization for faster, cost-effective deliveries."
    }
  ];

  const keyBenefits = [
    {
      icon: <Puzzle className="w-8 h-8 text-primary" />,
      title: "Tailored AI Solutions",
      description: "Custom AI solutions aligned perfectly with your unique business objectives and challenges."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "End-to-End Expertise",
      description: "Comprehensive AI services from strategy to implementation and ongoing support."
    },
    {
      icon: <ChartLine className="w-8 h-8 text-primary" />,
      title: "Proven Industry Experience",
      description: "Successful track record across retail, healthcare, finance, and manufacturing sectors."
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Future-Ready Technology",
      description: "Leveraging latest AI advancements including generative AI, computer vision, and NLP."
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Enterprise-Grade Security",
      description: "Industry-leading security protocols and best practices for robust protection."
    },
    {
      icon: <Boxes className="w-8 h-8 text-primary" />,
      title: "Seamless Integration",
      description: "Smooth integration with existing systems, minimizing disruption and maximizing ROI."
    },
    {
      icon: <Scale className="w-8 h-8 text-primary" />,
      title: "Cost-Effective & Scalable",
      description: "High-impact solutions that fit your budget and grow with your business."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-primary" />,
      title: "Dedicated Partnership",
      description: "Your trusted AI partner throughout your digital transformation journey."
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

      {/* Supply Chain Optimization Section */}
      <section className="py-16 bg-[#8B5CF6] text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supply Chain Optimization with AI</h2>
            <p className="text-lg opacity-90 mb-4">
              Revolutionize your supply chain operations with AI-driven solutions designed to enhance efficiency, reduce costs, and improve decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplyChainFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4 text-xl text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-white/80">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg font-semibold mb-4">Why Choose Us?</p>
            <p className="max-w-2xl mx-auto text-white/90">
              Our AI solutions are tailored to the unique challenges of supply chain management, helping you build a resilient, agile, and future-ready supply chain.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Benefits</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Why Choose Our AI Consulting Services
            </p>
            <p className="text-muted-foreground">
              At Practical AIML, we are committed to delivering cutting-edge AI solutions that drive innovation, efficiency, and growth for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyBenefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    {benefit.icon}
                    <CardTitle className="mt-4 text-xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business with AI?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let's build the future together. Contact us today to schedule a free consultation and discover how our AI consulting services can unlock new possibilities for your business.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
