"use client"

import { useEffect, useState } from "react"
import { Heart, MessageCircle, Share2, Play } from "lucide-react"

type GalleryItem = {
  _id: string
  title: string
  description: string
  aspectRatio: "9:16" | "16:9"
  mediaType: "image" | "video"
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
    <section 
      id="gallery" 
      className="py-16 px-4"
      style={{ background: "oklch(97.923% 0.01042 220.071)" }} // Soft, premium light blue-gray background
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-4xl font-bold mb-3">Gallery</h2>
        <p className="text-lg text-muted-foreground">
          Explore highlights from our programs and community events.
        </p>
      </div>

      {/* Uniform grid - all items same visual weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

            {/* Media */}
            <div className="relative">
              {item.mediaType === "video" ? (
                <video
                  src={`http://localhost:5000/api/gallery/${item._id}/image`}
                  controls
                  className="w-full object-cover max-h-72"
                />
              ) : (
                <img
                  src={`http://localhost:5000/api/gallery/${item._id}/image`}
                  alt={item.title}
                  className="w-full object-cover max-h-72"
                  loading="lazy"
                />
              )}
              {item.mediaType === "video" && (
                <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              )}
            </div>

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
              <p className="line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}