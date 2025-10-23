"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Founder, TechStart India",
    content: "CIBA Mumbai transformed our startup journey. The mentorship and network access were invaluable.",
    avatar: "🚀",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "CEO, GreenTech Solutions",
    content: "The resources and support from CIBA helped us scale from 5 to 50 employees in just 18 months.",
    avatar: "💚",
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Co-founder, FinFlow",
    content: "Being part of the CIBA community opened doors we never thought possible. Highly recommended!",
    avatar: "💰",
  },
  {
    id: 4,
    name: "Neha Desai",
    role: "Founder, EduTech Pro",
    content: "The incubation program at CIBA is comprehensive and well-structured. Best decision ever!",
    avatar: "📚",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlay(false)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Success Stories</h2>
        <p className="text-lg text-muted-foreground">Hear from our thriving startup community</p>
      </div>

      <div className="relative">
        {/* Carousel Container */}
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div className="relative rounded-2xl p-[3px] overflow-hidden transition-transform duration-500 ease-in-out hover:scale-105">
                  {/* Animated glow border */}
                  <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_0deg,_#3b82f6,_#06b6d4,_#3b82f6)] animate-[spin_6s_linear_infinite]" />

                  {/* Card content */}
                  <div className="relative rounded-2xl bg-background p-8 sm:p-12 text-center">
                    <p className="text-5xl mb-4 animate-bounce-subtle">{testimonial.avatar}</p>
                    <p className="text-lg text-foreground mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 p-2 hover:bg-primary/10 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 p-2 hover:bg-primary/10 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrent(index)
                setIsAutoPlay(false)
              }}
              className={`w-2 h-2 rounded-full transition-all ${index === current ? "bg-primary w-8" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}