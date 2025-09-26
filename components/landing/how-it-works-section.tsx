import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Search, MessageSquare, Truck, CheckCircle, Star } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your account as a farmer or buyer in just 2 minutes",
      details: "Choose your role, verify your identity, and set up your profile with location and preferences.",
    },
    {
      number: "2",
      icon: Search,
      title: "Browse & Connect",
      description: "Find the best produce or customers in your area",
      details:
        "Use our smart search and filtering system to find exactly what you need based on location, price, and quality.",
    },
    {
      number: "3",
      icon: MessageSquare,
      title: "Negotiate & Chat",
      description: "Communicate directly to get the best deals",
      details:
        "Use our built-in chat system to discuss prices, quantities, and delivery terms directly with trading partners.",
    },
    {
      number: "4",
      icon: Truck,
      title: "Arrange Delivery",
      description: "Book logistics and track your shipment",
      details:
        "Choose from our network of verified logistics partners or arrange your own delivery with route optimization.",
    },
    {
      number: "5",
      icon: CheckCircle,
      title: "Complete Transaction",
      description: "Secure payment and delivery confirmation",
      details: "Make secure payments through our platform and confirm delivery with our quality assurance system.",
    },
    {
      number: "6",
      icon: Star,
      title: "Rate & Review",
      description: "Build trust through feedback and ratings",
      details: "Rate your trading experience to help build a trusted community of farmers and buyers.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-primary text-sm font-medium">🚀 Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            How <span className="text-gradient">AgriNuel</span> works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Get started in minutes and transform your agricultural business with our simple, step-by-step process
            designed for farmers and buyers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative hover-lift border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground mb-4 text-pretty">{step.description}</p>
                <p className="text-sm text-muted-foreground/80 text-pretty">{step.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Join thousands of farmers and buyers who are already transforming their agricultural business with
              AgriNuel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-slate-900 hover:bg-white/90 px-8 py-3 rounded-lg font-medium transition-colors">
                Start as Farmer
              </button>
              <button className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors">
                Start as Buyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
