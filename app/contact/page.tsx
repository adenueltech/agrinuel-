import { Navigation } from "@/components/landing/navigation"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <ContactSection />
      <Footer />
    </div>
  )
}