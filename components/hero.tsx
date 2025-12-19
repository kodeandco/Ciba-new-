"use client"

import { useEffect, useRef, useState } from "react"
import { Rocket, Users, TrendingUp, Award, Sparkles } from "lucide-react"
import { motion, useInView } from "framer-motion"

export default function Hero() {
  const fullText = "Accelerate Your Startup Journey with Expert Guidance"
  const [typedText, setTypedText] = useState("")
  const [showSubtitle, setShowSubtitle] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-15%" })

  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const stats = [
    { icon: Rocket, value: 200, suffix: "+", label: "Startups Incubated" },
    { icon: Users, value: 50, suffix: "+", label: "Expert Mentors" },
    { icon: TrendingUp, value: 100, suffix: "Cr+", label: "Funding Raised" },
    { icon: Award, value: 85, suffix: "%", label: "Success Rate" },
  ]

  const [counters, setCounters] = useState(stats.map(() => 0))
  const [hasAnimated, setHasAnimated] = useState(false)

  // Typewriter Effect
  useEffect(() => {
    if (!inView) return
    let i = 0
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1))
      i++
      if (i === Math.floor(fullText.length * 0.65)) setShowSubtitle(true)
      if (i === fullText.length) {
        clearInterval(interval)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [inView])

  // Counter Animation
  useEffect(() => {
    if (!inView || hasAnimated) return
    setHasAnimated(true)

    stats.forEach((stat, index) => {
      let start = 0
      const end = stat.value
      const duration = 2600
      const steps = 80
      const increment = end / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        start += increment
        if (step >= steps) {
          start = end
          clearInterval(timer)
        }
        setCounters(prev => {
          const updated = [...prev]
          updated[index] = Math.floor(start)
          return updated
        })
      }, duration / steps)
    })
  }, [inView])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const getStyledTitle = () => {
    const parts = typedText.split("Startup Journey")
    if (parts.length === 1) return <span>{typedText}</span>

    return (
      <>
        {parts[0]}
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-black">
          Startup Journey
        </span>
        {parts[1]}
      </>
    )
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 bg-white"
    >
      {/* Subtle Cursor Glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        animate={{
          background: `radial-gradient(900px at ${mouse.x}px ${mouse.y}px, rgba(59,130,246,0.10), transparent 70%)`,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 100 }}
      />

      {/* Very Subtle Orbs for Depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/4 to-indigo-300/3 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-300/4 to-blue-300/3 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 text-blue-700 font-semibold text-sm mb-8 px-6 py-3 bg-blue-50/70 backdrop-blur rounded-full border border-blue-100/50"
          >
            <Sparkles className="w-4 h-4" />
            Your Growth Partner in Navi Mumbai
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-slate-900 mb-10">
            <motion.div className="inline-block">
              {getStyledTitle()}
            </motion.div>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={showSubtitle ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed font-light"
          >
            Join India’s leading incubation center. Access elite mentorship,
            strategic funding, and a refined ecosystem designed for sustainable,
            high-impact growth.
          </motion.p>

          {/* Stats Section */}
          <div className="w-full max-w-5xl mx-auto py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <stat.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <div className="text-4xl lg:text-5xl font-black text-slate-900 mb-1">
                    {counters[index]}{stat.suffix}
                  </div>
                  <p className="text-slate-600 font-medium text-sm">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Seamless Blend to Next Section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-slate-50 to-slate-100" />
    </section>
  )
}