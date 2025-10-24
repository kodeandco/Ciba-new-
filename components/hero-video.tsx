"use client"

import { useEffect, useState, useRef } from "react"
import { X, Volume2, VolumeX } from "lucide-react"

export default function HeroVideo() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null)

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


            <p className="text-xl md:text-2xl text-gray-200 mb-8 opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
              Where Innovation Meets <span className="text-blue-400">Opportunity</span>
            </p>

            <button
              onClick={handleVideoClick}
              className="text-sm text-gray-300 hover:text-white transition-colors opacity-0 animate-[fadeIn_1s_ease-out_0.9s_forwards]"
            >
              Click to play video
            </button>
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
      `}</style>
    </>
  )
}