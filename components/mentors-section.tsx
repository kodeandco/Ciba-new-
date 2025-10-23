"use client"

import { Award, Briefcase, Users } from "lucide-react"
import { useState } from "react"

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
]

export default function MentorsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
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

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Meet Our Mentors</h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Learn from industry experts and experienced entrepreneurs who are committed to your success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor, index) => {
            const IconComponent = mentor.icon
            const isHovered = hoveredId === mentor.id

            return (
              <div
                key={mentor.id}
                onMouseEnter={() => setHoveredId(mentor.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group cursor-pointer opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              >
                <div
                  className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 h-full transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'
                    }`}
                >
                  {/* Background gradient animation */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Image placeholder */}
                    <div
                      className={`mb-4 overflow-hidden rounded-lg transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'
                        }`}
                    >
                      <img
                        src={mentor.image || "/placeholder.svg"}
                        alt={mentor.name}
                        className="w-full h-40 object-cover"
                      />
                    </div>

                    {/* Info - visible by default */}
                    <div
                      className={`transition-all duration-300 ${isHovered ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-blue-900">{mentor.name}</h3>
                      </div>
                      <p className="text-sm text-blue-700 font-semibold mb-1">{mentor.role}</p>
                      <p className="text-xs text-blue-600">{mentor.expertise}</p>
                    </div>

                    {/* Bio - visible on hover */}
                    <div
                      className={`absolute inset-0 p-6 flex flex-col justify-center transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                        }`}
                    >
                      <p className="text-white text-sm leading-relaxed">{mentor.bio}</p>
                    </div>
                  </div>

                  {/* Border animation */}
                  <div
                    className={`absolute inset-0 rounded-xl border-2 border-blue-400 transition-all duration-300 ${isHovered ? 'opacity-100 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'opacity-0'
                      }`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}