"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, MessageCircle, Share2 } from "lucide-react"

const socialPosts = [
  {
    id: 1,
    author: "CIBA Mumbai",
    handle: "@ciba_mumbai",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ciba1",
    content: "Excited to announce our latest cohort of 15 innovative startups! Welcome to the CIBA family.",
    image: "/startup-team-collaboration.jpg",
    likes: 234,
    comments: 45,
    timestamp: "2 days ago",
  },
  {
    id: 2,
    author: "CIBA Mumbai",
    handle: "@ciba_mumbai",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ciba2",
    content:
      "Our mentorship program has helped 50+ startups raise over ₹10 crores in funding. Success stories incoming!",
    image: "/business-growth-chart.jpg",
    likes: 567,
    comments: 89,
    timestamp: "1 week ago",
  },
  {
    id: 3,
    author: "CIBA Mumbai",
    handle: "@ciba_mumbai",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ciba3",
    content:
      "Join us for the CIBA Startup Clinic this Friday! Connect with industry experts and get personalized guidance.",
    image: "/networking-event.jpg",
    likes: 345,
    comments: 67,
    timestamp: "3 days ago",
  },
  {
    id: 4,
    author: "CIBA Mumbai",
    handle: "@ciba_mumbai",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ciba4",
    content: "Celebrating our portfolio companies hitting major milestones this quarter. Proud of your achievements!",
    image: "/celebration-success.jpg",
    likes: 456,
    comments: 78,
    timestamp: "5 days ago",
  },
]

export default function Gallery() {
  const [visiblePosts, setVisiblePosts] = useState<number[]>([])
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postIndex = Number.parseInt(entry.target.getAttribute("data-post") || "0")
            setVisiblePosts((prev) => [...new Set([...prev, postIndex])])
          }
        })
      },
      { threshold: 0.2 },
    )

    const posts = sectionRef.current?.querySelectorAll("[data-post]")
    posts?.forEach((post) => observer.observe(post))

    return () => observer.disconnect()
  }, [])

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  return (
    <section id="gallery" className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50" ref={sectionRef}>
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Latest Updates</h2>
        <p className="text-lg text-muted-foreground">Follow our journey and stay connected with the CIBA community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {socialPosts.map((post, index) => (
          <div
            key={post.id}
            data-post={index}
            className={`transition-all duration-700 ${visiblePosts.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="glass-effect rounded-2xl overflow-hidden hover-lift-interactive interactive-card group">
              {/* Post Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src={post.avatar || "/placeholder.svg"} alt={post.author} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.handle}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="text-foreground mb-4">{post.content}</p>
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Post"
                  className="w-full rounded-lg mb-4 object-cover h-48 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-muted-foreground">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-2 hover:text-primary transition-all group/btn"
                >
                  <Heart
                    size={18}
                    className={`transition-all ${likedPosts.includes(post.id)
                        ? "fill-primary text-primary animate-scale-in"
                        : "group-hover/btn:fill-primary"
                      }`}
                  />
                  <span className="text-sm">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-primary transition-all group/btn">
                  <MessageCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-primary transition-all group/btn">
                  <Share2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
