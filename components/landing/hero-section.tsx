import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sprout, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-hero grid-pattern overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <div className="bg-primary/20 p-4 rounded-full">
            <Sprout className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: "2s" }}>
          <div className="bg-accent/20 p-4 rounded-full">
            <TrendingUp className="h-8 w-8 text-accent" />
          </div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: "4s" }}>
          <div className="bg-primary/20 p-4 rounded-full">
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-dark border border-white/20 mb-8 animate-fade-in-up">
            <span className="text-primary text-sm font-medium">🌱 Revolutionizing Agriculture</span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fade-in-up text-balance"
            style={{ animationDelay: "0.2s" }}
          >
            The complete platform to <span className="text-gradient">connect farmers</span> with buyers.
          </h1>

          {/* Subheadline */}
          <p
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto animate-fade-in-up text-pretty"
            style={{ animationDelay: "0.4s" }}
          >
            Cut out middlemen, increase profits, and get fresh produce at better prices. Securely trade, track prices,
            and optimize logistics with AgriNuel.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-white/90 text-lg px-8 py-4">
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
            >
              <Link href="#demo">
                <Play className="mr-2 h-5 w-5" /> Watch Demo
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            {[
              { number: "50%", label: "Higher profits for farmers", subtext: "vs traditional markets" },
              { number: "30%", label: "Lower prices for buyers", subtext: "direct from source" },
              { number: "10,000+", label: "Active users", subtext: "across Nigeria" },
              { number: "24/7", label: "Live price tracking", subtext: "real-time updates" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
