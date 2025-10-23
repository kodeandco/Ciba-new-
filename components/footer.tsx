"use client"

import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="animate-slide-in-left">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg gradient-sunrise flex items-center justify-center text-white font-bold hover-glow">
                C
              </div>
              <h3 className="text-lg font-bold">CIBA Mumbai</h3>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Empowering entrepreneurs and fostering innovation in Navi Mumbai.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Programs", "Startups", "Blog"].map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-background/80 hover:text-background transition-all">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 hover:translate-x-1 transition-all">
                <MapPin size={16} />
                <span className="text-background/80">Vashi, Navi Mumbai</span>
              </li>
              <li className="flex items-center gap-2 hover:translate-x-1 transition-all">
                <Phone size={16} />
                <a href="tel:+919876543210" className="text-background/80 hover:text-background transition-all">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2 hover:translate-x-1 transition-all">
                <Mail size={16} />
                <a
                  href="mailto:info@cibamumbai.com"
                  className="text-background/80 hover:text-background transition-all"
                >
                  info@cibamumbai.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="animate-slide-in-right">
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-background/20 flex items-center justify-center hover:bg-background/30 transition-all hover:scale-110 hover-glow"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-12 rounded-xl overflow-hidden h-64 bg-background/20 hover-glow">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.7547849999997!2d72.99!3d19.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8f8f8f8f8f9%3A0x0!2sVashi%2C%20Navi%20Mumbai!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-background/80">
          <p>&copy; 2025 CIBA Mumbai. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-background transition-all">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-background transition-all">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
