"use client"

import { useState } from "react"

export default function GalleryUploadPage() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!image) return alert("Please select an image")

        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("image", image)

        setLoading(true)

        try {
            const res = await fetch("http://localhost:5000/api/gallery", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Upload failed")

            alert("Image uploaded successfully")
            setTitle("")
            setDescription("")
            setImage(null)
        } catch (err) {
            alert("Error uploading image")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-background w-full max-w-md rounded-xl shadow-lg p-6 space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">Upload Gallery Image</h1>

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    required
                    className="w-full"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90"
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    )
}
