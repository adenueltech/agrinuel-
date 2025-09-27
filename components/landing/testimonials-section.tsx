import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Adebayo Ogundimu",
      role: "Tomato Farmer",
      location: "Kaduna State",
      image: "/nigerian-farmer-portrait.jpg",
      rating: 5,
      quote:
        "AgriNuel has transformed my farming business. I now sell directly to buyers and earn 60% more than before. The platform is easy to use and the support team is excellent.",
      metrics: "60% increase in profits",
    },
    {
      name: "Fatima Aliyu",
      role: "Vegetable Supplier",
      location: "Lagos State",
      image: "/nigerian-businesswoman-portrait.jpg",
      rating: 5,
      quote:
        "As a buyer, I love how I can source fresh vegetables directly from farmers. The quality is better and prices are 40% lower than traditional markets.",
      metrics: "40% cost savings",
    },
    {
      name: "Chinedu Okoro",
      role: "Rice Farmer",
      location: "Kebbi State",
      image: "/nigerian-rice-farmer-portrait.jpg",
      rating: 5,
      quote:
        "The logistics feature is amazing! I can now deliver my rice to buyers across Nigeria efficiently. The route optimization saves me time and fuel costs.",
      metrics: "30% logistics savings",
    },
    {
      name: "Aisha Mohammed",
      role: "Restaurant Owner",
      location: "Abuja",
      image: "/nigerian-restaurant-owner-portrait.jpg",
      rating: 5,
      quote:
        "Fresh ingredients delivered directly from farms to my restaurant. My customers notice the quality difference and my food costs have reduced significantly.",
      metrics: "25% cost reduction",
    },
    {
      name: "Emeka Nwankwo",
      role: "Cassava Farmer",
      location: "Enugu State",
      image: "/nigerian-cassava-farmer-portrait.jpg",
      rating: 5,
      quote:
        "The live price tracking helps me decide when to sell for maximum profit. I've increased my income by 45% since joining AgriNuel last year.",
      metrics: "45% income increase",
    },
    {
      name: "Kemi Adebisi",
      role: "Food Processor",
      location: "Ogun State",
      image: "/nigerian-food-processor-portrait.jpg",
      rating: 5,
      quote:
        "Sourcing raw materials has never been easier. The chat feature allows me to build relationships with farmers and ensure consistent supply for my processing plant.",
      metrics: "Consistent supply chain",
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-primary text-sm font-medium">💬 Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Trusted by <span className="text-gradient">10,000+</span> farmers and buyers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            See how AgriNuel is transforming agricultural businesses across Nigeria, creating prosperity for farmers and
            value for buyers.
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover-lift border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in-up flex-shrink-0 w-80 snap-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/30 mb-4" />

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-6 text-pretty">"{testimonial.quote}"</p>

                {/* Metrics */}
                <div className="bg-primary/5 rounded-lg p-3 mb-4">
                  <p className="text-primary font-semibold text-sm">{testimonial.metrics}</p>
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">Trusted by leading agricultural organizations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-2xl font-bold">FADAMA</div>
            <div className="text-2xl font-bold">NIRSAL</div>
            <div className="text-2xl font-bold">CBN</div>
            <div className="text-2xl font-bold">FMARD</div>
          </div>
        </div>
      </div>
    </section>
  )
}
