"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { X, Mail, ArrowRight, FileText, Bell, Archive } from "lucide-react"

type Newsletter = {
  _id: string
  title: string
  description: string
  newsletterDate: string
}

export default function Newsletter() {
  const router = useRouter()
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [allNewsletters, setAllNewsletters] = useState<Newsletter[]>([])
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
  const [showAllModal, setShowAllModal] = useState(false)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingAll, setLoadingAll] = useState(false)
  const [email, setEmail] = useState("")
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/newsletter", {
          cache: "no-store",
        })
        const data = await res.json()
        // Ensure data is always an array
        setNewsletters(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch newsletters", error)
        setNewsletters([]) // Always set to empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchNewsletters()
  }, [])

  const fetchAllNewsletters = async () => {
    setLoadingAll(true)
    try {
      const res = await fetch("http://localhost:5000/api/newsletter/all", {
        cache: "no-store",
      })
      const data = await res.json()
      // Ensure data is always an array
      setAllNewsletters(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch all newsletters", error)
      setAllNewsletters([]) // Always set to empty array on error
    } finally {
      setLoadingAll(false)
    }
  }

  const handleViewAll = () => {
    router.push('/all-newsletters')
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribeStatus("loading")

    try {
      const res = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSubscribeStatus("success")
        setEmail("")
        setTimeout(() => {
          setShowSubscribeModal(false)
          setSubscribeStatus("idle")
        }, 2000)
      } else {
        setSubscribeStatus("error")
      }
    } catch (error) {
      console.error("Subscription failed", error)
      setSubscribeStatus("error")
    }
  }

  const handleReadNewsletter = (e: React.MouseEvent, newsletter: Newsletter) => {
    e.stopPropagation()
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
          <p className="text-lg text-muted-foreground mb-6">
            Stay updated with the latest news, insights, and opportunities
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Bell size={20} />
              Subscribe to Newsletter
            </button>

            <button
              onClick={handleViewAll}
              className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
            >
              <Archive size={20} />
              View All Newsletters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Loading newsletters...
          </p>
        )}

        {/* Empty State */}
        {!loading && (!Array.isArray(newsletters) || newsletters.length === 0) && (
          <p className="text-center text-muted-foreground">
            No newsletters available.
          </p>
        )}

        {/* Newsletter Cards - Latest 2 */}
        {!loading && Array.isArray(newsletters) && newsletters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsletters.map((newsletter, index) => (
              <div
                key={newsletter._id}
                className="glass-effect rounded-2xl p-6 hover-lift group cursor-pointer animate-scale-in border border-blue-100 dark:border-blue-900"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setSelectedNewsletter(newsletter)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-all">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
                      {new Date(newsletter.newsletterDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>

                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                      {newsletter.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {newsletter.description}
                    </p>

                    <div className="flex gap-3">
                      <button
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
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
        )}
      </section>

      {/* Newsletter Detail Modal */}
      {selectedNewsletter && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedNewsletter(null)}
        >
          <div
            className="bg-background rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in border border-blue-200 dark:border-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b border-blue-200 dark:border-blue-800 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">
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
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-foreground whitespace-pre-wrap">
                {selectedNewsletter.description}
              </p>
            </div>

            <div className="border-t border-blue-200 dark:border-blue-800 p-6 flex gap-4">
              <button
                onClick={() => setSelectedNewsletter(null)}
                className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
              >
                Close
              </button>

              <button
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
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

      {/* View All Newsletters Modal */}
      {showAllModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="bg-background rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto animate-scale-in border border-blue-200 dark:border-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b border-blue-200 dark:border-blue-800 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">All Newsletters</h2>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {loadingAll ? (
                <p className="text-center text-muted-foreground py-8">Loading all newsletters...</p>
              ) : !Array.isArray(allNewsletters) || allNewsletters.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No newsletters found.</p>
              ) : (
                <div className="space-y-4">
                  {allNewsletters.map((newsletter) => (
                    <div
                      key={newsletter._id}
                      className="glass-effect rounded-xl p-4 hover-lift cursor-pointer group border border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                      onClick={() => {
                        setShowAllModal(false)
                        setSelectedNewsletter(newsletter)
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                            {new Date(newsletter.newsletterDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                            {newsletter.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {newsletter.description}
                          </p>
                        </div>
                        <button
                          className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-all"
                          onClick={(e) => handleReadNewsletter(e, newsletter)}
                        >
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setShowSubscribeModal(false)
            setSubscribeStatus("idle")
            setEmail("")
          }}
        >
          <div
            className="bg-background rounded-2xl max-w-md w-full animate-scale-in border border-blue-200 dark:border-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-blue-200 dark:border-blue-800 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Subscribe</h2>
              </div>
              <button
                onClick={() => {
                  setShowSubscribeModal(false)
                  setSubscribeStatus("idle")
                  setEmail("")
                }}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubscribe} className="p-6">
              <p className="text-muted-foreground mb-4">
                Get the latest newsletters delivered directly to your inbox
              </p>

              {subscribeStatus === "success" ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">
                    ✓ Successfully subscribed!
                  </p>
                </div>
              ) : subscribeStatus === "error" ? (
                <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                  <p className="text-red-600 dark:text-red-400 font-semibold">
                    Something went wrong. Please try again.
                  </p>
                </div>
              ) : null}

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-muted border border-blue-200 dark:border-blue-800 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={subscribeStatus === "loading"}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubscribeModal(false)
                    setSubscribeStatus("idle")
                    setEmail("")
                  }}
                  className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                  disabled={subscribeStatus === "loading"}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={subscribeStatus === "loading"}
                >
                  {subscribeStatus === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}