"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, type Transition } from "framer-motion"

interface AnimatedSectionProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down" | "zoom" | "fade" | "rotate" | "flip" | "blur" | "slide-rotate" | "bounce" | "elastic"
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
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const getAnimation = () => {
    switch (direction) {
      case "left":
        return {
          initial: { opacity: 0, x: -60, rotateY: 10 },
          animate: { opacity: 1, x: 0, rotateY: 0 },
          transition: { duration: 0.8, delay } as Transition
        }
      case "right":
        return {
          initial: { opacity: 0, x: 60, rotateY: -10 },
          animate: { opacity: 1, x: 0, rotateY: 0 },
          transition: { duration: 0.8, delay } as Transition
        }
      case "up":
        return {
          initial: { opacity: 0, y: 60, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.8, delay } as Transition
        }
      case "down":
        return {
          initial: { opacity: 0, y: -60, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.8, delay } as Transition
        }
      case "zoom":
        return {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.7, delay } as Transition
        }
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 1, delay } as Transition
        }
      case "rotate":
        return {
          initial: { opacity: 0, rotate: -180, scale: 0.5 },
          animate: { opacity: 1, rotate: 0, scale: 1 },
          transition: { duration: 0.9, delay } as Transition
        }
      case "flip":
        return {
          initial: { opacity: 0, rotateX: 90, transformPerspective: 1000 },
          animate: { opacity: 1, rotateX: 0 },
          transition: { duration: 0.8, delay } as Transition
        }
      case "blur":
        return {
          initial: { opacity: 0, filter: "blur(20px)", scale: 1.1 },
          animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
          transition: { duration: 0.8, delay } as Transition
        }
      case "slide-rotate":
        return {
          initial: { opacity: 0, x: -100, rotate: -45 },
          animate: { opacity: 1, x: 0, rotate: 0 },
          transition: { duration: 0.9, delay } as Transition
        }
      case "bounce":
        return {
          initial: { opacity: 0, y: -100 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.8,
            delay,
            type: "spring",
            stiffness: 200,
            damping: 15
          } as Transition
        }
      case "elastic":
        return {
          initial: { opacity: 0, scale: 0, rotate: -180 },
          animate: { opacity: 1, scale: 1, rotate: 0 },
          transition: {
            duration: 1.2,
            delay,
            type: "spring",
            stiffness: 100,
            damping: 10
          } as Transition
        }
      default:
        return {
          initial: { opacity: 0, y: 60 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay } as Transition
        }
    }
  }

  const animation = getAnimation()

  return (
    <motion.div
      ref={ref}
      initial={animation.initial}
      animate={isInView ? animation.animate : {}}
      transition={animation.transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}