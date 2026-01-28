"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Maximize2, Minimize2 } from "lucide-react"
import AnimatedSection from "./animated-section"
import PanoramaTour from "./360 Panorama/PanoramaTour"

export default function TourSection() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <AnimatedSection direction="up">
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-background via-card to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-reveal-up">
              Take a Virtual Tour
            </h2>
            <p className="text-lg text-primary max-w-2xl mx-auto animate-fade-in">
              Explore CIBA's state-of-the-art facilities and collaborative spaces through our 360-degree panoramic tour
            </p>
          </motion.div>

          <motion.div
            layout
            className={`relative rounded-2xl overflow-hidden shadow-2xl hover-glow-interactive ${isExpanded ? "fixed inset-4 z-50" : "w-full aspect-video"
              }`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* PanoramaTour Component - Full Size */}
            <div className="w-full h-full relative bg-background">
              <PanoramaTour />

              {/* Expand/Collapse Button */}
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute top-4 right-4 z-[60] bg-card/80 hover:bg-card backdrop-blur-sm p-3 rounded-lg transition-all border border-border hover-lift"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isExpanded ? (
                  <Minimize2 className="w-6 h-6 text-foreground" />
                ) : (
                  <Maximize2 className="w-6 h-6 text-foreground" />
                )}
              </motion.button>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-primary mt-6 text-sm animate-fade-in"
          >
            💡 Tip: Use your mouse or touch to navigate the panoramic view
          </motion.p>
        </div>
      </section>
    </AnimatedSection>
  )
}