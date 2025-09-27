"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sprout, Menu, X } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-white">AgriNuel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-white/80 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-white/80 hover:text-primary transition-colors">
              How it Works
            </Link>
            <Link href="/#testimonials" className="text-white/80 hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="/#pricing" className="text-white/80 hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 cursor-pointer">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 cursor-pointer">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link href="/#features" className="text-white/80 hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-white/80 hover:text-primary transition-colors">
                How it Works
              </Link>
              <Link href="/#testimonials" className="text-white/80 hover:text-primary transition-colors">
                Testimonials
              </Link>
              <Link href="/#pricing" className="text-white/80 hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-primary transition-colors">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button asChild variant="ghost" className="text-white hover:bg-white/10 cursor-pointer">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 cursor-pointer">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
