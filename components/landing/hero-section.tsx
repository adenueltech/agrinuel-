"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sprout, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)
  const images = ["/hero1.png", "/hero2.png", "/hero3.png"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative min-h-screen grid-pattern overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={images[currentImage]}
          alt={`AgriNuel - ${currentImage === 0 ? 'Nigerian farmer harvesting cassava in lush field' : currentImage === 1 ? 'Fresh produce market stall with colorful fruits and vegetables' : 'Agricultural logistics delivery truck on Nigerian highway'}`}
          fill
          className="object-cover object-center"
          priority
          quality={85}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
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

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-dark border border-white/20 mb-8 animate-fade-in-up">
            <span className="text-primary text-sm font-medium">🌱 Revolutionizing Agriculture</span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-5xl md:text-7xl font-bold text-[#ffffff] mb-8 animate-fade-in-up text-balance"
            style={{ animationDelay: "0.2s" }}
          >
            The complete platform to <span className="text-gradient">connect farmers</span> with buyers.
          </h1>

          {/* Subheadline */}
          <p
            className="text-xl md:text-2xl text-[#ffffff] mb-12 max-w-3xl mx-auto animate-fade-in-up text-pretty"
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
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-white/90 text-lg px-8 py-4 cursor-pointer">
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent cursor-pointer"
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
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
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
