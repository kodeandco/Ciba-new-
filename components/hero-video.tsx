"use client"

import { useEffect, useState, useRef } from "react"
import { X, Volume2, VolumeX, ArrowRight, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HeroVideo() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollIndicator(false), 4000)

    // Ensure background video plays
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Autoplay prevented:', error)
      })
    }

    return () => clearTimeout(timer)
  }, [])

  const handleVideoClick = () => {
    setIsFullscreen(true)
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.play().catch(error => {
        console.log('Video play interrupted:', error)
      })
    }
  }

  const handleClose = () => {
    setIsFullscreen(false)
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.pause()
      fullscreenVideoRef.current.currentTime = 0
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.muted = !isMuted
    }
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      {/* Background Video Section - Full Screen */}
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* Video Background - Always Playing */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={(e) => {
            const video = e.currentTarget
            video.play().catch(err => console.log('Play error:', err))
          }}
        >
          <source src="/Screen Recording 2025-10-23 113537.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        {/* Centered Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="text-center px-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards] text-white">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                CIBA
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-12 opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
              Where Innovation Meets <span className="text-blue-400">Opportunity</span>
            </p>

            {/* Floating Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-[fadeInBounce_1.2s_ease-out_0.9s_forwards]">
              {/* Apply Now Button */}
              <button
                onClick={() => scrollToSection("programs")}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-[0_10px_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_20px_60px_-10px_rgba(59,130,246,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-3 min-w-[200px] justify-center animate-[float_3s_ease-in-out_infinite] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-blue-400 before:to-blue-500 before:blur-xl before:opacity-50 before:-z-10 hover:before:opacity-75"
              >
                <span className="relative z-10 drop-shadow-lg">Apply Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10 drop-shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out] pointer-events-none" />
              </button>

              {/* Contact Us Button */}
              <button
                onClick={() => scrollToSection("contact")}
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border-2 border-blue-400 shadow-[0_10px_40px_-10px_rgba(96,165,250,0.5),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:shadow-[0_20px_60px_-10px_rgba(96,165,250,0.7),inset_0_1px_0_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white/20 hover:border-blue-300 flex items-center gap-3 min-w-[200px] justify-center animate-[float_3s_ease-in-out_0.5s_infinite] before:absolute before:inset-0 before:rounded-full before:bg-blue-400/30 before:blur-xl before:opacity-40 before:-z-10 hover:before:opacity-60"
              >
                <Mail className="w-5 h-5 drop-shadow-lg" />
                <span className="drop-shadow-lg">Contact Us</span>
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full border-2 border-blue-300/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                {/* Inner highlight */}
                <div className="absolute top-1 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-500 ${showScrollIndicator ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="text-white text-sm mb-2 text-center">Scroll to explore</div>
          <div className="text-white text-2xl animate-bounce">
            ↓
          </div>
        </div>
      </section>

      {/* Fullscreen Video Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={fullscreenVideoRef}
              controls
              autoPlay
              muted={isMuted}
              className="w-full h-full object-contain"
            >
              <source src="/Screen Recording 2025-10-23 113537.mp4" type="video/mp4" />
            </video>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInBounce {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(1.05);
          }
          70% {
            transform: translateY(5px) scale(0.98);
          }
          85% {
            transform: translateY(-3px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
      `}</style>
    </>
  )
}