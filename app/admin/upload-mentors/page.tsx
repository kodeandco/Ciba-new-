"use client"

import { useEffect, useState } from "react"

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

export default function MentorsAdminPage() {
    const [mentors, setMentors] = useState<Mentor[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
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
       FORM HANDLING
    =============================== */
    const handleChange = (e: any) => {
        const { name, value, files } = e.target
        if (files) setFormData({ ...formData, image: files[0] })
        else setFormData({ ...formData, [name]: value })
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
    }

    /* ===============================
       SUBMIT
    =============================== */
    const handleSubmit = async (e: any) => {
        e.preventDefault()

        // Prevent double submission
        if (isSubmitting) return
        setIsSubmitting(true)

        const payload = new FormData()

        // Add all fields to FormData
        payload.append("name", formData.name)
        payload.append("designation", formData.designation)
        payload.append("department", formData.department)
        payload.append("message", formData.message)

        if (formData.linkedin) payload.append("linkedin", formData.linkedin)
        if (formData.website) payload.append("website", formData.website)

        // Add image if present
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
                <h1 className="text-4xl font-bold text-blue-900 mb-8">
                    Mentor Management
                </h1>

                {/* ===============================
            FORM
        =============================== */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-blue-100"
                >
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

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            required={!editingId}
                            className="col-span-full text-blue-700"
                        />

                        <div className="col-span-full flex gap-4">
                            <button
                                type="submit"
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
                </form>

                {/* ===============================
            LIST
        =============================== */}
                <div className="grid md:grid-cols-3 gap-8">
                    {mentors.map((mentor) => (
                        <div
                            key={mentor._id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition"
                        >
                            <img
                                src={mentor.image || "/placeholder.svg"}
                                alt={mentor.name}
                                className="h-48 w-full object-cover"
                            />

                            <div className="p-4">
                                <h3 className="font-bold text-lg text-blue-900">
                                    {mentor.name}
                                </h3>
                                <p className="text-sm text-blue-700">
                                    {mentor.designation}
                                </p>
                                <p className="text-xs text-blue-500 mb-4">
                                    {mentor.department}
                                </p>

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