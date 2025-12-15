"use client"

import {
  Award,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Globe
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

/* ----------------------------------
   Icon mapping based on department
----------------------------------- */
const iconMap: Record<string, any> = {
  "Tech Startups": Briefcase,
  "Growth & Scaling": Award,
  "Product Development": Users,
  "Funding & Finance": Award,
  "Digital Marketing": Briefcase,
  "Startup Law": Award
}

interface Mentor {
  _id: string
  name: string
  designation: string
  department: string
  message: string
  image: string | null
  socialMedia?: {
    linkedin?: string
    website?: string
  }
}

export default function MentorsSection() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [slidesPerView, setSlidesPerView] = useState(4)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  /* ----------------------------------
     Fetch mentors from backend
  ----------------------------------- */
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/mentors")
        const data = await res.json()
        setMentors(data)
      } catch (err) {
        console.error("Failed to fetch mentors", err)
      }
    }

    fetchMentors()
  }, [])

  /* ----------------------------------
     Responsive slides
  ----------------------------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSlidesPerView(1)
      else if (window.innerWidth < 1024) setSlidesPerView(2)
      else if (window.innerWidth < 1280) setSlidesPerView(3)
      else setSlidesPerView(4)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  /* ----------------------------------
     Auto play carousel
  ----------------------------------- */
  useEffect(() => {
    if (!isAutoPlaying || mentors.length === 0) return

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, mentors.length - slidesPerView)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 3000)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlaying, mentors.length, slidesPerView])

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return Math.max(0, mentors.length - slidesPerView)
      }
      return prev - 1
    })
  }

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, mentors.length - slidesPerView)
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  // Get the actual visible mentors without duplicates
  const getVisibleMentors = () => {
    if (mentors.length === 0) return []

    // If we have fewer mentors than slides, just show what we have
    if (mentors.length <= slidesPerView) {
      return mentors
    }

    // Otherwise, slice the array to show only the current view
    return mentors.slice(currentIndex, currentIndex + slidesPerView)
  }

  const visibleMentors = getVisibleMentors()
  const actualSlidesPerView = Math.min(slidesPerView, mentors.length)

  if (!mentors.length) {
    return (
      <section className="py-20 text-center text-blue-600">
        Loading mentors...
      </section>
    )
  }

  return (
    <section className="py-20 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Meet Our Mentors
          </h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Learn from industry experts committed to your success
          </p>
        </div>

        <div className="relative">

          {/* Navigation - Only show if we have more mentors than visible slots */}
          {mentors.length > slidesPerView && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
              >
                <ChevronRight />
              </button>
            </>
          )}

          {/* Cards */}
          <div
            className="grid gap-6 transition-all duration-500 justify-items-center"
            style={{ gridTemplateColumns: `repeat(${actualSlidesPerView}, minmax(0, 300px))` }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {visibleMentors.map((mentor, index) => {
              const Icon = iconMap[mentor.department] || Users
              const isHovered = hoveredId === mentor._id

              return (
                <div
                  key={mentor._id}
                  onMouseEnter={() => setHoveredId(mentor._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative rounded-xl overflow-hidden bg-blue-50 w-full max-w-[300px] transition-shadow duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <img
                    src={mentor.image || "/placeholder.svg"}
                    alt={mentor.name}
                    className="w-full h-64 object-cover object-top"
                  />

                  {/* Content */}
                  <div className="relative p-6 min-h-[160px]">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                        }`}
                    />

                    {/* Default Info */}
                    {!isHovered && (
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-blue-900">
                            {mentor.name}
                          </h3>
                        </div>
                        <p className="text-sm text-blue-700 font-semibold">
                          {mentor.designation}
                        </p>
                        <p className="text-xs text-blue-600">
                          {mentor.department}
                        </p>
                      </div>
                    )}

                    {/* Hover Info */}
                    {isHovered && (
                      <div className="relative z-10 text-white">
                        <p className="text-sm mb-4 leading-relaxed line-clamp-3">
                          {mentor.message}
                        </p>

                        <div className="flex gap-3">
                          {mentor.socialMedia?.linkedin && (
                            <a
                              href={mentor.socialMedia.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Linkedin className="w-4 h-4" />
                              <span className="text-sm">LinkedIn</span>
                            </a>
                          )}

                          {mentor.socialMedia?.website && (
                            <a
                              href={mentor.socialMedia.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Globe className="w-4 h-4" />
                              <span className="text-sm">Website</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Border glow */}
                  <div
                    className={`absolute inset-0 rounded-xl border-2 border-blue-400 transition-opacity pointer-events-none ${isHovered ? "opacity-100 shadow-[0_0_20px_rgba(59,130,246,0.5)]" : "opacity-0"
                      }`}
                  />
                </div>
              )
            })}
          </div>

          {/* Dots - Only show if we have more mentors than visible slots */}
          {mentors.length > slidesPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: mentors.length - slidesPerView + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`rounded-full transition-all ${index === currentIndex
                      ? "bg-blue-600 w-8 h-3"
                      : "bg-blue-300 w-3 h-3 hover:bg-blue-400"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}