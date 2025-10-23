"use client"

import { useEffect, useState, useRef } from "react"
import { X, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroVideo() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollIndicator(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleVideoClick = () => {
    setIsFullscreen(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleClose = () => {
    setIsFullscreen(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  return (
    <>
      {/* Background Video Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/ciba-intro.mp4" type="video/mp4" />
        </video>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

        {/* Centered Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 cursor-pointer group"
          onClick={handleVideoClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight">
              Welcome to CIBA
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">Where Innovation Meets Opportunity</p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-gray-300 group-hover:text-white transition-colors"
            >
              Click to play video
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: showScrollIndicator ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="text-white text-sm mb-2 text-center">Scroll to explore</div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="text-white text-2xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* Fullscreen Video Modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <video ref={videoRef} controls autoPlay className="w-full h-full object-contain">
              <source src="/Screen Recording 2025-10-23 113537.mp4" type="video/mp4" />
            </video>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </motion.button>

            {/* Mute Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  )
}
