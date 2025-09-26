import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  TrendingUp,
  Truck,
  MessageCircle,
  Shield,
  Sprout,
  MapPin,
  CreditCard,
  BarChart3,
  Clock,
  Smartphone,
  Globe,
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Direct Connection",
      description: "Connect farmers and buyers without middlemen for better prices and fresher produce",
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      title: "Live Price Tracking",
      description: "Real-time market prices and trends to help you make informed decisions",
      color: "text-accent",
    },
    {
      icon: Truck,
      title: "Smart Logistics",
      description: "Integrated delivery booking and route optimization for efficient transport",
      color: "text-blue-400",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Communicate directly with farmers and buyers for better deals",
      color: "text-green-400",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing with multiple payment options",
      color: "text-purple-400",
    },
    {
      icon: Sprout,
      title: "Quality Assurance",
      description: "Quality grading and verification system for premium produce",
      color: "text-primary",
    },
    {
      icon: MapPin,
      title: "Location-Based",
      description: "Find farmers and buyers in your area for faster delivery",
      color: "text-red-400",
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description: "Multiple payment methods including mobile money and bank transfers",
      color: "text-yellow-400",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into your trading performance and trends",
      color: "text-indigo-400",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you succeed",
      color: "text-pink-400",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Fully responsive design that works perfectly on all devices",
      color: "text-cyan-400",
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Available in multiple local languages for better accessibility",
      color: "text-orange-400",
    },
  ]

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-primary text-sm font-medium">✨ Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Everything you need to <span className="text-gradient">revolutionize</span> agriculture
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Our comprehensive platform provides all the tools farmers and buyers need to connect, trade, and grow their
            businesses efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover-lift border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`p-3 rounded-lg bg-background w-fit mb-4 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
