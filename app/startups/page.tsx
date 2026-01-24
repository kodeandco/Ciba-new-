"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Zap, CheckCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Startup {
  _id: string
  companyName: string
  tagline: string
  careerUrl: string
  image?: {
    contentType: string
    data: string // base64 string
  } | null
  createdAt?: string
}

const BACKEND_URL = "http://localhost:5000"

export default function StartupsPage() {
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
          fetch(`${BACKEND_URL}/api/incubated-startups`),
          fetch(`${BACKEND_URL}/api/graduated-startups`),
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
        setError("Failed to load startups. Please try again later.")
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
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mb-6 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              Our Complete Startup Ecosystem
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-300 max-w-3xl">
              Explore all the innovative startups we're incubating and the remarkable success stories of our graduated companies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400" />
            <p className="mt-4 text-blue-600 dark:text-blue-400">Loading startups...</p>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </section>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Currently Incubated */}
          {incubatedStartups.length > 0 && (
            <section className="py-16 px-4 md:px-8">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-3 mb-12"
                >
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    Currently Incubating ({incubatedStartups.length})
                  </h2>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {incubatedStartups.map((startup) => (
                    <motion.div
                      key={startup._id}
                      variants={itemVariants}
                      whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)" }}
                      className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
                      onClick={() => window.open(startup.careerUrl, "_blank", "noopener,noreferrer")}
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800">
                        {startup.image?.data ? (
                          <motion.img
                            src={`data:${startup.image.contentType};base64,${startup.image.data}`}
                            alt={startup.companyName}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.15 }}
                            transition={{ duration: 0.4 }}
                            onError={(e) => {
                              console.error('Failed to load image for:', startup.companyName);
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Zap className="w-20 h-20 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent dark:from-gray-900/90 dark:via-gray-900/40" />
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-xl text-blue-900 dark:text-blue-100 mb-2">
                          {startup.companyName}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-300 mb-4 line-clamp-3">
                          {startup.tagline}
                        </p>
                        <div className="flex items-center justify-between">
                          <motion.span
                            className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            Incubating
                          </motion.span>
                          <span className="text-sm text-blue-500 dark:text-blue-400 font-medium">
                            View Opportunities →
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* Graduated Startups */}
          {graduatedStartups.length > 0 && (
            <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-transparent to-green-50 dark:to-gray-900">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-3 mb-12"
                >
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    Graduated Success Stories ({graduatedStartups.length})
                  </h2>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {graduatedStartups.map((startup) => (
                    <motion.div
                      key={startup._id}
                      variants={itemVariants}
                      whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.2)" }}
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all border-2 border-green-200 dark:border-green-800 cursor-pointer"
                      onClick={() => window.open(startup.careerUrl, "_blank", "noopener,noreferrer")}
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-400 to-emerald-600 dark:from-green-600 dark:to-emerald-800">
                        {startup.image?.data ? (
                          <motion.img
                            src={`data:${startup.image.contentType};base64,${startup.image.data}`}
                            alt={startup.companyName}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.15 }}
                            transition={{ duration: 0.4 }}
                            onError={(e) => {
                              console.error('Failed to load image for:', startup.companyName);
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle className="w-20 h-20 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent dark:from-gray-900/90 dark:via-gray-900/40" />
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-xl text-blue-900 dark:text-blue-100 mb-2">
                          {startup.companyName}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-300 mb-4 line-clamp-3">
                          {startup.tagline}
                        </p>
                        <div className="flex items-center justify-between">
                          <motion.span
                            className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            Graduated
                          </motion.span>
                          <span className="text-sm text-green-500 dark:text-green-400 font-medium">
                            View Opportunities →
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* Empty State */}
          {incubatedStartups.length === 0 && graduatedStartups.length === 0 && (
            <section className="py-20 px-4 md:px-8">
              <div className="max-w-6xl mx-auto text-center">
                <div className="bg-blue-50 dark:bg-gray-800 rounded-2xl p-12 border border-blue-100 dark:border-gray-700">
                  <Zap className="w-16 h-16 text-blue-400 dark:text-blue-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                    No Startups Yet
                  </h3>
                  <p className="text-blue-600 dark:text-blue-300">
                    Check back soon for exciting startup opportunities!
                  </p>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </main>
  )
}