"use client"

import { motion } from "framer-motion"
import { Award, Briefcase, Users } from "lucide-react"
import AnimatedSection from "./animated-section"
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <AnimatedSection direction="left">
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Meet Our Mentors</h2>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              Learn from industry experts and experienced entrepreneurs who are committed to your success
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {mentors.map((mentor) => {
              const IconComponent = mentor.icon
              return (
                <motion.div
                  key={mentor.id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredId(mentor.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative group cursor-pointer"
                >
                  <motion.div
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Background gradient animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-0"
                      animate={{ opacity: hoveredId === mentor.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Image placeholder */}
                      <motion.div
                        className="mb-4 overflow-hidden rounded-lg"
                        animate={{ scale: hoveredId === mentor.id ? 1.1 : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={mentor.image || "/placeholder.svg"}
                          alt={mentor.name}
                          className="w-full h-40 object-cover"
                        />
                      </motion.div>

                      {/* Info - visible by default */}
                      <motion.div
                        animate={{
                          opacity: hoveredId === mentor.id ? 0 : 1,
                          y: hoveredId === mentor.id ? -10 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-blue-900">{mentor.name}</h3>
                        </div>
                        <p className="text-sm text-blue-700 font-semibold mb-1">{mentor.role}</p>
                        <p className="text-xs text-blue-600">{mentor.expertise}</p>
                      </motion.div>

                      {/* Bio - visible on hover */}
                      <motion.div
                        className="absolute inset-0 p-6 flex flex-col justify-center"
                        animate={{
                          opacity: hoveredId === mentor.id ? 1 : 0,
                          y: hoveredId === mentor.id ? 0 : 10,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-white text-sm leading-relaxed">{mentor.bio}</p>
                      </motion.div>
                    </div>

                    {/* Border animation */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-blue-400"
                      animate={{
                        opacity: hoveredId === mentor.id ? 1 : 0,
                        boxShadow:
                          hoveredId === mentor.id
                            ? "0 0 20px rgba(59, 130, 246, 0.5)"
                            : "0 0 0px rgba(59, 130, 246, 0)",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  )
}
