"use client"

import { useEffect, useState } from "react"
import { X, Mail, ArrowRight, FileText } from "lucide-react"

type Newsletter = {
  _id: string
  title: string
  description: string
  newsletterDate: string
}

export default function Newsletter() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/newsletter", {
          cache: "no-store",
        })
        const data = await res.json()
        setNewsletters(data)
      } catch (error) {
        console.error("Failed to fetch newsletters", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsletters()
  }, [])

  const handleReadNewsletter = (e: React.MouseEvent, newsletter: Newsletter) => {
    e.stopPropagation() // Prevent card click event
    if (!newsletter._id) return
    const fileUrl = `http://localhost:5000/api/newsletter/${newsletter._id}/file`
    window.open(fileUrl, "_blank")
  }

  return (
    <>
      <section
        id="newsletter"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            CIBA Newsletter
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with the latest news, insights, and opportunities
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Loading newsletters...
          </p>
        )}

        {/* Empty State */}
        {!loading && newsletters.length === 0 && (
          <p className="text-center text-muted-foreground">
            No newsletters available.
          </p>
        )}

        {/* Newsletter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsletters.map((newsletter, index) => (
            <div
              key={newsletter._id}
              className="glass-effect rounded-2xl p-6 hover-lift group cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => setSelectedNewsletter(newsletter)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-all">
                  <Mail className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-primary font-semibold mb-2">
                    {new Date(newsletter.newsletterDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-all">
                    {newsletter.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {newsletter.description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                      onClick={(e) => handleReadNewsletter(e, newsletter)}
                    >
                      <FileText size={18} />
                      Read Full Newsletter
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Modal */}
      {selectedNewsletter && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedNewsletter(null)}
        >
          <div
            className="bg-background rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-primary font-semibold mb-1">
                  {new Date(selectedNewsletter.newsletterDate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedNewsletter.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedNewsletter(null)}
                className="p-2 hover:bg-muted rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-foreground whitespace-pre-wrap">
                {selectedNewsletter.description}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border p-6 flex gap-4">
              <button
                onClick={() => setSelectedNewsletter(null)}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-all"
              >
                Close
              </button>

              <button
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover-lift"
                onClick={(e) => handleReadNewsletter(e, selectedNewsletter)}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText size={18} />
                  Open Newsletter PDF
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}