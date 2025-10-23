"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Zap, CheckCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const allIncubatedStartups = [
  {
    id: 1,
    name: "TechFlow AI",
    description: "AI-powered workflow automation platform",
    stage: "Series A",
    image: "/startup-techflow-ai.jpg",
    fullDescription: "TechFlow AI is revolutionizing workflow automation with cutting-edge AI technology.",
  },
  {
    id: 2,
    name: "GreenEnergy Solutions",
    description: "Sustainable energy management system",
    stage: "Seed",
    image: "/startup-greenenergy.jpg",
    fullDescription: "Building sustainable energy solutions for a better tomorrow.",
  },
  {
    id: 3,
    name: "HealthTech Pro",
    description: "Digital health monitoring platform",
    stage: "Series A",
    image: "/startup-healthtech.jpg",
    fullDescription: "Transforming healthcare with innovative digital monitoring solutions.",
  },
  {
    id: 4,
    name: "DataViz Analytics",
    description: "Real-time data visualization platform",
    stage: "Seed",
    image: "/startup-dataviz.jpg",
    fullDescription: "Making data insights accessible to everyone.",
  },
  {
    id: 5,
    name: "SecureChain",
    description: "Blockchain security solutions",
    stage: "Series A",
    image: "/startup-securechain.jpg",
    fullDescription: "Enterprise-grade blockchain security for the future.",
  },
  {
    id: 6,
    name: "MobileFirst Dev",
    description: "Mobile app development platform",
    stage: "Seed",
    image: "/startup-mobilefirst.jpg",
    fullDescription: "Empowering developers to build amazing mobile experiences.",
  },
]

const allGraduatedStartups = [
  {
    id: 7,
    name: "CloudSync",
    description: "Enterprise cloud collaboration tool",
    funding: "$5M Series B",
    image: "/startup-cloudsync.jpg",
    fullDescription: "Leading enterprise collaboration platform trusted by Fortune 500 companies.",
  },
  {
    id: 8,
    name: "FinanceFlow",
    description: "Fintech platform for SMEs",
    funding: "$3M Series A",
    image: "/startup-financeflow.jpg",
    fullDescription: "Simplifying financial management for small and medium enterprises.",
  },
  {
    id: 9,
    name: "EduConnect",
    description: "Online education marketplace",
    funding: "$2M Seed",
    image: "/startup-educonnect.jpg",
    fullDescription: "Connecting learners with world-class educators globally.",
  },
  {
    id: 10,
    name: "LogisticsPro",
    description: "Supply chain optimization",
    funding: "$4M Series A",
    image: "/startup-logistics.jpg",
    fullDescription: "Optimizing supply chains with AI and real-time tracking.",
  },
  {
    id: 11,
    name: "RetailAI",
    description: "AI-powered retail analytics",
    funding: "$6M Series B",
    image: "/startup-retailai.jpg",
    fullDescription: "Transforming retail with predictive analytics and customer insights.",
  },
  {
    id: 12,
    name: "GreenTech Solutions",
    description: "Environmental monitoring IoT",
    funding: "$2.5M Seed",
    image: "/placeholder.svg?height=200&width=300",
    fullDescription: "Monitoring and protecting our environment with IoT technology.",
  },
]

export default function StartupsPage() {
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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-all"
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
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4">Our Complete Startup Ecosystem</h1>
            <p className="text-xl text-blue-600 max-w-3xl">
              Explore all the innovative startups we're incubating and the remarkable success stories of our graduated
              companies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Currently Incubated */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-12"
          >
            <Zap className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-blue-900">Currently Incubating</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allIncubatedStartups.map((startup) => (
              <motion.div
                key={startup.id}
                variants={itemVariants}
                whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)" }}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={startup.image}
                    alt={startup.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-blue-900 mb-2">{startup.name}</h3>
                  <p className="text-blue-600 mb-4">{startup.description}</p>
                  <p className="text-sm text-blue-500 mb-4">{startup.fullDescription}</p>
                  <motion.span
                    className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    {startup.stage}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Graduated Startups */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-transparent to-green-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-12"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-blue-900">Graduated Success Stories</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allGraduatedStartups.map((startup) => (
              <motion.div
                key={startup.id}
                variants={itemVariants}
                whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.2)" }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-blue-50 shadow-lg hover:shadow-2xl transition-all border-2 border-green-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={startup.image}
                    alt={startup.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-blue-900 mb-2">{startup.name}</h3>
                  <p className="text-blue-600 mb-4">{startup.description}</p>
                  <p className="text-sm text-blue-500 mb-4">{startup.fullDescription}</p>
                  <motion.span
                    className="inline-block px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    {startup.funding}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
