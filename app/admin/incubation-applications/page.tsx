"use client";

import { useState, useEffect, JSX } from "react";
import AdminNavbar from "@/components/AdminNavbar";
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
    StickyNote,
    Save,
    Download,
    RefreshCw,
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
    notes?: string;
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
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [currentNotes, setCurrentNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [syncingToSheets, setSyncingToSheets] = useState(false);
    const [creatingSheet, setCreatingSheet] = useState(false);
    const [sheetUrl, setSheetUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
        fetchSheetInfo();
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

    const fetchSheetInfo = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/incubation/sheets/info");
            const data = await res.json();

            if (data.success) {
                setSheetUrl(data.spreadsheetUrl);
            }
        } catch (error) {
            console.log("No sheet configured yet");
        }
    };

    const syncToGoogleSheets = async () => {
        setSyncingToSheets(true);
        try {
            const res = await fetch("http://localhost:5000/api/incubation/sheets/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            const data = await res.json();

            if (data.success) {
                alert(`Successfully synced ${data.count} applications to Google Sheets!`);
                if (data.spreadsheetUrl) {
                    setSheetUrl(data.spreadsheetUrl);
                }
            } else {
                alert("Failed to sync: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error syncing to sheets:", error);
            alert("Failed to sync to Google Sheets");
        } finally {
            setSyncingToSheets(false);
        }
    };

    const createNewSheet = async () => {
        setCreatingSheet(true);
        try {
            const res = await fetch("http://localhost:5000/api/incubation/sheets/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (data.success) {
                alert("New spreadsheet created! Now sync your applications to it.");
                setSheetUrl(data.spreadsheetUrl);
                console.log("Spreadsheet ID:", data.spreadsheetId);
                console.log("Add this to your .env file: GOOGLE_SHEETS_ID=" + data.spreadsheetId);
            } else {
                alert("Failed to create sheet: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error creating sheet:", error);
            alert("Failed to create Google Sheet");
        } finally {
            setCreatingSheet(false);
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

    const saveNotes = async () => {
        if (!selectedApp) return;

        setSavingNotes(true);
        try {
            const res = await fetch(`http://localhost:5000/api/incubation/${selectedApp._id}/notes`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: currentNotes }),
            });

            const data = await res.json();

            if (data.success) {
                setApplications(applications.map(app =>
                    app._id === selectedApp._id ? { ...app, notes: currentNotes } : app
                ));
                setSelectedApp({ ...selectedApp, notes: currentNotes });
                alert("Notes saved successfully!");
                setShowNotesModal(false);
            }
        } catch (error) {
            console.error("Error saving notes:", error);
            alert("Failed to save notes");
        } finally {
            setSavingNotes(false);
        }
    };

    const openNotesModal = (app: Application) => {
        setSelectedApp(app);
        setCurrentNotes(app.notes || "");
        setShowNotesModal(true);
    };

    const viewPitchDeck = (id: string) => {
        window.open(`http://localhost:5000/api/incubation/${id}/pitch-deck/view`, "_blank");
    };

    const exportToSpreadsheet = () => {
        const headers = [
            "Startup Name",
            "Founder Name",
            "Co-Founders",
            "Email",
            "Phone",
            "Website",
            "Industry",
            "Stage",
            "Team Size",
            "Funding Raised",
            "Revenue",
            "Status",
            "Has Pitch Deck",
            "Application Date",
            "Notes"
        ];

        const rows = filteredApplications.map(app => [
            app.startupName,
            app.founderName,
            app.coFounders || "",
            app.email,
            app.phone,
            app.website,
            app.industry,
            app.stage,
            app.teamSize,
            app.fundingRaised,
            app.revenue,
            app.status,
            app.pitchDeck ? "Yes" : "No",
            new Date(app.createdAt).toLocaleDateString(),
            app.notes || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `incubation_applications_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
            under_review: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
            accepted: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
            rejected: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <Rocket className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Incubation Applications
                        </h1>
                    </div>
                    <p className="text-muted-foreground">Manage and review startup applications</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-card p-4 rounded-lg shadow-md border border-border">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg shadow-md border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">Pending</p>
                        <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{stats.pending}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-400">Under Review</p>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.under_review}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg shadow-md border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-400">Accepted</p>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.accepted}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg shadow-md border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-700 dark:text-red-400">Rejected</p>
                        <p className="text-2xl font-bold text-red-800 dark:text-red-300">{stats.rejected}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-card p-4 rounded-lg shadow-md mb-6 border border-border">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by startup name, founder, email, or industry..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="text-muted-foreground w-5 h-5" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-foreground"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="under_review">Under Review</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="text-muted-foreground w-5 h-5" />
                            <select
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-foreground"
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
                        <div className="bg-card p-12 rounded-lg shadow-md text-center border border-border">
                            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground text-lg">No applications found</p>
                        </div>
                    ) : (
                        filteredApplications.map((app) => (
                            <div
                                key={app._id}
                                className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-bold text-foreground">
                                                        {app.startupName}
                                                    </h3>
                                                    {app.notes && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium">
                                                            <StickyNote className="w-3 h-3" />
                                                            Has Notes
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Founded by <span className="font-medium">{app.founderName}</span>
                                                    {app.coFounders && ` & ${app.coFounders}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground truncate">{app.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{app.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Globe className="w-4 h-4 text-muted-foreground" />
                                                <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                                                    Website
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs font-medium">
                                                {app.industry}
                                            </span>
                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full text-xs font-medium">
                                                {app.stage}
                                            </span>
                                            <span className="px-3 py-1 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {app.teamSize}
                                            </span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" /> {app.fundingRaised}
                                            </span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" /> {app.revenue}/mo
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(app.status)}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => viewPitchDeck(app._id)}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium justify-center"
                                        >
                                            <Eye className="w-4 h-4" /> View Deck
                                        </button>
                                        <button
                                            onClick={() => openNotesModal(app)}
                                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 text-sm font-medium justify-center"
                                        >
                                            <StickyNote className="w-4 h-4" /> Quick Notes
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

            {/* Quick Notes Modal */}
            {showNotesModal && selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowNotesModal(false)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-card rounded-xl shadow-2xl max-w-2xl w-full border border-border"
                    >
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                        <StickyNote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Quick Notes</h2>
                                        <p className="text-sm text-muted-foreground">{selectedApp.startupName}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowNotesModal(false)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Notes for this application
                                </label>
                                <textarea
                                    value={currentNotes}
                                    onChange={(e) => setCurrentNotes(e.target.value)}
                                    placeholder="Add notes about the team, product, concerns, follow-up items, etc..."
                                    rows={8}
                                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none text-foreground placeholder:text-muted-foreground"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    These notes are private and only visible to admins
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={saveNotes}
                                    disabled={savingNotes}
                                    className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                >
                                    {savingNotes ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Notes
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowNotesModal(false)}
                                    className="px-4 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {selectedApp && !showNotesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedApp(null)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border"
                    >
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-foreground">Manage Application</h2>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-foreground mb-2">
                                <span className="font-semibold">{selectedApp.startupName}</span>
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">{selectedApp.email}</p>
                            <p className="text-sm text-muted-foreground mb-6">Current Status: {getStatusBadge(selectedApp.status)}</p>

                            <h3 className="text-sm font-semibold text-foreground mb-3">Update Status:</h3>
                            <div className="space-y-2 mb-6">
                                {["under_review", "accepted", "rejected"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            updateStatus(selectedApp._id, status);
                                        }}
                                        disabled={updatingStatus === selectedApp._id}
                                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${selectedApp.status === status
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground hover:bg-muted/80"
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

                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Send Email Notification:</h3>
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
                                <p className="text-xs text-muted-foreground mt-3 text-center">
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