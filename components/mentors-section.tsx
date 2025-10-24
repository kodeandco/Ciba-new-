"use client"

import { Award, Briefcase, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const mentors = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Startup Founder & Investor",
    expertise: "Tech Startups",
    bio: "Serial entrepreneur with 15+ years of experience in building and scaling tech companies. Passionate about mentoring early-stage founders.",
    image: "/professional-mentor-rajesh.jpg",
    icon: Briefcase,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Business Strategy Expert",
    expertise: "Growth & Scaling",
    bio: "Former VP at leading tech company. Specializes in business strategy, market expansion, and investor relations.",
    image: "/professional-mentor-priya.jpg",
    icon: Award,
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Product & Innovation Lead",
    expertise: "Product Development",
    bio: "Product strategist with expertise in building innovative solutions. Mentors founders on product-market fit and user experience.",
    image: "/professional-mentor-amit.jpg",
    icon: Users,
  },
  {
    id: 4,
    name: "Neha Gupta",
    role: "Finance & Fundraising",
    expertise: "Funding & Finance",
    bio: "Investment advisor helping startups navigate fundraising. Expert in financial planning and investor pitch preparation.",
    image: "/professional-mentor-neha.jpg",
    icon: Award,
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Marketing Strategist",
    expertise: "Digital Marketing",
    bio: "Growth hacker with proven track record in scaling startups through innovative marketing strategies and brand building.",
    image: "/professional-mentor-amit.jpg",
    icon: Briefcase,
  },
  {
    id: 6,
    name: "Anjali Reddy",
    role: "Legal & Compliance",
    expertise: "Startup Law",
    bio: "Corporate lawyer specializing in startup legal matters, contracts, intellectual property, and regulatory compliance.",
    image: "/professional-mentor-neha.jpg",
    icon: Award,
  },
]

export default function MentorsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [slidesPerView, setSlidesPerView] = useState(4)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1)
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2)
      } else {
        setSlidesPerView(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % mentors.length)
      }, 3000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + mentors.length) % mentors.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mentors.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const getVisibleMentors = () => {
    const visible = []
    for (let i = 0; i < slidesPerView; i++) {
      visible.push(mentors[(currentIndex + i) % mentors.length])
    }
    return visible
  }

  const visibleMentors = getVisibleMentors()

  return (
    <section className="py-20 px-4 md:px-8 bg-white overflow-hidden">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Meet Our Mentors</h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Learn from industry experts and experienced entrepreneurs who are committed to your success
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous mentor"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next mentor"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Grid */}
          <div
            className="grid gap-6 transition-all duration-500 ease-in-out"
            style={{
              gridTemplateColumns: `repeat(${slidesPerView}, minmax(0, 1fr))`
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {visibleMentors.map((mentor, index) => {
              const IconComponent = mentor.icon
              const isHovered = hoveredId === mentor.id

              return (
                <div
                  key={`${mentor.id}-${currentIndex}-${index}`}
                  onMouseEnter={() => setHoveredId(mentor.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative group cursor-pointer opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 h-full transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'
                      }`}
                  >
                    {/* Background gradient animation */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Image - Full height, properly displayed */}
                      <div className="overflow-hidden flex-shrink-0">
                        <img
                          src={mentor.image || "/placeholder.svg"}
                          alt={mentor.name}
                          className="w-full h-64 object-cover object-top"
                        />
                      </div>

                      {/* Text content container */}
                      <div className="flex-1 p-6 flex flex-col justify-end min-h-[120px]">
                        {/* Info - visible by default */}
                        <div
                          className={`transition-all duration-300 ${isHovered ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-blue-900">{mentor.name}</h3>
                          </div>
                          <p className="text-sm text-blue-700 font-semibold mb-1">{mentor.role}</p>
                          <p className="text-xs text-blue-600">{mentor.expertise}</p>
                        </div>

                        {/* Bio - visible on hover at bottom */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                            }`}
                        >
                          <p className="text-white text-sm leading-relaxed">{mentor.bio}</p>
                        </div>
                      </div>
                    </div>

                    {/* Border animation */}
                    <div
                      className={`absolute inset-0 rounded-xl border-2 border-blue-400 transition-all duration-300 pointer-events-none ${isHovered ? 'opacity-100 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'opacity-0'
                        }`}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {mentors.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${index === currentIndex
                  ? 'bg-blue-600 w-8 h-3'
                  : 'bg-blue-300 w-3 h-3 hover:bg-blue-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}