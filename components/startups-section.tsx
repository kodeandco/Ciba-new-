"use client"

import { motion } from "framer-motion"
import { ArrowRight, Zap, CheckCircle } from "lucide-react"
import Link from "next/link"
import AnimatedSection from "./animated-section"

const incubatedStartups = [
  {
    id: 1,
    name: "TechFlow AI",
    description: "AI-powered workflow automation platform",
    stage: "Series A",
    image: "/startup-techflow-ai.jpg",
  },
  {
    id: 2,
    name: "GreenEnergy Solutions",
    description: "Sustainable energy management system",
    stage: "Seed",
    image: "/startup-greenenergy.jpg",
  },
  {
    id: 3,
    name: "HealthTech Pro",
    description: "Digital health monitoring platform",
    stage: "Series A",
    image: "/startup-healthtech.jpg",
  },
]

const graduatedStartups = [
  {
    id: 4,
    name: "CloudSync",
    description: "Enterprise cloud collaboration tool",
    funding: "$5M Series B",
    image: "/startup-cloudsync.jpg",
  },
  {
    id: 5,
    name: "FinanceFlow",
    description: "Fintech platform for SMEs",
    funding: "$3M Series A",
    image: "/startup-financeflow.jpg",
  },
  {
    id: 6,
    name: "EduConnect",
    description: "Online education marketplace",
    funding: "$2M Seed",
    image: "/startup-educonnect.jpg",
  },
]

export default function StartupsSection() {
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
      transition: { duration: 0.6 },
    },
  }

  return (
    <AnimatedSection direction="right">
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Our Startup Ecosystem</h2>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              Discover the innovative startups we're incubating and the success stories of our graduated companies
            </p>
          </motion.div>

          {/* Currently Incubated */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <Zap className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-900">Currently Incubating</h3>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {incubatedStartups.map((startup) => (
                <motion.div
                  key={startup.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="relative h-40 overflow-hidden">
                    <motion.img
                      src={startup.image}
                      alt={startup.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-lg text-blue-900 mb-2">{startup.name}</h4>
                    <p className="text-sm text-blue-600 mb-4">{startup.description}</p>
                    <motion.span
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      {startup.stage}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Graduated Startups */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-2xl font-bold text-blue-900">Graduated Success Stories</h3>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {graduatedStartups.map((startup) => (
                <motion.div
                  key={startup.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-blue-50 shadow-lg hover:shadow-2xl transition-all border border-green-200"
                >
                  <div className="relative h-40 overflow-hidden">
                    <motion.img
                      src={startup.image}
                      alt={startup.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-lg text-blue-900 mb-2">{startup.name}</h4>
                    <p className="text-sm text-blue-600 mb-4">{startup.description}</p>
                    <motion.span
                      className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      {startup.funding}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <Link href="/startups">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg flex items-center gap-2 hover:shadow-xl transition-all"
              >
                View All Startups
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  )
}
