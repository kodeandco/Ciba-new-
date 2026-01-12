"use client"

import { useState, useEffect } from "react"
import AdminNavbar from "@/components/AdminNavbar"
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
        setFile(null)
    }

    const handleEdit = async (id: string) => {
        try {
            const formData = new FormData()
            formData.append("title", editTitle)
            formData.append("description", editDescription)
            formData.append("newsletterDate", editDate)

            if (file) {
                formData.append("file", file)
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
            setFile(null)
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
        <div className="min-h-screen bg-background">
            <AdminNavbar />
            
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Newsletter Management</h1>
                        <p className="text-muted-foreground">
                            Manage all your newsletters in one place
                        </p>
                    </div>
                    <button
                        onClick={() => setShowUploadForm(!showUploadForm)}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2"
                    >
                        {showUploadForm ? <X size={20} /> : <Upload size={20} />}
                        {showUploadForm ? "Cancel" : "Upload New"}
                    </button>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg border-2 flex items-center gap-3 ${
                            messageType === "success"
                                ? "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
                                : "bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                        }`}
                    >
                        <AlertCircle size={20} />
                        <p className="font-semibold flex-1">{message}</p>
                        <button onClick={() => setMessage("")} className="hover:opacity-70 transition-opacity">
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Upload Form */}
                {showUploadForm && (
                    <div className="mb-8 space-y-6 bg-card p-8 rounded-lg border-2 border-primary/20 shadow-lg">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Upload New Newsletter</h2>

                        <div>
                            <label className="block mb-2 font-semibold text-foreground">Newsletter Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., CIBA Monthly Update - December 2024"
                                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-foreground">Description *</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Brief description or preview of the newsletter content..."
                                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-foreground">Publication Date *</label>
                            <input
                                type="date"
                                value={newsletterDate}
                                onChange={(e) => setNewsletterDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-foreground">Upload PDF File *</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer transition-all"
                            />
                            {file && (
                                <p className="mt-2 text-sm text-primary flex items-center gap-2">
                                    <Check size={16} />
                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>

                        <div className="bg-primary/5 p-4 rounded-lg border-2 border-primary/20">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sendEmail}
                                    onChange={(e) => setSendEmail(e.target.checked)}
                                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                                />
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <span className="font-semibold text-foreground">Send email to all subscribers</span>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={uploading || !title || !description || !newsletterDate || !file}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
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
                <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileText size={24} />
                            All Newsletters ({newsletters.length})
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading newsletters...</p>
                        </div>
                    ) : newsletters.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText size={48} className="mx-auto mb-4 text-muted-foreground" />
                            <p className="text-foreground text-lg font-medium">No newsletters found</p>
                            <p className="text-muted-foreground text-sm mt-2">Upload your first newsletter to get started</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {newsletters.map((newsletter) => (
                                <div key={newsletter._id} className="p-6 hover:bg-muted/50 transition-colors">
                                    {editingId === newsletter._id ? (
                                        // Edit Mode
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border-2 border-primary bg-background text-foreground font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <textarea
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-2 rounded-lg border-2 border-primary bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <input
                                                type="date"
                                                value={editDate}
                                                onChange={(e) => setEditDate(e.target.value)}
                                                className="px-4 py-2 rounded-lg border-2 border-primary bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />

                                            <div>
                                                <label className="block mb-2 font-semibold text-foreground">Replace PDF File (optional)</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                    className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                                                />
                                                {file && <p className="mt-2 text-sm text-primary">{file.name}</p>}
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(newsletter._id)}
                                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                                                >
                                                    <Save size={18} />
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="px-4 py-2 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-foreground mb-2">{newsletter.title}</h3>
                                                <p className="text-muted-foreground mb-3 line-clamp-2">
                                                    {newsletter.description}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                                                        title="View PDF"
                                                    >
                                                        <Eye size={18} />
                                                        View
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => startEdit(newsletter)}
                                                    className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/30 transition-all flex items-center gap-2"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(newsletter._id, newsletter.title)}
                                                    className="px-4 py-2 bg-destructive/20 text-destructive rounded-lg font-semibold hover:bg-destructive/30 transition-all flex items-center gap-2"
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
        </div>
    )
}