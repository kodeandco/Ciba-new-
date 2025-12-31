"use client";

import { useState, useEffect, JSX } from "react";
import {
    Rocket,
    Search,
    Filter,
    Eye,
    Calendar,
    Mail,
    Phone,
    Globe,
    Users,
    TrendingUp,
    DollarSign,
    Loader2,
    FileText,
    Building2,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Send,
} from "lucide-react";

interface Application {
    _id: string;
    founderName: string;
    coFounders: string;
    email: string;
    phone: string;
    startupName: string;
    industry: string;
    stage: string;
    teamSize: string;
    fundingRaised: string;
    revenue: string;
    website: string;
    description: string;
    status: "pending" | "under_review" | "accepted" | "rejected";
    createdAt: string;
    pitchDeck?: {
        filename: string;
        size: number;
        contentType: string;
    };
}

export default function IncubationApplicationsDashboard() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [monthFilter, setMonthFilter] = useState<string>("all");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [sendingEmail, setSendingEmail] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [searchTerm, statusFilter, monthFilter, applications]);

    const fetchApplications = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/incubation");
            const data = await res.json();

            if (data.success) {
                setApplications(data.applications);
                setFilteredApplications(data.applications);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let filtered = applications;

        if (statusFilter !== "all") {
            filtered = filtered.filter((app) => app.status === statusFilter);
        }

        if (monthFilter !== "all") {
            filtered = filtered.filter((app) => {
                const appDate = new Date(app.createdAt);
                const appMonthYear = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}`;
                return appMonthYear === monthFilter;
            });
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (app) =>
                    app.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.founderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.industry.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredApplications(filtered);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdatingStatus(id);
        try {
            const res = await fetch(`http://localhost:5000/api/incubation/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();

            if (data.success) {
                setApplications(applications.map(app =>
                    app._id === id ? { ...app, status: newStatus as Application['status'] } : app
                ));
                if (selectedApp?._id === id) {
                    setSelectedApp({ ...selectedApp, status: newStatus as Application['status'] });
                }
                alert("Status updated successfully!");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const sendStatusEmail = async (id: string) => {
        setSendingEmail(id);
        try {
            const res = await fetch(`http://localhost:5000/api/incubation/${id}/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (data.success) {
                alert("Email sent successfully!");
            } else {
                alert("Failed to send email: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email");
        } finally {
            setSendingEmail(null);
        }
    };

    const viewPitchDeck = (id: string) => {
        window.open(`http://localhost:5000/api/incubation/${id}/pitch-deck/view`, "_blank");
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            under_review: "bg-blue-100 text-blue-800 border-blue-300",
            accepted: "bg-green-100 text-green-800 border-green-300",
            rejected: "bg-red-100 text-red-800 border-red-300",
        };

        const icons: Record<string, JSX.Element> = {
            pending: <Clock className="w-3 h-3" />,
            under_review: <AlertCircle className="w-3 h-3" />,
            accepted: <CheckCircle className="w-3 h-3" />,
            rejected: <XCircle className="w-3 h-3" />,
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${styles[status]}`}>
                {icons[status]}
                {status.replace("_", " ").toUpperCase()}
            </span>
        );
    };

    // Get unique months from applications
    const getAvailableMonths = () => {
        const months = new Set<string>();
        applications.forEach(app => {
            const date = new Date(app.createdAt);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            months.add(monthYear);
        });
        return Array.from(months).sort().reverse();
    };

    const formatMonthYear = (monthYear: string) => {
        const [year, month] = monthYear.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === "pending").length,
        under_review: applications.filter(a => a.status === "under_review").length,
        accepted: applications.filter(a => a.status === "accepted").length,
        rejected: applications.filter(a => a.status === "rejected").length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Incubation Applications
                        </h1>
                    </div>
                    <p className="text-gray-600">Manage and review startup applications</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-200">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-yellow-200">
                        <p className="text-sm text-yellow-700">Pending</p>
                        <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-200">
                        <p className="text-sm text-blue-700">Under Review</p>
                        <p className="text-2xl font-bold text-blue-800">{stats.under_review}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-green-200">
                        <p className="text-sm text-green-700">Accepted</p>
                        <p className="text-2xl font-bold text-green-800">{stats.accepted}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-red-200">
                        <p className="text-sm text-red-700">Rejected</p>
                        <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by startup name, founder, email, or industry..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-600 w-5 h-5" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="under_review">Under Review</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="text-gray-600 w-5 h-5" />
                            <select
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="all">All Months</option>
                                {getAvailableMonths().map(month => (
                                    <option key={month} value={month}>
                                        {formatMonthYear(month)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    {filteredApplications.length === 0 ? (
                        <div className="bg-white p-12 rounded-lg shadow-md text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No applications found</p>
                        </div>
                    ) : (
                        filteredApplications.map((app) => (
                            <div
                                key={app._id}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-gray-100"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {app.startupName}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Founded by <span className="font-medium">{app.founderName}</span>
                                                    {app.coFounders && ` & ${app.coFounders}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-700 truncate">{app.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-700">{app.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Globe className="w-4 h-4 text-gray-500" />
                                                <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                                    Website
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-700">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                {app.industry}
                                            </span>
                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                                {app.stage}
                                            </span>
                                            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {app.teamSize}
                                            </span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" /> {app.fundingRaised}
                                            </span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" /> {app.revenue}/mo
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(app.status)}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => viewPitchDeck(app._id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <Eye className="w-4 h-4" /> View Deck
                                        </button>
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Status Update Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedApp(null)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Manage Application</h2>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">{selectedApp.startupName}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-1">{selectedApp.email}</p>
                            <p className="text-sm text-gray-600 mb-6">Current Status: {getStatusBadge(selectedApp.status)}</p>

                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Update Status:</h3>
                            <div className="space-y-2 mb-6">
                                {["under_review", "accepted", "rejected"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            updateStatus(selectedApp._id, status);
                                        }}
                                        disabled={updatingStatus === selectedApp._id}
                                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${selectedApp.status === status
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {updatingStatus === selectedApp._id ? (
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                        ) : (
                                            status.replace("_", " ").toUpperCase()
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Send Email Notification:</h3>
                                <button
                                    onClick={() => {
                                        sendStatusEmail(selectedApp._id);
                                    }}
                                    disabled={sendingEmail === selectedApp._id}
                                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                >
                                    {sendingEmail === selectedApp._id ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send {selectedApp.status.replace("_", " ").toUpperCase()} Email
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    This will send a {selectedApp.status.replace("_", " ")} notification email to {selectedApp.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}