'use client';

import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { Trash2, Plus, Edit2, X, Check, Briefcase, Download } from 'lucide-react';

interface Startup {
    _id: string;
    companyName: string;
    tagline: string;
    careerUrl: string;
    hasImage?: boolean;
    createdAt: string;
}

interface FormData {
    companyName: string;
    tagline: string;
    careerUrl: string;
    image: File | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
   EXPORT FUNCTION
================================ */
const exportToCSV = (startups: Startup[], type: string) => {
    const headers = ['Company Name', 'Tagline', 'Career URL', 'Has Image', 'Created At'];
    const rows = startups.map(s => [
        s.companyName,
        s.tagline,
        s.careerUrl,
        s.hasImage ? 'Yes' : 'No',
        new Date(s.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_startups_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};

export default function StartupAdminPage() {
    const [activeTab, setActiveTab] = useState<'incubated' | 'graduated'>('incubated');
    const [incubatedStartups, setIncubatedStartups] = useState<Startup[]>([]);
    const [graduatedStartups, setGraduatedStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        companyName: '',
        tagline: '',
        careerUrl: '',
        image: null
    });

    useEffect(() => {
        fetchStartups();
    }, []);

    const fetchStartups = async () => {
        setLoading(true);
        try {
            const [incubatedRes, graduatedRes] = await Promise.all([
                fetch(`${API_BASE}/admin/incubated-startups`),
                fetch(`${API_BASE}/admin/graduated-startups`)
            ]);

            const incubatedData = await incubatedRes.json();
            const graduatedData = await graduatedRes.json();

            setIncubatedStartups(incubatedData.startups || []);
            setGraduatedStartups(graduatedData.startups || []);
        } catch (error) {
            console.error('Error fetching startups:', error);
            alert('Failed to fetch startups');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const isValid = await validateAspectRatio(file);
            if (isValid) {
                setFormData({ ...formData, image: file });
                setImageError(null);
            } else {
                setImageError("Please upload an image with 4:3 aspect ratio (e.g., 800x600, 1200x900)");
                e.target.value = "";
            }
        }
    };

    const handleAdd = async () => {
        if (!formData.companyName || !formData.tagline || !formData.careerUrl) {
            alert('All fields are required');
            return;
        }

        const endpoint = activeTab === 'incubated'
            ? `${API_BASE}/admin/incubated-startups`
            : `${API_BASE}/admin/graduated-startups`;

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('companyName', formData.companyName);
            formDataToSend.append('tagline', formData.tagline);
            formDataToSend.append('careerUrl', formData.careerUrl);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                body: formDataToSend
            });

            const data = await res.json();

            if (data.success) {
                alert(data.message);
                setFormData({ companyName: '', tagline: '', careerUrl: '', image: null });
                setShowAddForm(false);
                setImageError(null);
                fetchStartups();
            } else {
                alert(data.error || 'Failed to add startup');
            }
        } catch (error) {
            console.error('Error adding startup:', error);
            alert('Failed to add startup: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const handleUpdate = async (id: string) => {
        if (!formData.companyName || !formData.tagline || !formData.careerUrl) {
            alert('All fields are required');
            return;
        }

        const endpoint = activeTab === 'incubated'
            ? `${API_BASE}/admin/incubated-startups/${id}`
            : `${API_BASE}/admin/graduated-startups/${id}`;

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('companyName', formData.companyName);
            formDataToSend.append('tagline', formData.tagline);
            formDataToSend.append('careerUrl', formData.careerUrl);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const res = await fetch(endpoint, {
                method: 'PUT',
                body: formDataToSend
            });

            const data = await res.json();

            if (data.success) {
                alert('Startup updated successfully');
                setEditingId(null);
                setFormData({ companyName: '', tagline: '', careerUrl: '', image: null });
                setImageError(null);
                fetchStartups();
            } else {
                alert(data.error || 'Failed to update startup');
            }
        } catch (error) {
            console.error('Error updating startup:', error);
            alert('Failed to update startup: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this startup?')) return;

        const endpoint = activeTab === 'incubated'
            ? `${API_BASE}/admin/incubated-startups/${id}`
            : `${API_BASE}/admin/graduated-startups/${id}`;

        try {
            const res = await fetch(endpoint, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                alert(data.message);
                fetchStartups();
            } else {
                alert(data.error || 'Failed to delete startup');
            }
        } catch (error) {
            console.error('Error deleting startup:', error);
            alert('Failed to delete startup');
        }
    };

    const startEdit = (startup: Startup) => {
        setEditingId(startup._id);
        setFormData({
            companyName: startup.companyName,
            tagline: startup.tagline,
            careerUrl: startup.careerUrl,
            image: null
        });
        setShowAddForm(false);
        setImageError(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ companyName: '', tagline: '', careerUrl: '', image: null });
        setImageError(null);
    };

    const handleExport = () => {
        const startups = activeTab === 'incubated' ? incubatedStartups : graduatedStartups;
        exportToCSV(startups, activeTab);
    };

    const currentStartups = activeTab === 'incubated' ? incubatedStartups : graduatedStartups;

    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header with Export Button */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                <Briefcase className="w-7 h-7 text-primary-foreground" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Startup Admin Dashboard
                            </h1>
                        </div>
                        <p className="text-muted-foreground">Manage incubated and graduated startups</p>
                    </div>

                    {/* Export Button - Top Right */}
                    <button
                        onClick={handleExport}
                        disabled={currentStartups.length === 0}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        title={currentStartups.length === 0 ? "No data to export" : `Export ${activeTab} startups to CSV`}
                    >
                        <Download className="w-5 h-5" />
                        Export to CSV
                    </button>
                </div>

                <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => { setActiveTab('incubated'); setShowAddForm(false); cancelEdit(); }}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'incubated'
                                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            Incubated Startups ({incubatedStartups.length})
                        </button>
                        <button
                            onClick={() => { setActiveTab('graduated'); setShowAddForm(false); cancelEdit(); }}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'graduated'
                                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            Graduated Startups ({graduatedStartups.length})
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Add Button */}
                        <button
                            onClick={() => { setShowAddForm(!showAddForm); cancelEdit(); }}
                            className="mb-6 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={20} />
                            Add New Startup
                        </button>

                        {/* Add Form */}
                        {showAddForm && (
                            <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Add New {activeTab === 'incubated' ? 'Incubated' : 'Graduated'} Startup</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tagline"
                                        value={formData.tagline}
                                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                        className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                                    />
                                    <input
                                        type="url"
                                        placeholder="Career URL"
                                        value={formData.careerUrl}
                                        onChange={(e) => setFormData({ ...formData, careerUrl: e.target.value })}
                                        className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Logo Image - 4:3 Aspect Ratio Required
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
                                    />
                                    {imageError && (
                                        <p className="text-destructive text-sm mt-2">{imageError}</p>
                                    )}
                                    <p className="text-muted-foreground text-xs mt-1">
                                        Recommended dimensions: 800x600, 1200x900, or any 4:3 ratio
                                    </p>
                                    {formData.image && (
                                        <p className="mt-2 text-sm text-foreground">Selected: {formData.image.name}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAdd}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Add Startup
                                    </button>
                                    <button
                                        onClick={() => { setShowAddForm(false); setFormData({ companyName: '', tagline: '', careerUrl: '', image: null }); setImageError(null); }}
                                        className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Startups List */}
                        {loading ? (
                            <div className="text-center py-12 text-muted-foreground">Loading startups...</div>
                        ) : currentStartups.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">No startups found. Add one to get started!</div>
                        ) : (
                            <div className="space-y-4">
                                {currentStartups.map((startup) => (
                                    <div key={startup._id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow bg-card">
                                        {editingId === startup._id ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <input
                                                        type="text"
                                                        value={formData.companyName}
                                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                        className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.tagline}
                                                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                                        className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                                                    />
                                                    <input
                                                        type="url"
                                                        value={formData.careerUrl}
                                                        onChange={(e) => setFormData({ ...formData, careerUrl: e.target.value })}
                                                        className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">
                                                        Update Logo Image - 4:3 Aspect Ratio Required
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
                                                    />
                                                    {imageError && (
                                                        <p className="text-destructive text-sm mt-2">{imageError}</p>
                                                    )}
                                                    <p className="text-muted-foreground text-xs mt-1">
                                                        Recommended dimensions: 800x600, 1200x900, or any 4:3 ratio
                                                    </p>
                                                    {formData.image && (
                                                        <p className="mt-2 text-sm text-foreground">Selected: {formData.image.name}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdate(startup._id)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                                    >
                                                        <Check size={16} />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                                                    >
                                                        <X size={16} />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-4 flex-1">
                                                    {startup.hasImage && (
                                                        <div className="relative w-24 flex-shrink-0" style={{ paddingBottom: '18%' }}>
                                                            <img
                                                                src={`${API_BASE}/admin/${activeTab}-startups/${startup._id}/image`}
                                                                alt={startup.companyName}
                                                                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg border border-border"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-foreground mb-1">{startup.companyName}</h3>
                                                        <p className="text-muted-foreground mb-2">{startup.tagline}</p>
                                                        <a
                                                            href={startup.careerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:text-primary/80 text-sm underline"
                                                        >
                                                            {startup.careerUrl}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() => startEdit(startup)}
                                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(startup._id)}
                                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
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
        </div>
    );
}