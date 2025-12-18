"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Zap, CheckCircle } from "lucide-react"
import Link from "next/link"
import AnimatedSection from "./animated-section"

interface Startup {
  _id: string
  companyName: string
  tagline: string
  careerUrl: string
  hasImage?: boolean
  createdAt?: string
}

const BACKEND_URL = "http://localhost:5000"

export default function StartupsSection() {
  const [incubatedStartups, setIncubatedStartups] = useState<Startup[]>([])
  const [graduatedStartups, setGraduatedStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true)
        setError(null)

        const [incubatedRes, graduatedRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/admin/incubated-startups`),
          fetch(`${BACKEND_URL}/api/admin/graduated-startups`),
        ])

        if (!incubatedRes.ok || !graduatedRes.ok) {
          throw new Error("Failed to fetch startups")
        }

        const incubatedData = await incubatedRes.json()
        const graduatedData = await graduatedRes.json()

        console.log("✅ Startups loaded:", { incubatedData, graduatedData })

        setIncubatedStartups(Array.isArray(incubatedData.startups) ? incubatedData.startups : [])
        setGraduatedStartups(Array.isArray(graduatedData.startups) ? graduatedData.startups : [])
      } catch (err) {
        console.error("❌ Startup fetch failed:", err)
        setError("Failed to load startups")
      } finally {
        setLoading(false)
      }
    }

    fetchStartups()
  }, [])

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

  if (loading) {
    return (
      <AnimatedSection direction="right">
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
            <p className="mt-4 text-blue-600">Loading startups...</p>
          </div>
        </section>
      </AnimatedSection>
    )
  }

  if (error) {
    return (
      <AnimatedSection direction="right">
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </section>
      </AnimatedSection>
    )
  }

  return (
    <AnimatedSection direction="right">
      <section id="startups" className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
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
          {incubatedStartups.length > 0 && (
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
                {incubatedStartups.slice(0, 6).map((startup) => (
                  <motion.div
                    key={startup._id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                    onClick={() => window.open(startup.careerUrl, "_blank", "noopener,noreferrer")}
                  >
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
                      {startup.hasImage ? (
                        <img
                          src={`${BACKEND_URL}/api/admin/incubated-startups/${startup._id}/image`}
                          alt={startup.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Zap className="w-16 h-16 text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
                    </div>

                    <div className="p-6">
                      <h4 className="font-bold text-lg text-blue-900 mb-2">{startup.companyName}</h4>
                      <p className="text-sm text-blue-600 mb-4 line-clamp-2">{startup.tagline}</p>
                      <motion.span
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        Incubating
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Graduated Startups */}
          {graduatedStartups.length > 0 && (
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
                {graduatedStartups.slice(0, 6).map((startup) => (
                  <motion.div
                    key={startup._id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-blue-50 shadow-lg hover:shadow-2xl transition-all border border-green-200 cursor-pointer"
                    onClick={() => window.open(startup.careerUrl, "_blank", "noopener,noreferrer")}
                  >
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-green-400 to-emerald-600">
                      {startup.hasImage ? (
                        <img
                          src={`${BACKEND_URL}/api/admin/graduated-startups/${startup._id}/image`}
                          alt={startup.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle className="w-16 h-16 text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                    </div>

                    <div className="p-6">
                      <h4 className="font-bold text-lg text-blue-900 mb-2">{startup.companyName}</h4>
                      <p className="text-sm text-blue-600 mb-4 line-clamp-2">{startup.tagline}</p>
                      <motion.span
                        className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        Graduated
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Empty State */}
          {incubatedStartups.length === 0 && graduatedStartups.length === 0 && (
            <div className="text-center py-12 bg-blue-50 rounded-lg">
              <p className="text-blue-600">No startups listed yet. Check back soon!</p>
            </div>
          )}

          {/* View All Button */}
          {(incubatedStartups.length > 0 || graduatedStartups.length > 0) && (
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
          )}
        </div>
      </section>
    </AnimatedSection>
  )
}