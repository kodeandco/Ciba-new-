"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedSectionProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  className?: string
}

export default function AnimatedSection({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const getInitialState = () => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -60, rotateY: 10 }
      case "right":
        return { opacity: 0, x: 60, rotateY: -10 }
      case "up":
        return { opacity: 0, y: 60, scale: 0.9 }
      case "down":
        return { opacity: 0, y: -60, scale: 0.9 }
      default:
        return { opacity: 0, y: 60 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isInView ? { opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.34, 1.56, 0.64, 1], // Spring easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
