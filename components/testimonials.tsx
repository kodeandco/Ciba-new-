"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Testimonial {
  _id: string
  name: string
  designation: string
  company: string
  message: string
  image: string
  isActive: boolean
  displayOrder: number
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [current, setCurrent] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/testimonials/active')

      if (!response.ok) {
        throw new Error('Failed to fetch testimonials')
      }

      const data = await response.json()

      if (data.success && data.data) {
        setTestimonials(data.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAutoPlay || testimonials.length === 0) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, testimonials.length])

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlay(false)
  }

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground">Hear from our thriving startup community</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground">Hear from our thriving startup community</p>
        </div>
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchTestimonials}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground">Hear from our thriving startup community</p>
        </div>
        <div className="text-center py-20">
          <p className="text-muted-foreground">No testimonials available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Success Stories</h2>
        <p className="text-lg text-muted-foreground">Hear from our thriving startup community</p>
      </div>

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="w-full flex-shrink-0 px-4">
                <div className="relative rounded-2xl p-[3px] overflow-hidden transition-transform duration-500 ease-in-out hover:scale-105">
                  {/* Animated glow border */}
                  <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_0deg,_#3b82f6,_#06b6d4,_#3b82f6)] animate-[spin_6s_linear_infinite]" />

                  {/* Card content */}
                  <div className="relative rounded-2xl bg-background p-8 sm:p-12">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      {/* Left side - Image (4:3 ratio) */}
                      <div className="flex-shrink-0">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-48 h-36 rounded-lg object-cover shadow-lg"
                            style={{ aspectRatio: '4/3' }}
                          />
                        ) : (
                          <div className="w-48 h-36 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl font-bold shadow-lg text-white">
                            {testimonial.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Right side - Content */}
                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-lg text-foreground mb-6 leading-relaxed">
                          "{testimonial.message}"
                        </p>
                        <div>
                          <p className="font-semibold text-foreground text-lg">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.designation} at {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
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
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 p-2 hover:bg-primary/10 rounded-full transition-all"
          aria-label="Next testimonial"
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
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}