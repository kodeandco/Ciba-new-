'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, X, Check, Download } from 'lucide-react';

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
   EXPORT FUNCTIONS
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
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_startups_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};

const exportToJSON = (startups: Startup[], type: string) => {
    const jsonContent = JSON.stringify(startups, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_startups_${new Date().toISOString().split('T')[0]}.json`;
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
    const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
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

    const handleExport = (format: 'csv' | 'json') => {
        const startups = activeTab === 'incubated' ? incubatedStartups : graduatedStartups;
        if (format === 'csv') {
            exportToCSV(startups, activeTab);
        } else {
            exportToJSON(startups, activeTab);
        }
        setShowExportMenu(false);
    };

    const currentStartups = activeTab === 'incubated' ? incubatedStartups : graduatedStartups;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Startup Admin Dashboard</h1>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => { setActiveTab('incubated'); setShowAddForm(false); cancelEdit(); }}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'incubated'
                                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Incubated Startups ({incubatedStartups.length})
                        </button>
                        <button
                            onClick={() => { setActiveTab('graduated'); setShowAddForm(false); cancelEdit(); }}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'graduated'
                                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Graduated Startups ({graduatedStartups.length})
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Action Buttons */}
                        <div className="mb-6 flex gap-3">
                            <button
                                onClick={() => { setShowAddForm(!showAddForm); cancelEdit(); }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={20} />
                                Add New Startup
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Download size={20} />
                                    Export Data
                                </button>

                                {showExportMenu && (
                                    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                                        <button
                                            onClick={() => handleExport('csv')}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors rounded-t-lg"
                                        >
                                            Export as CSV
                                        </button>
                                        <button
                                            onClick={() => handleExport('json')}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors rounded-b-lg"
                                        >
                                            Export as JSON
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add Form */}
                        {showAddForm && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold mb-4">Add New {activeTab === 'incubated' ? 'Incubated' : 'Graduated'} Startup</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tagline"
                                        value={formData.tagline}
                                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="url"
                                        placeholder="Career URL"
                                        value={formData.careerUrl}
                                        onChange={(e) => setFormData({ ...formData, careerUrl: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Logo Image - 4:3 Aspect Ratio Required
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {imageError && (
                                        <p className="text-red-600 text-sm mt-2">{imageError}</p>
                                    )}
                                    <p className="text-gray-500 text-xs mt-1">
                                        Recommended dimensions: 800x600, 1200x900, or any 4:3 ratio
                                    </p>
                                    {formData.image && (
                                        <p className="mt-2 text-sm text-gray-600">Selected: {formData.image.name}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAdd}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Add Startup
                                    </button>
                                    <button
                                        onClick={() => { setShowAddForm(false); setFormData({ companyName: '', tagline: '', careerUrl: '', image: null }); setImageError(null); }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Startups List */}
                        {loading ? (
                            <div className="text-center py-12 text-gray-600">Loading startups...</div>
                        ) : currentStartups.length === 0 ? (
                            <div className="text-center py-12 text-gray-600">No startups found. Add one to get started!</div>
                        ) : (
                            <div className="space-y-4">
                                {currentStartups.map((startup) => (
                                    <div key={startup._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        {editingId === startup._id ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <input
                                                        type="text"
                                                        value={formData.companyName}
                                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.tagline}
                                                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <input
                                                        type="url"
                                                        value={formData.careerUrl}
                                                        onChange={(e) => setFormData({ ...formData, careerUrl: e.target.value })}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Update Logo Image - 4:3 Aspect Ratio Required
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    {imageError && (
                                                        <p className="text-red-600 text-sm mt-2">{imageError}</p>
                                                    )}
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        Recommended dimensions: 800x600, 1200x900, or any 4:3 ratio
                                                    </p>
                                                    {formData.image && (
                                                        <p className="mt-2 text-sm text-gray-600">Selected: {formData.image.name}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdate(startup._id)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        <Check size={16} />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="flex items-center gap-2 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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
                                                                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg border border-gray-200"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{startup.companyName}</h3>
                                                        <p className="text-gray-600 mb-2">{startup.tagline}</p>
                                                        <a
                                                            href={startup.careerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                                                        >
                                                            {startup.careerUrl}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() => startEdit(startup)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(startup._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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