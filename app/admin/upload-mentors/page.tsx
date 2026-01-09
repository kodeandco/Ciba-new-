"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"

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
       EXPORT TO CSV
    ================================ */
    const exportToCSV = () => {
        // Define CSV headers
        const headers = [
            'Name',
            'Designation',
            'Department',
            'Message',
            'LinkedIn',
            'Website',
            'Has Image'
        ]

        // Convert mentors to CSV rows
        const rows = mentors.map(mentor => {
            return [
                mentor.name,
                mentor.designation,
                mentor.department,
                mentor.message,
                mentor.socialMedia?.linkedin || 'N/A',
                mentor.socialMedia?.website || 'N/A',
                mentor.image ? 'Yes' : 'No'
            ]
        })

        // Escape and format CSV content
        const escapeCSV = (value: string) => {
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`
            }
            return value
        }

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n')

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        const timestamp = new Date().toISOString().split('T')[0]
        link.setAttribute('href', url)
        link.setAttribute('download', `mentors-${timestamp}.csv`)
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-blue-900">
                        Mentor Management
                    </h1>
                    <button
                        onClick={exportToCSV}
                        disabled={mentors.length === 0}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        <Download className="w-5 h-5" />
                        Export as CSV
                    </button>
                </div>

                {/* FORM */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-blue-100">
                    <h2 className="text-xl font-semibold text-blue-800 mb-6">
                        {editingId ? "Edit Mentor" : "Add New Mentor"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            name="designation"
                            placeholder="Designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                            className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            name="department"
                            placeholder="Department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            name="linkedin"
                            placeholder="LinkedIn URL"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            name="website"
                            placeholder="Website URL"
                            value={formData.website}
                            onChange={handleChange}
                            className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />

                        <textarea
                            name="message"
                            placeholder="Mentor Message / Bio"
                            value={formData.message}
                            onChange={handleChange}
                            className="border border-blue-200 p-3 rounded-lg col-span-full min-h-[120px] focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />

                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-blue-800 mb-2">
                                Upload Image (4:3 aspect ratio required)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required={!editingId}
                                className="text-blue-700 w-full"
                            />
                            {imageError && (
                                <p className="text-red-600 text-sm mt-2">{imageError}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                                Recommended dimensions: 800x600, 1200x900, or any 4:3 ratio
                            </p>
                        </div>

                        <div className="col-span-full flex gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Submitting..." : editingId ? "Update Mentor" : "Add Mentor"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200"
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
                <div className="grid md:grid-cols-3 gap-8">
                    {mentors.map((mentor) => (
                        <div
                            key={mentor._id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition"
                        >
                            {/* 4:3 Aspect Ratio Container */}
                            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                                <img
                                    src={mentor.image || "/placeholder.svg"}
                                    alt={mentor.name}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg text-blue-900">
                                    {mentor.name}
                                </h3>
                                <p className="text-sm text-blue-700">
                                    {mentor.designation}
                                </p>
                                <p className="text-xs text-blue-500 mb-2">
                                    {mentor.department}
                                </p>

                                {/* Social Links */}
                                {(mentor.socialMedia?.linkedin || mentor.socialMedia?.website) && (
                                    <div className="flex gap-2 mb-4">
                                        {mentor.socialMedia?.linkedin && (
                                            <a
                                                href={mentor.socialMedia.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-xs"
                                            >
                                                LinkedIn
                                            </a>
                                        )}
                                        {mentor.socialMedia?.website && (
                                            <a
                                                href={mentor.socialMedia.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-xs"
                                            >
                                                Website
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleEdit(mentor)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mentor._id)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}