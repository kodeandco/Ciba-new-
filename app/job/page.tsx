"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Briefcase, GraduationCap, Calendar, FileText, Link2 } from "lucide-react"
import Navbar from "@/components/navbar"

export default function JobPage() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    institution: "",
    currentlyPursuing: "",
    professionalDomain: "",
    experience: "",
    roleType: "",
    availableFrom: "",
    resumeLink: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/submit-internship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          email: "",
          fullName: "",
          institution: "",
          currentlyPursuing: "",
          professionalDomain: "",
          experience: "",
          roleType: "",
          availableFrom: "",
          resumeLink: "",
        })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-subtle py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-6 text-xs font-semibold text-primary tracking-wider">
              <Briefcase className="w-4 h-4" />
              CIBA JOBS
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              Apply for Jobs at{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CIBA Startups
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join innovative startups incubated at CIBA and build your career with exciting opportunities
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-card-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-card-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="John Doe"
                />
              </div>

              {/* Educational Institution */}
              <div>
                <label htmlFor="institution" className="block text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Name of your Educational Institution *
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  required
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g., FCRIT, ITM Skills University"
                />
              </div>

              {/* Currently Pursuing */}
              <div>
                <label htmlFor="currentlyPursuing" className="block text-sm font-semibold text-card-foreground mb-2">
                  What are you Currently Pursuing *
                </label>
                <input
                  type="text"
                  id="currentlyPursuing"
                  name="currentlyPursuing"
                  required
                  value={formData.currentlyPursuing}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g., B.Tech, M.M.S., M.B.A."
                />
              </div>

              {/* Professional Domain */}
              <div>
                <label htmlFor="professionalDomain" className="block text-sm font-semibold text-card-foreground mb-2">
                  In which professional domain would you like to work? *
                </label>
                <input
                  type="text"
                  id="professionalDomain"
                  name="professionalDomain"
                  required
                  value={formData.professionalDomain}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g., AI/ML, Software Development, Digital Marketing"
                />
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Can you share any relevant experience related to your domain? *
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  required
                  rows={4}
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="Share your projects, internships, or relevant work experience..."
                />
              </div>

              {/* Role Type */}
              <div>
                <label htmlFor="roleType" className="block text-sm font-semibold text-card-foreground mb-2">
                  What type of role suits you best? *
                </label>
                <select
                  id="roleType"
                  name="roleType"
                  required
                  value={formData.roleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                >
                  <option value="">Select role type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                </select>
              </div>

              {/* Available From */}
              <div>
                <label htmlFor="availableFrom" className="block text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Share the date from which you can join *
                </label>
                <input
                  type="date"
                  id="availableFrom"
                  name="availableFrom"
                  required
                  value={formData.availableFrom}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  📅 Select your earliest available joining date
                </p>
              </div>

              {/* Resume Drive Link */}
              <div>
                <label htmlFor="resumeLink" className="block text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  Resume / CV (Google Drive Link) *
                </label>
                <input
                  type="url"
                  id="resumeLink"
                  name="resumeLink"
                  required
                  value={formData.resumeLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="https://drive.google.com/file/d/..."
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  💡 Upload your resume to Google Drive and share the link with "Anyone with the link can view" permission
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-4 px-8 rounded-lg font-bold text-lg text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Send className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-center font-medium"
                >
                  ✅ Application submitted successfully! We'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-center font-medium"
                >
                  ❌ Something went wrong. Please try again or contact us directly.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            <p>
              Need help? Contact us at{" "}
              <a href="mailto:support@cibamumbai.com" className="text-primary hover:underline font-medium">
                support@cibamumbai.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}