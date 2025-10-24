"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, Sprout, Rocket, Zap } from "lucide-react"
import { useRouter } from "next/navigation" // ✅ Import router hook

const programs = [
  {
    id: 1,
    title: "Seed Program",
    description: "Perfect for early-stage startups with innovative ideas",
    duration: "6 months",
    benefits: [
      "Mentorship from industry experts",
      "Access to funding network",
      "Co-working space",
      "Legal & compliance support",
    ],
    icon: Sprout,
    link: "/seed-program", // ✅ Add navigation path
  },
  {
    id: 2,
    title: "Incubation Program",
    description: "Comprehensive support for scaling your startup",
    duration: "12 months",
    benefits: ["Dedicated mentor", "Pitch deck preparation", "Investor connections", "Marketing & branding support"],
    icon: Rocket,
    link: "/incubation", // ✅ Add navigation path
  },
  {
    id: 3,
    title: "Acceleration Program",
    description: "Fast-track growth for established startups",
    duration: "3 months",
    benefits: ["Growth strategy consulting", "Series A preparation", "Market expansion guidance", "Executive coaching"],
    icon: Zap,
    link: "#", // ✅ Placeholder (you can add later)
  },
]

export default function Programs() {
  const [visiblePrograms, setVisiblePrograms] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter() // ✅ Initialize router

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const programIndex = Number.parseInt(entry.target.getAttribute("data-program") || "0")
            setVisiblePrograms((prev) => [...new Set([...prev, programIndex])])
          }
        })
      },
      { threshold: 0.2 },
    )

    const programCards = sectionRef.current?.querySelectorAll("[data-program]")
    programCards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="programs" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={sectionRef}>
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Programs</h2>
        <p className="text-lg text-muted-foreground">Choose the program that fits your startup stage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {programs.map((program, index) => (
          <div
            key={program.id}
            data-program={index}
            className={`transition-all duration-700 ${visiblePrograms.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="glass-effect rounded-2xl p-8 h-full flex flex-col hover-lift-interactive interactive-card group">
              <program.icon className="w-12 h-12 text-primary mb-4 group-hover:animate-pulse-glow" />
              <h3 className="text-2xl font-bold text-foreground mb-2">{program.title}</h3>
              <p className="text-sm text-primary font-semibold mb-3">{program.duration}</p>
              <p className="text-muted-foreground mb-6 flex-grow">{program.description}</p>

              <div className="space-y-3">
                {program.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 group/benefit">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/benefit:animate-scale-in" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push(program.link)} // ✅ Navigate to respective page
                className="mt-6 w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover-lift-interactive transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
