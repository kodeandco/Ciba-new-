"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"

const startups = [
  {
    id: 1,
    name: "TechStart India",
    description: "AI-powered solutions for enterprise automation",
    logo: "🤖",
    category: "AI & Automation",
  },
  {
    id: 2,
    name: "GreenTech Solutions",
    description: "Sustainable energy solutions for urban areas",
    logo: "⚡",
    category: "Green Tech",
  },
  {
    id: 3,
    name: "FinFlow",
    description: "Fintech platform for seamless payments",
    logo: "💳",
    category: "FinTech",
  },
  {
    id: 4,
    name: "EduTech Pro",
    description: "Interactive learning platform for students",
    logo: "📚",
    category: "EdTech",
  },
  {
    id: 5,
    name: "HealthHub",
    description: "Telemedicine and health monitoring app",
    logo: "🏥",
    category: "HealthTech",
  },
  {
    id: 6,
    name: "LogiChain",
    description: "Blockchain-based supply chain management",
    logo: "📦",
    category: "Blockchain",
  },
]

export default function StartupCards() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])])
          }
        })
      },
      { threshold: 0.1 },
    )

    const cards = sectionRef.current?.querySelectorAll("[data-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="startups" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={sectionRef}>
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Startups</h2>
        <p className="text-lg text-muted-foreground">Innovative companies building the future</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup, index) => (
          <div
            key={startup.id}
            data-index={index}
            className={`group relative overflow-hidden rounded-xl transition-all duration-700 ${
              visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Card Background */}
            <div className="absolute inset-0 gradient-sunrise opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

            {/* Card Content */}
            <div className="relative glass-effect p-6 h-full flex flex-col justify-between hover-lift group-hover:shadow-xl">
              <div>
                <p className="text-5xl mb-4 group-hover:animate-float">{startup.logo}</p>
                <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{startup.category}</p>
                <h3 className="text-xl font-bold text-foreground mb-2">{startup.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{startup.description}</p>
              </div>

              <button className="mt-4 flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                Learn More
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
