"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)

  const whatsappNumber = "918850283239" // +91 88502 83239
  const message = "Hi! I'm interested in learning more about CIBA Mumbai's incubation programs."

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  if (!isVisible) return null

  return (
    <>
      {/* Tooltip */}
      {showTooltip && (
        <div className="fixed bottom-24 right-4 z-50 animate-bounce">
          <div className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-1 -right-1 bg-white text-blue-600 rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Close tooltip"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="pr-3">Need help? Chat with us!</p>
            <div className="absolute -bottom-1 right-6 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-blue-600"></div>
          </div>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="fixed bottom-20 right-20 z-50 bg-gray-800 text-white p-1.5 rounded-full shadow-lg hover:bg-gray-700 transition-all hover:scale-110"
        aria-label="Hide WhatsApp button"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 bg-blue-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-blue-600 transition-all duration-300 hover:shadow-blue-500/50 group animate-pulse-slow"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />

        {/* Online indicator */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-400 rounded-full border-2 border-white animate-pulse" />
      </button>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  )
}