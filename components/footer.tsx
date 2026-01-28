"use client"

import { Mail, Phone, MapPin, Instagram, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-b from-background to-muted/30 text-foreground py-12 px-4 sm:px-6 lg:px-8 border-t border-border/40"
    >
      <div className="max-w-6xl mx-auto">

        {/* Main Content - Perfectly Centered Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10">

          {/* Left Side - Contact Info */}
          <div className="flex flex-col justify-center space-y-6">

            {/* Section Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2">Get in Touch</h3>

            {/* Address */}
            <a
              href="https://maps.google.com/?q=Vashi,Navi+Mumbai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <MapPin size={18} className="mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
              <span className="text-sm leading-relaxed">
                Fr C Rodrigues Institute of Technology, Agnel Technical Education Complex,
                Near Noor Masjid, Sector 9-A, Vashi, Navi Mumbai – 400703, Maharashtra
              </span>
            </a>

            {/* Social & Contact Icons */}
            <div className="flex gap-4 pt-2">
              <a
                href="tel:+919876543210"
                aria-label="Call us"
                className="group w-11 h-11 rounded-full flex items-center justify-center
                           bg-muted text-primary ring-1 ring-border
                           transition-all duration-300 ease-out
                           hover:bg-primary hover:text-primary-foreground hover:ring-primary hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
              >
                <Phone size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&to=info@cibamumbai.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email us"
                className="group w-11 h-11 rounded-full flex items-center justify-center
                           bg-muted text-accent ring-1 ring-border
                           transition-all duration-300 ease-out
                           hover:bg-accent hover:text-accent-foreground hover:ring-accent hover:scale-110 hover:shadow-lg hover:shadow-accent/25"
              >
                <Mail size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </a>

              <a
                href="https://www.instagram.com/cibaindia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group w-11 h-11 rounded-full flex items-center justify-center
                           bg-muted text-secondary ring-1 ring-border
                           transition-all duration-300 ease-out
                           hover:bg-secondary hover:text-secondary-foreground hover:ring-secondary hover:scale-110 hover:shadow-lg hover:shadow-secondary/25"
              >
                <Instagram size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </a>

              <a
                href="https://wa.me/918850283239"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="group w-11 h-11 rounded-full flex items-center justify-center
                           bg-muted text-primary ring-1 ring-border
                           transition-all duration-300 ease-out
                           hover:bg-primary hover:text-primary-foreground hover:ring-primary hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
              >
                <MessageCircle size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Right Side - Map with Equal Height */}
          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">Find Us</h3>
            <div className="rounded-2xl overflow-hidden h-48 bg-muted ring-1 ring-border/50 hover:ring-primary/30 transition-all shadow-sm hover:shadow-md">
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
          </div>
        </div>

        {/* Bottom Bar - Perfectly Centered */}
        <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 <span className="font-medium text-foreground">CIBA Mumbai</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all hover:after:w-full"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all hover:after:w-full"
            >
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}