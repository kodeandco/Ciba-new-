"use client"

import { useState, useEffect } from "react"
import AdminNavbar from "@/components/AdminNavbar"
import { Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"

interface Testimonial {
    _id: string
    name: string
    designation: string
    company: string
    message: string
    image: string
    isActive: boolean
    displayOrder: number
}

interface TestimonialFormData {
    name: string
    designation: string
    company: string
    message: string
    image: string
    isActive: boolean
    displayOrder: number
}

// API base URL
const API_BASE_URL = 'http://localhost:5000/api/testimonials';
const token = localStorage.getItem("admin-token");
// API functions
const api = {
    getTestimonials: async (): Promise<Testimonial[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            return [];
        }
    },
    createTestimonial: async (data: TestimonialFormData): Promise<Testimonial> => {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Server error:", errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
    },
    updateTestimonial: async (id: string, data: TestimonialFormData): Promise<Testimonial> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Server error:", errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
    },
    deleteTestimonial: async (id: string): Promise<{ success: boolean }> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Server error:", errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    },
}

export default function TestimonialsAdmin() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<TestimonialFormData>({
        name: "",
        designation: "",
        company: "",
        message: "",
        image: "",
        isActive: true,
        displayOrder: 0,
    })
    const [imagePreview, setImagePreview] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        loadTestimonials()
    }, [])

    const loadTestimonials = async () => {
        setLoading(true)
        try {
            const data = await api.getTestimonials()
            setTestimonials(data || [])
        } catch (error) {
            console.error("Error loading testimonials:", error)
            setTestimonials([])
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // Validate required fields
        if (!formData.name || !formData.designation || !formData.company || !formData.message) {
            alert("Please fill in all required fields")
            return
        }

        if (formData.message.length < 20) {
            alert("Message must be at least 20 characters long")
            return
        }

        setLoading(true)

        try {
            if (editingId) {
                const updated = await api.updateTestimonial(editingId, formData)
                setTestimonials(testimonials.map((t) => (t._id === editingId ? updated : t)))
            } else {
                const created = await api.createTestimonial(formData)
                setTestimonials([...testimonials, created])
            }
            closeModal()
        } catch (error) {
            console.error("Error:", error)
            alert("Failed to save testimonial. Please check the console for details.")
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return

        setLoading(true)
        await api.deleteTestimonial(id)
        setTestimonials(testimonials.filter((t) => t._id !== id))
        setLoading(false)
    }

    const openModal = (testimonial: Testimonial | null = null) => {
        if (testimonial) {
            setFormData({
                name: testimonial.name,
                designation: testimonial.designation,
                company: testimonial.company,
                message: testimonial.message,
                image: testimonial.image,
                isActive: testimonial.isActive,
                displayOrder: testimonial.displayOrder,
            })
            setEditingId(testimonial._id)
            setImagePreview(testimonial.image)
        } else {
            setFormData({
                name: "",
                designation: "",
                company: "",
                message: "",
                image: "",
                isActive: true,
                displayOrder: testimonials.length + 1,
            })
            setEditingId(null)
            setImagePreview("")
        }
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
        setImagePreview("")
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result
                if (typeof result === 'string') {
                    setImagePreview(result)
                    setFormData({ ...formData, image: result })
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const stats = {
        total: testimonials.length,
        active: testimonials.filter(t => t.isActive).length,
        inactive: testimonials.filter(t => !t.isActive).length,
    }


    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <MessageSquare className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Testimonials Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground">Manage success stories and client feedback</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Testimonials</p>
                                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                            </div>
                            <MessageSquare className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active</p>
                                <p className="text-3xl font-bold text-foreground">{stats.active}</p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Inactive</p>
                                <p className="text-3xl font-bold text-foreground">{stats.inactive}</p>
                            </div>
                            <AlertCircle className="w-12 h-12 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Add Button */}
                <div className="mb-6">
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all hover:bg-primary/90 shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Add Testimonial
                    </button>
                </div>

                {/* Testimonials List */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="bg-card p-12 rounded-lg shadow-md text-center border border-border">
                        <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">No testimonials found. Click "Add Testimonial" to create one.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial._id}
                                className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
                            >
                                <div className="flex gap-6">
                                    {/* Left side - Image (4:3 ratio) */}
                                    <div className="flex-shrink-0">
                                        {testimonial.image ? (
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-48 h-36 rounded-lg object-cover border-2 border-primary"
                                                style={{ aspectRatio: '4/3' }}
                                            />
                                        ) : (
                                            <div className="w-48 h-36 rounded-lg bg-primary flex items-center justify-center text-4xl font-bold border-2 border-primary text-primary-foreground">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right side - Content */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-foreground text-lg">{testimonial.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {testimonial.designation} at {testimonial.company}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openModal(testimonial)}
                                                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4 text-primary" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(testimonial._id)}
                                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-foreground text-sm leading-relaxed mb-4 flex-1">
                                            "{testimonial.message}"
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                                            <span>Order: {testimonial.displayOrder}</span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${testimonial.isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {testimonial.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => closeModal()}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {editingId ? "Edit Testimonial" : "Add Testimonial"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Profile Image (4:3 ratio recommended)
                                    </label>
                                    <div className="flex items-start gap-4">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-48 h-36 rounded-lg object-cover border-2 border-primary"
                                                style={{ aspectRatio: '4/3' }}
                                            />
                                        ) : (
                                            <div className="w-48 h-36 rounded-lg bg-muted flex flex-col items-center justify-center border-2 border-border border-dashed">
                                                <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
                                                <span className="text-xs text-muted-foreground">4:3 ratio</span>
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-2">
                                            <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer transition-colors hover:bg-primary/90">
                                                <Upload className="w-4 h-4" />
                                                Upload Image
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                Recommended: 800x600px (4:3 ratio)<br />
                                                Max size: 5MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Designation */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Designation *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                                        placeholder="CEO"
                                    />
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Company *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                                        placeholder="Tech Solutions Inc."
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none text-foreground placeholder:text-muted-foreground"
                                        placeholder="Share your experience..."
                                    />
                                </div>

                                {/* Display Order and Active Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.displayOrder}
                                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                                        <select
                                            value={formData.isActive.toString()}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                                            className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-5 h-5" />
                                        {loading ? "Saving..." : editingId ? "Update" : "Create"}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-semibold transition-colors hover:bg-muted/80"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}