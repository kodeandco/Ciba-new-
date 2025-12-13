"use client"

import { useState } from "react"

export default function AdminNewsletterUpload() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [newsletterDate, setNewsletterDate] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("newsletterDate", newsletterDate)
            if (file) formData.append("file", file)

            const res = await fetch("http://localhost:5000/api/newsletter", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Upload failed")

            setMessage("✅ Newsletter uploaded successfully")
            setTitle("")
            setDescription("")
            setNewsletterDate("")
            setFile(null)
        } catch (error: any) {
            setMessage(`❌ ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-20 px-4">
            <h1 className="text-3xl font-bold mb-8">Upload Newsletter</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-background p-8 rounded-2xl border border-border"
            >
                {/* Title */}
                <div>
                    <label className="block mb-2 font-semibold">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-2 font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                    />
                </div>

                {/* Newsletter Date */}
                <div>
                    <label className="block mb-2 font-semibold">Newsletter Date</label>
                    <input
                        type="date"
                        value={newsletterDate}
                        onChange={(e) => setNewsletterDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block mb-2 font-semibold">
                        Upload File (PDF / Image)
                    </label>
                    <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                    {loading ? "Uploading..." : "Upload Newsletter"}
                </button>

                {/* Message */}
                {message && (
                    <p className="text-center mt-4 font-semibold">{message}</p>
                )}
            </form>
        </div>
    )
}
