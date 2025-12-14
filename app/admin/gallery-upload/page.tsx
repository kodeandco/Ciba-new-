"use client"

import { useEffect, useState } from "react"

type GalleryItem = {
    _id: string
    title: string
    description: string
    createdAt: string
}

export default function AdminGalleryPage() {
    const [gallery, setGallery] = useState<GalleryItem[]>([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const fetchGallery = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/gallery", { cache: "no-store" })
            const data = await res.json()
            setGallery(data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchGallery()
    }, [])

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setImage(null)
        setEditingId(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !description) return alert("Title and description required")
        if (!image && !editingId) return alert("Please select an image")

        setLoading(true)

        try {
            let res
            if (editingId) {
                // Edit existing gallery item (PATCH)
                res = await fetch(`http://localhost:5000/api/gallery/${editingId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description }),
                })
            } else {
                // Upload new image
                const formData = new FormData()
                formData.append("title", title)
                formData.append("description", description)
                if (image) formData.append("image", image)

                res = await fetch("http://localhost:5000/api/gallery", {
                    method: "POST",
                    body: formData,
                })
            }

            if (!res.ok) throw new Error("Failed")
            alert(editingId ? "Gallery updated" : "Image uploaded")
            resetForm()
            fetchGallery()
        } catch (err) {
            console.error(err)
            alert("Error submitting")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return
        try {
            const res = await fetch(`http://localhost:5000/api/gallery/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Delete failed")
            fetchGallery()
        } catch (err) {
            console.error(err)
            alert("Error deleting")
        }
    }

    const handleEdit = (item: GalleryItem) => {
        setEditingId(item._id)
        setTitle(item.title)
        setDescription(item.description)
    }

    return (
        <div className="min-h-screen bg-muted px-4 py-12">
            <div className="max-w-3xl mx-auto bg-background p-6 rounded-xl shadow-lg space-y-6">
                <h1 className="text-2xl font-bold text-center">
                    {editingId ? "Edit Gallery Item" : "Upload Gallery Image"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    {!editingId && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            required
                            className="w-full"
                        />
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90"
                        >
                            {loading ? "Processing..." : editingId ? "Update" : "Upload"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:opacity-90"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Gallery grid */}
            <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gallery.map((item) => (
                    <div key={item._id} className="bg-background border rounded-xl shadow-sm overflow-hidden">
                        <img
                            src={`http://localhost:5000/api/gallery/${item._id}/image`}
                            alt={item.title}
                            className="w-full object-cover max-h-64"
                        />
                        <div className="p-3 space-y-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:opacity-90"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:opacity-90"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
