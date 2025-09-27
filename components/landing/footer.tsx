import Link from "next/link"
import { Sprout, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AgriNuel</span>
            </div>
            <p className="text-slate-300 mb-4 max-w-md">
              Connecting farmers and buyers across Nigeria, revolutionizing agriculture through direct trade,
              price tracking, and optimized logistics.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Mail className="h-4 w-4" />
                <span>support@agrinuel.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 AgriNuel. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm mt-2 md:mt-0">
            Developed by{" "}
            <Link
              href="https://github.com/adenueltech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              adenueltech
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}