"use client"

import { useState } from "react"
import { Mail, Upload, Check } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"

export default function AdminNewsletterUpload() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [newsletterDate, setNewsletterDate] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [sendEmail, setSendEmail] = useState(true)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState<"success" | "error" | "">("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        setMessageType("")

        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("newsletterDate", newsletterDate)
            formData.append("sendEmail", sendEmail.toString())
            if (file) formData.append("file", file)

            const res = await fetch(`${API_URL}/api/newsletter`, {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Upload failed")

            setMessageType("success")
            if (sendEmail && data.subscriberCount) {
                setMessage(
                    `✅ Newsletter uploaded successfully! Sending emails to ${data.subscriberCount} subscribers...`
                )
            } else {
                setMessage("✅ Newsletter uploaded successfully!")
            }

            // Clear form
            setTitle("")
            setDescription("")
            setNewsletterDate("")
            setFile(null)
            setSendEmail(true)
        } catch (error: any) {
            setMessageType("error")
            setMessage(`❌ ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-20 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Upload Newsletter</h1>
                <p className="text-muted-foreground">
                    Upload a new newsletter and optionally notify subscribers
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-background p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg"
            >
                {/* Title */}
                <div>
                    <label className="block mb-2 font-semibold text-foreground">
                        Newsletter Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g., CIBA Monthly Update - December 2024"
                        className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-2 font-semibold text-foreground">
                        Description *
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={6}
                        placeholder="Write a brief description or preview of the newsletter content..."
                        className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                {/* Newsletter Date */}
                <div>
                    <label className="block mb-2 font-semibold text-foreground">
                        Publication Date *
                    </label>
                    <input
                        type="date"
                        value={newsletterDate}
                        onChange={(e) => setNewsletterDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block mb-2 font-semibold text-foreground">
                        Upload Newsletter File (PDF) *
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            required
                            className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-background file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                        />
                    </div>
                    {file && (
                        <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <Check size={16} />
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                    )}
                </div>

                {/* Send Email Toggle */}
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span className="font-semibold text-foreground">
                                Send email notification to all subscribers
                            </span>
                        </div>
                    </label>
                    <p className="text-sm text-muted-foreground mt-2 ml-8">
                        {sendEmail
                            ? "Subscribers will receive an email with the newsletter details"
                            : "Newsletter will be uploaded without email notification"}
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            Upload Newsletter
                        </>
                    )}
                </button>

                {/* Success/Error Message */}
                {message && (
                    <div
                        className={`p-4 rounded-lg border-2 ${messageType === "success"
                                ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                                : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                            }`}
                    >
                        <p className="font-semibold text-center">{message}</p>
                    </div>
                )}
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    📌 How Email Notification Works
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Emails are sent to all active subscribers in the database</li>
                    <li>• Each email includes the newsletter title and description</li>
                    <li>• Subscribers can click to view the full newsletter</li>
                    <li>• Email sending happens in the background</li>
                </ul>
            </div>
        </div>
    )
}