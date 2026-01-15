"use client"

import { useEffect, useState } from "react"
import AdminNavbar from "@/components/AdminNavbar"
import { Users, Edit2, Trash2, Download, UserCheck, Globe } from "lucide-react"

interface Mentor {
    _id: string
    name: string
    designation: string
    department: string
    message: string
    image: string | null
    socialMedia?: {
        linkedin?: string
        website?: string
    }
}

const API_URL = "http://localhost:5000/api/mentors"

/* ===============================
   CSV Export Component
================================ */
interface CSVColumn<T> {
    header: string
    accessor: (item: T) => string | number | boolean
}

interface ExportToCSVProps<T> {
    data: T[]
    columns: CSVColumn<T>[]
    filename?: string
    buttonText?: string
    className?: string
    variant?: "primary" | "secondary" | "outline"
}

function ExportToCSV<T>({
    data,
    columns,
    filename,
    buttonText = "Export to CSV",
    className = "",
    variant = "primary",
}: ExportToCSVProps<T>) {
    const handleExport = () => {
        const headers = columns.map((col) => col.header)

        const rows = data.map((item) =>
            columns.map((col) => {
                const value = col.accessor(item)
                return value !== null && value !== undefined ? String(value) : ""
            })
        )

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(",")
            ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)

        const defaultFilename = `export_${new Date().toISOString().split("T")[0]}.csv`

        link.setAttribute("href", url)
        link.setAttribute("download", filename || defaultFilename)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getButtonStyles = () => {
        const baseStyles =
            "px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"

        const variantStyles = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
            outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        }

        return `${baseStyles} ${variantStyles[variant]} ${className}`
    }

    return (
        <button
            onClick={handleExport}
            disabled={data.length === 0}
            className={getButtonStyles()}
            title={data.length === 0 ? "No data to export" : "Export to CSV"}
        >
            <Download className="w-5 h-5" />
            {buttonText}
        </button>
    )
}

/* ===============================
   HELPER: Validate 4:3 Aspect Ratio
================================ */
const validateAspectRatio = (file: File): Promise<boolean> =>
    new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
            const ratio = img.width / img.height
            const expectedRatio = 4 / 3
            const tolerance = 0.01
            resolve(Math.abs(ratio - expectedRatio) < tolerance)
        }
        img.onerror = () => resolve(false)
        img.src = URL.createObjectURL(file)
    })

export default function MentorsAdminPage() {
    const [mentors, setMentors] = useState<Mentor[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageError, setImageError] = useState<string | null>(null)
    const [formData, setFormData] = useState<any>({
        name: "",
        designation: "",
        department: "",
        message: "",
        linkedin: "",
        website: "",
        image: null
    })

    /* ===============================
       FETCH
    =============================== */
    const fetchMentors = async () => {
        try {
            const res = await fetch(API_URL)
            const data = await res.json()
            setMentors(data)
        } catch (err) {
            console.error("Failed to fetch mentors", err)
        }
    }

    useEffect(() => {
        fetchMentors()
    }, [])

    /* ===============================
       CSV COLUMNS DEFINITION
    ================================ */
    const csvColumns: CSVColumn<Mentor>[] = [
        { header: "Name", accessor: (m) => m.name },
        { header: "Designation", accessor: (m) => m.designation },
        { header: "Department", accessor: (m) => m.department },
        { header: "Message", accessor: (m) => m.message },
        { header: "LinkedIn", accessor: (m) => m.socialMedia?.linkedin || "N/A" },
        { header: "Website", accessor: (m) => m.socialMedia?.website || "N/A" },
        { header: "Has Image", accessor: (m) => m.image ? "Yes" : "No" },
    ]

    /* ===============================
       FORM HANDLING
    =============================== */
    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleFileChange = async (e: any) => {
        const file = e.target.files?.[0]
        if (file) {
            const isValid = await validateAspectRatio(file)
            if (isValid) {
                setFormData({ ...formData, image: file })
                setImageError(null)
            } else {
                setImageError("Please upload an image with 4:3 aspect ratio (e.g., 800x600, 1200x900)")
                e.target.value = ""
            }
        }
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData({
            name: "",
            designation: "",
            department: "",
            message: "",
            linkedin: "",
            website: "",
            image: null
        })
        setImageError(null)
    }

    /* ===============================
       SUBMIT
    =============================== */
    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (isSubmitting) return
        setIsSubmitting(true)

        const payload = new FormData()

        payload.append("name", formData.name)
        payload.append("designation", formData.designation)
        payload.append("department", formData.department)
        payload.append("message", formData.message)

        if (formData.linkedin) payload.append("linkedin", formData.linkedin)
        if (formData.website) payload.append("website", formData.website)

        if (formData.image) {
            payload.append("image", formData.image)
        }

        const method = editingId ? "PUT" : "POST"
        const url = editingId ? `${API_URL}/${editingId}` : API_URL

        try {
            const response = await fetch(url, { method, body: payload })
            if (response.ok) {
                resetForm()
                await fetchMentors()
            } else {
                console.error("Failed to submit:", await response.text())
            }
        } catch (err) {
            console.error("Failed to submit", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    /* ===============================
       EDIT / DELETE
    =============================== */
    const handleEdit = (mentor: Mentor) => {
        setEditingId(mentor._id)
        setFormData({
            name: mentor.name,
            designation: mentor.designation,
            department: mentor.department,
            message: mentor.message,
            linkedin: mentor.socialMedia?.linkedin || "",
            website: mentor.socialMedia?.website || "",
            image: null
        })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this mentor?")) return
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" })
            fetchMentors()
        } catch (err) {
            console.error("Failed to delete", err)
        }
    }

    const stats = {
        total: mentors.length,
        withLinkedIn: mentors.filter(m => m.socialMedia?.linkedin).length,
        withWebsite: mentors.filter(m => m.socialMedia?.website).length,
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                <Users className="w-7 h-7 text-primary-foreground" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Mentor Management
                            </h1>
                        </div>
                        <ExportToCSV
                            data={mentors}
                            columns={csvColumns}
                            filename={`mentors-${new Date().toISOString().split('T')[0]}.csv`}
                            buttonText="Export to CSV"
                            variant="primary"
                        />
                    </div>
                    <p className="text-muted-foreground">Manage mentors and their profiles</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Mentors</p>
                                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                            </div>
                            <Users className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">With LinkedIn</p>
                                <p className="text-3xl font-bold text-foreground">{stats.withLinkedIn}</p>
                            </div>
                            <UserCheck className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">With Website</p>
                                <p className="text-3xl font-bold text-foreground">{stats.withWebsite}</p>
                            </div>
                            <Globe className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                </div>

                {/* FORM */}
                <div className="bg-card rounded-lg shadow-md p-6 mb-8 border border-border">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                        {editingId ? "Edit Mentor" : "Add New Mentor"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-background border border-input p-3 rounded-lg focus:ring-2 focus:ring-ring outline-none text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                            name="designation"
                            placeholder="Designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                            className="bg-background border border-input p-3 rounded-lg focus:ring-2 focus:ring-ring outline-none text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                            name="department"
                            placeholder="Department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            className="bg-background border border-input p-3 rounded-lg focus:ring-2 focus:ring-ring outline-none text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                            name="linkedin"
                            placeholder="LinkedIn URL"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="bg-background border border-input p-3 rounded-lg focus:ring-2 focus:ring-ring outline-none text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                            name="website"
                            placeholder="Website URL"
                            value={formData.website}
                            onChange={handleChange}
                            className="bg-background border border-input p-3 rounded-lg focus:ring-2 focus:ring-ring outline-none text-foreground placeholder:text-muted-foreground"
                        />

                        <textarea
                            name="message"
                            placeholder="Mentor Message / Bio"
                            value={formData.message}
                            onChange={handleChange}
                            className="bg-background border border-input p-3 rounded-lg col-span-full min-h-[120px] focus:ring-2 focus:ring-ring outline-none text-foreground placeholder:text-muted-foreground"
                            required
                        />

                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Upload Image (4:3 aspect ratio required)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required={!editingId}
                                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
                            />
                            {imageError && (
                                <p className="text-destructive text-sm mt-2">{imageError}</p>
                            )}
                            <p className="text-muted-foreground text-xs mt-1">
                                Recommended dimensions: 800x600, 1200x900, or any 4:3 ratio
                            </p>
                        </div>

                        <div className="col-span-full flex gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {isSubmitting ? "Submitting..." : editingId ? "Update Mentor" : "Add Mentor"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-muted text-muted-foreground py-3 rounded-lg hover:bg-muted/80 font-medium"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Total Mentors</p>
                            <p className="text-3xl font-bold text-blue-900">{mentors.length}</p>
                        </div>
                        <div className="text-blue-400">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* LIST */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">All Mentors</h2>
                    {mentors.length === 0 ? (
                        <div className="bg-card p-12 rounded-lg shadow-md text-center border border-border">
                            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground text-lg">No mentors found. Add one to get started!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {mentors.map((mentor) => (
                                <div
                                    key={mentor._id}
                                    className="bg-card rounded-lg shadow-md overflow-hidden border border-border hover:shadow-lg transition-shadow"
                                >
                                    {/* 4:3 Aspect Ratio Container */}
                                    <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                                        {mentor.image ? (
                                            <img
                                                src={mentor.image}
                                                alt={mentor.name}
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute top-0 left-0 w-full h-full bg-primary flex items-center justify-center text-6xl font-bold text-primary-foreground">
                                                {mentor.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-foreground">
                                            {mentor.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {mentor.designation}
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            {mentor.department}
                                        </p>

                                        <p className="text-sm text-foreground mb-4 line-clamp-2">
                                            {mentor.message}
                                        </p>

                                        {/* Social Links */}
                                        {(mentor.socialMedia?.linkedin || mentor.socialMedia?.website) && (
                                            <div className="flex gap-2 mb-4">
                                                {mentor.socialMedia?.linkedin && (
                                                    <a
                                                        href={mentor.socialMedia.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                                                    >
                                                        LinkedIn
                                                    </a>
                                                )}
                                                {mentor.socialMedia?.website && (
                                                    <a
                                                        href={mentor.socialMedia.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                                                    >
                                                        Website
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(mentor)}
                                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(mentor._id)}
                                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}