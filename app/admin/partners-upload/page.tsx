"use client"

import { useEffect, useState } from "react"
import AdminNavbar from "@/components/AdminNavbar"

/* ===============================
   TYPES
================================ */
interface Partner {
    _id: string
    name: string
    description: string
    image: string | null
}

/* ===============================
   CONFIG
================================ */
const API_URL = "http://localhost:5000/api/partners"

/* ===============================
   HELPER: File → Base64
================================ */
const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () =>
            resolve(reader.result!.toString().split(",")[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
    })

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

/* ===============================
   PAGE
================================ */
export default function PartnersAdminPage() {
    const [partners, setPartners] = useState<Partner[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [imageError, setImageError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null as File | null
    })

    /* ===============================
       FETCH ALL
    ================================ */
    const fetchPartners = async () => {
        const res = await fetch(API_URL)
        const data = await res.json()
        setPartners(Array.isArray(data) ? data : [])
    }

    useEffect(() => {
        fetchPartners()
    }, [])

    /* ===============================
       FORM HANDLING
    ================================ */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const isValid = await validateAspectRatio(file)
            if (isValid) {
                setFormData(prev => ({ ...prev, image: file }))
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
            description: "",
            image: null
        })
        setImageError(null)
    }

    /* ===============================
       SUBMIT
    ================================ */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        let payload: any = {
            name: formData.name,
            description: formData.description
        }

        if (formData.image) {
            payload.image = await toBase64(formData.image)
            payload.contentType = formData.image.type
        }

        const method = editingId ? "PUT" : "POST"
        const url = editingId ? `${API_URL}/${editingId}` : API_URL

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        resetForm()
        fetchPartners()
        setLoading(false)
    }

    /* ===============================
       EDIT
    ================================ */
    const handleEdit = (partner: Partner) => {
        setEditingId(partner._id)
        setFormData({
            name: partner.name,
            description: partner.description,
            image: null
        })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    /* ===============================
       DELETE
    ================================ */
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this partner?")) return
        await fetch(`${API_URL}/${id}`, { method: "DELETE" })
        fetchPartners()
    }

    /* ===============================
       UI
    ================================ */
    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />
            
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

                {/* HEADER */}
                <h1 className="text-3xl font-bold text-foreground mb-8">
                    Partners Management
                </h1>

                {/* FORM */}
                <div className="bg-card rounded-lg shadow-lg p-6 mb-8 border border-border">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                        {editingId ? "Edit Partner" : "Add Partner"}
                    </h2>

                    <div className="grid gap-4">
                        <input
                            name="name"
                            placeholder="Partner Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border border-border bg-background text-foreground p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />

                        <textarea
                            name="description"
                            placeholder="Partner Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="border border-border bg-background text-foreground p-3 rounded-lg min-h-[120px] focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Upload Image (4:3 aspect ratio required)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="text-foreground w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                            />
                            {imageError && (
                                <p className="text-destructive text-sm mt-2">{imageError}</p>
                            )}
                            <p className="text-muted-foreground text-xs mt-1">
                                Recommended dimensions: 800x600, 1200x900, or any 4:3 ratio
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Partner"
                                        : "Add Partner"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-muted text-foreground py-3 rounded-lg hover:bg-muted/80 transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* LIST */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map(partner => (
                        <div
                            key={partner._id}
                            className="bg-card rounded-lg shadow-lg border border-border overflow-hidden hover:shadow-xl transition-all"
                        >
                            {/* 4:3 Aspect Ratio Container */}
                            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                                <img
                                    src={partner.image || "/placeholder.svg"}
                                    alt={partner.name}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg text-foreground">
                                    {partner.name}
                                </h3>

                                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                    {partner.description}
                                </p>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => handleEdit(partner)}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-all font-semibold"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(partner._id)}
                                        className="flex-1 bg-destructive/20 hover:bg-destructive/30 text-destructive py-2 rounded-lg transition-all font-semibold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {partners.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No partners found</p>
                        <p className="text-muted-foreground text-sm mt-2">Add your first partner to get started</p>
                    </div>
                )}

            </div>
        </div>
    )
}