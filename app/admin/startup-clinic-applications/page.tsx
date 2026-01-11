"use client";

import { useState, useEffect } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import {
    Calendar,
    Search,
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
    CalendarPlus,
    AlertCircle,
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
    calendarEventId?: string;
}

export default function StartupClinicDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [addingToCalendar, setAddingToCalendar] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    const [selectedWeek, setSelectedWeek] = useState<string>("all");

    const months = [
        { value: "all", label: "All Months" },
        { value: "0", label: "January" },
        { value: "1", label: "February" },
        { value: "2", label: "March" },
        { value: "3", label: "April" },
        { value: "4", label: "May" },
        { value: "5", label: "June" },
        { value: "6", label: "July" },
        { value: "7", label: "August" },
        { value: "8", label: "September" },
        { value: "9", label: "October" },
        { value: "10", label: "November" },
        { value: "11", label: "December" },
    ];

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [searchTerm, bookings, selectedMonth, selectedWeek]);

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

    const addToGoogleCalendar = async (bookingId: string) => {
        setAddingToCalendar(bookingId);
        try {
            const res = await fetch(`http://localhost:5000/api/clinic/${bookingId}/add-to-calendar`, {
                method: 'POST',
            });
            const data = await res.json();

            if (data.success) {
                alert('Successfully added to Google Calendar!');
                fetchBookings();
            } else {
                alert(`Failed to add to calendar: ${data.message}`);
            }
        } catch (error) {
            console.error("Error adding to calendar:", error);
            alert('Error adding to calendar. Please try again.');
        } finally {
            setAddingToCalendar(null);
        }
    };

    const getWeekNumber = (date: Date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const getCurrentWeekOptions = () => {
        const options = [{ value: "all", label: "All Weeks" }];
        const now = new Date();
        const currentYear = now.getFullYear();

        for (let i = 1; i <= 52; i++) {
            options.push({ value: `${currentYear}-${i}`, label: `Week ${i}` });
        }

        return options;
    };

    const filterBookings = () => {
        let filtered = bookings;

        if (selectedMonth !== "all") {
            const monthNum = parseInt(selectedMonth);
            filtered = filtered.filter((booking) => {
                const bookingDate = new Date(booking.sessionDate);
                return bookingDate.getMonth() === monthNum;
            });
        }

        if (selectedWeek !== "all") {
            const [year, week] = selectedWeek.split("-").map(Number);
            filtered = filtered.filter((booking) => {
                const bookingDate = new Date(booking.sessionDate);
                const bookingYear = bookingDate.getFullYear();
                const bookingWeek = getWeekNumber(bookingDate);
                return bookingYear === year && bookingWeek === week;
            });
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (booking) =>
                    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.phone.includes(searchTerm) ||
                    booking.slot.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.sessionDate).getTime();
            const dateB = new Date(b.sessionDate).getTime();

            if (dateA === dateB) {
                return a.slot.localeCompare(b.slot);
            }

            return dateA - dateB;
        });

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
        inCalendar: bookings.filter(b => b.calendarEventId).length,
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
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <Calendar className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Startup Clinic Bookings
                        </h1>
                    </div>
                    <p className="text-muted-foreground">Manage and review clinic session bookings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Bookings</p>
                                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                            </div>
                            <Users className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Today's Bookings</p>
                                <p className="text-3xl font-bold text-foreground">{stats.today}</p>
                            </div>
                            <Clock className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Newsletter Subscribers</p>
                                <p className="text-3xl font-bold text-foreground">{stats.newsletter}</p>
                            </div>
                            <Bell className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">In Google Calendar</p>
                                <p className="text-3xl font-bold text-foreground">{stats.inCalendar}</p>
                            </div>
                            <Calendar className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="bg-card p-4 rounded-lg shadow-md mb-6 border border-border">
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or slot..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Filter by Month
                                </label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                >
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Filter by Week
                                </label>
                                <select
                                    value={selectedWeek}
                                    onChange={(e) => setSelectedWeek(e.target.value)}
                                    className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                >
                                    {getCurrentWeekOptions().map((week) => (
                                        <option key={week.value} value={week.value}>
                                            {week.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {(selectedMonth !== "all" || selectedWeek !== "all") && (
                            <button
                                onClick={() => {
                                    setSelectedMonth("all");
                                    setSelectedWeek("all");
                                }}
                                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-card p-12 rounded-lg shadow-md text-center border border-border">
                            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground text-lg">No bookings found</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground mb-1">
                                                    {booking.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Booked on {formatDate(booking.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground truncate">{booking.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{booking.phone}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-sm bg-primary/5 px-3 py-2 rounded-lg">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span className="text-primary font-medium">
                                                    {booking.sessionDate ? new Date(booking.sessionDate).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : 'Date not set'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm bg-primary/5 px-3 py-2 rounded-lg">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span className="text-primary font-medium">{booking.slot}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Confirmed
                                            </span>
                                            {booking.subscribeNewsletter && (
                                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                    <Bell className="w-3 h-3" /> Newsletter Subscribed
                                                </span>
                                            )}
                                            {booking.calendarEventId ? (
                                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> In Google Calendar
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> Not in Calendar
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 lg:items-end">
                                        <button
                                            onClick={() => setSelectedBooking(booking)}
                                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2"
                                        >
                                            <MessageSquare className="w-4 h-4" /> View Questions
                                        </button>
                                        {!booking.calendarEventId && (
                                            <button
                                                onClick={() => addToGoogleCalendar(booking._id)}
                                                disabled={addingToCalendar === booking._id}
                                                className="px-6 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {addingToCalendar === booking._id ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CalendarPlus className="w-4 h-4" /> Add to Calendar
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBooking(null)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-card rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border"
                    >
                        <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-foreground">Booking Details</h2>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="text-muted-foreground hover:text-foreground text-2xl font-bold transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Name</p>
                                        <p className="font-medium text-foreground">{selectedBooking.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium text-foreground">{selectedBooking.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium text-foreground">{selectedBooking.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Slot</p>
                                        <p className="font-medium text-foreground">{selectedBooking.slot}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">Booking Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Session Date</p>
                                        <p className="font-medium text-foreground">
                                            {selectedBooking.sessionDate ? new Date(selectedBooking.sessionDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Not set'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Time Slot</p>
                                        <p className="font-medium text-foreground">{selectedBooking.slot}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Booked At</p>
                                        <p className="font-medium text-foreground">{formatDate(selectedBooking.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Calendar Status</p>
                                        <p className="font-medium text-foreground">
                                            {selectedBooking.calendarEventId ? (
                                                <span className="text-primary inline-flex items-center gap-1">
                                                    <CheckCircle className="w-4 h-4" /> Added to Calendar
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground inline-flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" /> Not in Calendar
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">Questions Submitted</h3>
                                <div className="space-y-4">
                                    <div className="bg-muted p-4 rounded-lg">
                                        <p className="text-sm font-medium text-foreground mb-2">Question 1:</p>
                                        <p className="text-foreground">{selectedBooking.question1 || "No answer provided"}</p>
                                    </div>
                                    <div className="bg-muted p-4 rounded-lg">
                                        <p className="text-sm font-medium text-foreground mb-2">Question 2:</p>
                                        <p className="text-foreground">{selectedBooking.question2 || "No answer provided"}</p>
                                    </div>
                                    <div className="bg-muted p-4 rounded-lg">
                                        <p className="text-sm font-medium text-foreground mb-2">Question 3:</p>
                                        <p className="text-foreground">{selectedBooking.question3 || "No answer provided"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <a
                                    href={`mailto:${selectedBooking.email}`}
                                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center font-medium inline-flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-4 h-4" /> Send Email
                                </a>
                                <a
                                    href={`tel:${selectedBooking.phone}`}
                                    className="flex-1 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-center font-medium inline-flex items-center justify-center gap-2"
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