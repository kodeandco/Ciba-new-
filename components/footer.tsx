"use client"

import { Mail, Phone, MapPin, Linkedin, Instagram, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,250px] gap-6 mb-4 items-center">

          {/* Left Side - Contact & Social */}
          <div className="flex flex-col justify-center items-center lg:items-start gap-4">

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap items-center justify-center lg:justify-start">
              <a
                href="https://maps.google.com/?q=Vashi,Navi+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              >
                <MapPin size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-m">Vashi, Navi Mumbai</span>
              </a>

              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              >
                <Phone size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-m">+91 98765 43210</span>
              </a>

              <a
                href="mailto:info@cibamumbai.com"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              >
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-m">info@cibamumbai.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-2.5 justify-center lg:justify-start">
              
              <a
                href="https://www.instagram.com/cibaindia/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>

              <a
                href="https://wa.me/918850283239"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-all hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="rounded-xl overflow-hidden h-32 lg:h-32 bg-white/10 ring-1 ring-white/20 hover:ring-white/40 transition-all mx-auto lg:mx-0 w-full max-w-md lg:max-w-none">
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

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-m text-white/60">
          <p>&copy; 2025 CIBA Mumbai. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}