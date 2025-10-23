"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Maximize2, Minimize2 } from "lucide-react"
import AnimatedSection from "./animated-section"

export default function TourSection() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <AnimatedSection direction="up">
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Take a Virtual Tour</h2>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              Explore CIBA's state-of-the-art facilities and collaborative spaces through our 360-degree panoramic tour
            </p>
          </motion.div>

          <motion.div
            layout
            className={`relative rounded-2xl overflow-hidden shadow-2xl ${
              isExpanded ? "fixed inset-4 z-50" : "w-full aspect-video"
            }`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Placeholder for 360 Panoramic Tour Component */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center relative overflow-hidden">
              {/* Animated background elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-0 opacity-10"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent)]" />
              </motion.div>

              <div className="relative z-10 text-center text-white">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="mb-4"
                >
                  <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Maximize2 className="w-10 h-10" />
                  </div>
                </motion.div>
                <p className="text-xl font-semibold mb-2">360° Panoramic Tour</p>
                <p className="text-blue-100">Drag to explore or click expand to fullscreen</p>
              </div>

              {/* Expand/Collapse Button */}
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isExpanded ? (
                  <Minimize2 className="w-6 h-6 text-white" />
                ) : (
                  <Maximize2 className="w-6 h-6 text-white" />
                )}
              </motion.button>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-blue-600 mt-6 text-sm"
          >
            💡 Tip: Use your mouse or touch to navigate the panoramic view
          </motion.p>
        </div>
      </section>
    </AnimatedSection>
  )
}
