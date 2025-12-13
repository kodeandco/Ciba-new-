"use client"

import { useEffect, useState } from "react"
import { Heart, MessageCircle, Share2 } from "lucide-react"

type GalleryItem = {
  _id: string
  title: string
  description: string
  createdAt: string
}

export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [liked, setLiked] = useState<string[]>([])

  useEffect(() => {
    fetch("http://localhost:5000/api/gallery", { cache: "no-store" })
      .then((res) => res.json())
      .then(setGallery)
      .catch(console.error)
  }, [])

  const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <section id="gallery" className="py-16 px-4 bg-muted">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-4xl font-bold mb-3">Gallery</h2>
        <p className="text-lg text-muted-foreground">
          Explore highlights from our programs and see what our startups are creating.
        </p>
      </div>

      {/* Grid with 2 columns on medium screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {gallery.map((item) => (
          <div
            key={item._id}
            className="bg-background border rounded-xl shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=ciba"
                className="w-8 h-8 rounded-full"
                alt="cibamumbai"
              />
              <div>
                <p className="font-semibold text-sm">cibamumbai</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Image */}
            <img
              src={`http://localhost:5000/api/gallery/${item._id}/image`}
              alt={item.title}
              className="w-full object-cover max-h-64"
              loading="lazy"
            />

            {/* Actions */}
            <div className="flex items-center gap-3 px-3 py-2">
              <button onClick={() => toggleLike(item._id)}>
                <Heart
                  className={`w-5 h-5 ${liked.includes(item._id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                    }`}
                />
              </button>
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <Share2 className="w-5 h-5 text-gray-500" />
            </div>

            {/* Content */}
            <div className="px-3 pb-3 text-sm">
              <p className="font-semibold mb-1">cibamumbai</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
