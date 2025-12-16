"use client"

import { useEffect, useState } from "react"

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
   PAGE
================================ */
export default function PartnersAdminPage() {
    const [partners, setPartners] = useState<Partner[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

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

        // SAFETY: ensure array
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }))
        }
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData({
            name: "",
            description: "",
            image: null
        })
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <h1 className="text-4xl font-bold text-blue-900 mb-10">
                    Partners Management
                </h1>

                {/* ===============================
            FORM
        ================================ */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-blue-100"
                >
                    <h2 className="text-xl font-semibold text-blue-800 mb-6">
                        {editingId ? "Edit Partner" : "Add Partner"}
                    </h2>

                    <div className="grid gap-4">
                        <input
                            name="name"
                            placeholder="Partner Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />

                        <textarea
                            name="description"
                            placeholder="Partner Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="border border-blue-200 p-3 rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-400 outline-none"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="text-blue-700"
                        />

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
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
        ================================ */}
                <div className="grid md:grid-cols-3 gap-8">
                    {partners.map(partner => (
                        <div
                            key={partner._id}
                            className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition"
                        >
                            <img
                                src={partner.image || "/placeholder.svg"}
                                alt={partner.name}
                                className="h-48 w-full object-cover"
                            />

                            <div className="p-4">
                                <h3 className="font-bold text-lg text-blue-900">
                                    {partner.name}
                                </h3>

                                <p className="text-sm text-blue-700 mt-2">
                                    {partner.description}
                                </p>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => handleEdit(partner)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(partner._id)}
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
