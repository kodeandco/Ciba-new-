"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Briefcase, Award, Building2, Beaker, ChevronLeft, ChevronRight } from "lucide-react"
import MentorsSection from "./mentors-section"
import StartupsSection from "./startups-section"
import PartnersSection from "./partners-section"
import InvestmentSection from "./investment-section"
import AssetsSection from "./assets-section"
import PanoramaTour from "./360 Panorama/PanoramaTour"

type TabId = "mentors" | "partners" | "investments" | "workhub" | "protolab"

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

// WorkHub preview images
const workhubImages = [
  {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    title: "Main Workspace",
    description: "Collaborative open workspace"
  },
  {
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
    title: "Meeting Rooms",
    description: "Modern conference facilities"
  },
  {
    url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
    title: "Innovation Lab",
    description: "State-of-the-art equipment"
  },
  {
    url: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1200&q=80",
    title: "Lounge Area",
    description: "Relaxation and networking space"
  }
]

export default function SectionTabsWithTour() {
  const [activeTab, setActiveTab] = useState<TabId>("mentors")
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const tabs: Tab[] = [
    {
      id: "mentors",
      label: "Mentors",
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      id: "partners",
      label: "Partners",
      icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      id: "investments",
      label: "Investments",
      icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      id: "workhub",
      label: "WorkHub",
      icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      id: "protolab",
      label: "ProtoLab",
      icon: <Beaker className="w-4 h-4 sm:w-5 sm:h-5" />
    }
  ]

  // Auto-advance slider
  useEffect(() => {
    if (activeTab === "workhub" && !isExpanded) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % workhubImages.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [activeTab, isExpanded])

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % workhubImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + workhubImages.length) % workhubImages.length)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "mentors":
        return <MentorsSection />
      case "partners":
        return <PartnersSection />
      case "investments":
        return <InvestmentSection />
      case "protolab":
        return <AssetsSection />
      case "workhub":
        return (
          <motion.div
            key="workhub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {!isExpanded ? (
              // Preview Mode - Slider with Images
              <div className="max-w-5xl mx-auto px-2 sm:px-4">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Explore CIBA's WorkHub
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Take a 360° virtual tour of our facilities
                  </p>
                </div>

                {/* Image Slider */}
                <div className="relative">
                  <motion.div
                    ref={sliderRef}
                    className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl hover-glow-interactive h-[240px] sm:h-[320px] md:h-[400px]"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Images */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={workhubImages[currentSlide].url}
                          alt={workhubImages[currentSlide].title}
                          className="w-full h-full object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Image Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
                            {workhubImages[currentSlide].title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300">
                            {workhubImages[currentSlide].description}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Desktop Navigation Arrows */}
                    <button
                      onClick={prevSlide}
                      className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all items-center justify-center"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>

                    <button
                      onClick={nextSlide}
                      className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all items-center justify-center"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>

                    {/* Corner badge */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-primary/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-primary-foreground">
                      360° Interactive
                    </div>

                    {/* Slide Counter */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-white">
                      {currentSlide + 1} / {workhubImages.length}
                    </div>
                  </motion.div>

                  {/* Slide Indicators */}
                  <div className="flex justify-center gap-1.5 sm:gap-2 mt-4">
                    {workhubImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all ${index === currentSlide
                          ? "w-6 sm:w-8 bg-primary"
                          : "w-1.5 sm:w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-6 sm:mt-8">
                  <motion.button
                    onClick={() => setIsExpanded(true)}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center gap-2 mx-auto shadow-lg text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Launch Virtual Tour
                  </motion.button>
                  <p className="text-muted-foreground mt-3 text-xs sm:text-sm">
                    <span className="hidden sm:inline">💡 Swipe or use arrows to browse • </span>
                    <span className="sm:hidden">💡 Swipe to browse • </span>
                    Click to start 360° tour
                  </p>
                </div>
              </div>
            ) : (
              // Fullscreen Mode - Full panorama viewer
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-background"
              >
                <div className="w-full h-full relative">
                  <PanoramaTour />

                  {/* Close/Exit Fullscreen Button */}
                  <motion.button
                    onClick={() => setIsExpanded(false)}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 z-[60] bg-card/80 hover:bg-card backdrop-blur-sm p-2 sm:p-3 rounded-lg transition-all border border-border hover-lift"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close virtual tour"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>

                  {/* Fullscreen Tip */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-sm text-foreground border border-border max-w-[90%] text-center">
                    <span className="hidden sm:inline">💡 Drag to look around • Click purple spheres to navigate</span>
                    <span className="sm:hidden">💡 Drag to explore</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-8 bg-gradient-to-b from-background via-card to-background">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setIsExpanded(false)
                setCurrentSlide(0)
              }}
              className={`
                relative px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300
                flex items-center gap-1.5 sm:gap-2 group overflow-hidden text-sm sm:text-base
                ${activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Background gradient effect */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg sm:rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                {tab.icon}
                <span className="text-xs sm:text-sm md:text-base">{tab.label}</span>
              </span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <div className="min-h-[300px] sm:min-h-[400px]">{renderContent()}</div>
        </AnimatePresence>
      </div>
    </section>
  )
}