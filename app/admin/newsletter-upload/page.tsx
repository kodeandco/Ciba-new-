"use client"

import { useState, useEffect } from "react"
import { Mail, Upload, Check, Trash2, Edit, Eye, Calendar, FileText, AlertCircle, X, Save } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"

interface Newsletter {
    _id: string
    title: string
    description: string
    newsletterDate: string
    file?: {
        filename: string
        contentType: string
    }
    createdAt: string
}

export default function NewsletterManagement() {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState<"success" | "error" | "">("")
    const [showUploadForm, setShowUploadForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Upload form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [newsletterDate, setNewsletterDate] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [sendEmail, setSendEmail] = useState(true)
    const [uploading, setUploading] = useState(false)

    // Edit form state
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editDate, setEditDate] = useState("")

    useEffect(() => {
        fetchNewsletters()
    }, [])

    const fetchNewsletters = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/api/newsletter/all`)
            const data = await res.json()
            setNewsletters(data)
        } catch (error: any) {
            setMessageType("error")
            setMessage(`Failed to load newsletters: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async () => {
        setUploading(true)
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
                setMessage(`✅ Newsletter uploaded! Sending to ${data.subscriberCount} subscribers...`)
            } else {
                setMessage("✅ Newsletter uploaded successfully!")
            }

            // Clear form and refresh list
            setTitle("")
            setDescription("")
            setNewsletterDate("")
            setFile(null)
            setSendEmail(true)
            setShowUploadForm(false)
            fetchNewsletters()
        } catch (error: any) {
            setMessageType("error")
            setMessage(`❌ ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return
        }

        try {
            const res = await fetch(`${API_URL}/api/newsletter/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Delete failed")
            }

            setMessageType("success")
            setMessage("✅ Newsletter deleted successfully!")
            fetchNewsletters()
        } catch (error: any) {
            setMessageType("error")
            setMessage(`❌ ${error.message}`)
        }
    }

    const startEdit = (newsletter: Newsletter) => {
        setEditingId(newsletter._id)
        setEditTitle(newsletter.title)
        setEditDescription(newsletter.description)
        setEditDate(newsletter.newsletterDate.split('T')[0])
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditTitle("")
        setEditDescription("")
        setEditDate("")
    }

    const handleEdit = async (id: string) => {
        try {
            const formData = new FormData()
            formData.append("title", editTitle)
            formData.append("description", editDescription)
            formData.append("newsletterDate", editDate)

            if (file) {
                formData.append("file", file) // optional new file
            }

            const res = await fetch(`${API_URL}/api/newsletter/${id}`, {
                method: "PUT",
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Update failed")

            setMessageType("success")
            setMessage("✅ Newsletter updated successfully!")
            setEditingId(null)
            setFile(null) // clear selected file
            fetchNewsletters()
        } catch (error: any) {
            setMessageType("error")
            setMessage(`❌ ${error.message}`)
        }
    }


    const viewFile = (id: string) => {
        window.open(`${API_URL}/api/newsletter/${id}/file`, '_blank')
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Newsletter Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all your newsletters in one place
                    </p>
                </div>
                <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
                >
                    {showUploadForm ? <X size={20} /> : <Upload size={20} />}
                    {showUploadForm ? "Cancel" : "Upload New"}
                </button>
            </div>

            {/* Success/Error Message */}
            {message && (
                <div
                    className={`mb-6 p-4 rounded-lg border-2 flex items-center gap-3 ${messageType === "success"
                        ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                        }`}
                >
                    <AlertCircle size={20} />
                    <p className="font-semibold flex-1">{message}</p>
                    <button onClick={() => setMessage("")} className="hover:opacity-70">
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Upload Form */}
            {showUploadForm && (
                <div className="mb-8 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Upload New Newsletter</h2>

                    <div>
                        <label className="block mb-2 font-semibold">Newsletter Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., CIBA Monthly Update - December 2024"
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Description *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Brief description or preview of the newsletter content..."
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Publication Date *</label>
                        <input
                            type="date"
                            value={newsletterDate}
                            onChange={(e) => setNewsletterDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Upload PDF File *</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                        />
                        {file && (
                            <p className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                                <Check size={16} />
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={sendEmail}
                                onChange={(e) => setSendEmail(e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                            />
                            <div className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold">Send email to all subscribers</span>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading || !title || !description || !newsletterDate || !file}
                        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
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
                </div>
            )}

            {/* Newsletter List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <div className="p-6 border-b-2 border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FileText size={24} />
                        All Newsletters ({newsletters.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Loading newsletters...</p>
                    </div>
                ) : newsletters.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">No newsletters found</p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Upload your first newsletter to get started</p>
                    </div>
                ) : (
                    <div className="divide-y-2 divide-gray-200 dark:divide-gray-700">
                        {newsletters.map((newsletter) => (
                            <div key={newsletter._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                                {editingId === newsletter._id ? (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-900 font-semibold text-lg"
                                        />
                                        <textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-900"
                                        />
                                        <input
                                            type="date"
                                            value={editDate}
                                            onChange={(e) => setEditDate(e.target.value)}
                                            className="px-4 py-2 rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-900"
                                        />

                                        <div>
                                            <label className="block mb-2 font-semibold">Replace PDF File (optional)</label>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                                            />
                                            {file && <p className="mt-2 text-sm text-blue-600">{file.name}</p>}
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(newsletter._id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                                            >
                                                <Save size={18} />
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">{newsletter.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                {newsletter.description}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    <span>{formatDate(newsletter.newsletterDate)}</span>
                                                </div>
                                                {newsletter.file && (
                                                    <div className="flex items-center gap-2">
                                                        <FileText size={16} />
                                                        <span>{newsletter.file.filename}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {newsletter.file && (
                                                <button
                                                    onClick={() => viewFile(newsletter._id)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                                                    title="View PDF"
                                                >
                                                    <Eye size={18} />
                                                    View
                                                </button>
                                            )}
                                            <button
                                                onClick={() => startEdit(newsletter)}
                                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition flex items-center gap-2"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(newsletter._id, newsletter.title)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>


        </div>
    )
}