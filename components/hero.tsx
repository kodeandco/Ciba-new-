"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowRight, Zap, Users, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  const fullText = "Accelerate Your Startup Journey with Expert Guidance"
  const [typedText, setTypedText] = useState("")
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)

  // Typewriter effect
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1))
      index++

      // Show subtitle after half of title is typed
      if (index === Math.floor(fullText.length / 2)) {
        setShowSubtitle(true)
      }

      if (index === fullText.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer for Hero section animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting))
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Blue styled part of title
  const getStyledTitle = () => {
    const bluePart = "Startup Journey"
    const beforeBlue = typedText.split(bluePart)[0] || ""
    const afterBlue = typedText.includes(bluePart) ? typedText.split(bluePart)[1] : ""
    return (
      <>
        <span>{beforeBlue}</span>
        {typedText.includes(bluePart) && <span className="text-blue-600">{bluePart}</span>}
        <span>{afterBlue}</span>
      </>
    )
  }

  // Scroll to Programs section
  const scrollToPrograms = () => {
    const section = document.getElementById("programs")
    section?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-blue opacity-5 blur-3xl animate-float" />
      <div
        className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          {/* Subtitle above title */}
          <motion.p
            className="text-primary font-semibold text-lg mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={showSubtitle && inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Your Growth Partner in Navi Mumbai
          </motion.p>

          {/* Typewriter Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            {getStyledTitle()}
            <span className="animate-pulse">|</span>
          </h1>

          {/* Description / subtitle appears after half title typed */}
          {showSubtitle && (
            <motion.p
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Join India's leading incubation center in Vashi. Get access to world-class mentorship, funding opportunities, and a thriving community of entrepreneurs ready to scale.
            </motion.p>
          )}

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.button
              onClick={scrollToPrograms}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center gap-2 group shadow-lg"
            >
              Start Your Application
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={scrollToPrograms}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
            >
              Book Free Consultation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
