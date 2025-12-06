"use client";

import { useState, useEffect } from "react";
import {
    Calendar,
    Search,
    Filter,
    Clock,
    Mail,
    Phone,
    User,
    MessageSquare,
    Loader2,
    FileText,
    CheckCircle,
    Bell,
    Users,
} from "lucide-react";

interface Booking {
    _id: string;
    name: string;
    email: string;
    phone: string;
    slot: string;
    sessionDate: string;
    question1: string;
    question2: string;
    question3: string;
    subscribeNewsletter: boolean;
    createdAt: string;
}

export default function StartupClinicDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [searchTerm, bookings]);

    const fetchBookings = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/clinic");
            const data = await res.json();

            if (data.success) {
                setBookings(data.bookings);
                setFilteredBookings(data.bookings);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        let filtered = bookings;

        if (searchTerm) {
            filtered = filtered.filter(
                (booking) =>
                    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.phone.includes(searchTerm) ||
                    booking.slot.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBookings(filtered);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const stats = {
        total: bookings.length,
        newsletter: bookings.filter(b => b.subscribeNewsletter).length,
        today: bookings.filter(b => {
            const bookingDate = new Date(b.createdAt).toDateString();
            const today = new Date().toDateString();
            return bookingDate === today;
        }).length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <Calendar className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Startup Clinic Bookings
                        </h1>
                    </div>
                    <p className="text-gray-600">Manage and review clinic session bookings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Bookings</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Users className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Today's Bookings</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
                            </div>
                            <Clock className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Newsletter Subscribers</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.newsletter}</p>
                            </div>
                            <Bell className="w-12 h-12 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, or slot..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        />
                    </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white p-12 rounded-lg shadow-md text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No bookings found</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-gray-100"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {booking.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Booked on {formatDate(booking.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-700 truncate">{booking.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-700">{booking.phone}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-2 rounded-lg">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                <span className="text-blue-700 font-medium">
                                                    {booking.sessionDate ? new Date(booking.sessionDate).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : 'Date not set'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm bg-green-50 px-3 py-2 rounded-lg">
                                                <Clock className="w-4 h-4 text-green-600" />
                                                <span className="text-green-700 font-medium">{booking.slot}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Confirmed
                                            </span>
                                            {booking.subscribeNewsletter && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                    <Bell className="w-3 h-3" /> Newsletter Subscribed
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 lg:items-end">
                                        <button
                                            onClick={() => setSelectedBooking(booking)}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2"
                                        >
                                            <MessageSquare className="w-4 h-4" /> View Questions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBooking(null)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-900">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Slot</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.slot}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-900">Booking Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Session Date</p>
                                        <p className="font-medium text-gray-900">
                                            {selectedBooking.sessionDate ? new Date(selectedBooking.sessionDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Not set'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Time Slot</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.slot}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Booked At</p>
                                        <p className="font-medium text-gray-900">{formatDate(selectedBooking.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Newsletter</p>
                                        <p className="font-medium text-gray-900">
                                            {selectedBooking.subscribeNewsletter ? (
                                                <span className="text-green-600 inline-flex items-center gap-1">
                                                    <CheckCircle className="w-4 h-4" /> Subscribed
                                                </span>
                                            ) : (
                                                "Not subscribed"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-900">Questions Submitted</h3>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Question 1:</p>
                                        <p className="text-gray-900">{selectedBooking.question1 || "No answer provided"}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Question 2:</p>
                                        <p className="text-gray-900">{selectedBooking.question2 || "No answer provided"}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Question 3:</p>
                                        <p className="text-gray-900">{selectedBooking.question3 || "No answer provided"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <a
                                    href={`mailto:${selectedBooking.email}`}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium inline-flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-4 h-4" /> Send Email
                                </a>
                                <a
                                    href={`tel:${selectedBooking.phone}`}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium inline-flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-4 h-4" /> Call
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}