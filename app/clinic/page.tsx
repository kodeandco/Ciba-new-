"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Calendar, Send, Loader2, ChevronLeft, ChevronRight, XCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsapp";

interface FormData {
    name: string;
    email: string;
    phone: string;
    question1: string;
    question2: string;
    question3: string;

    slot: string;
    sessionDate: string;
}

const timeSlots = [
    "16:30 - 16:50",
    "16:50 - 17:10",
    "17:10 - 17:30",
    "17:30 - 17:50",
    "17:50 - 18:10",
];

export default function StartupClinicBooking() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        question1: "",
        question2: "",
        question3: "",

        slot: "",
        sessionDate: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
    const [displayMonth, setDisplayMonth] = useState("");
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [datesAvailability, setDatesAvailability] = useState<Record<string, { bookedCount: number; isFullyBooked: boolean }>>({});

    useEffect(() => {
        const dates: string[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() + currentMonthOffset);
        startDate.setDate(1);

        const monthName = startDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
        setDisplayMonth(monthName);

        let date = new Date(startDate);
        let count = 0;

        while (count < 16 && date.getMonth() <= startDate.getMonth() + 1) {
            const dayOfWeek = date.getDay();

            if (dayOfWeek === 2 || dayOfWeek === 4) {
                if (date >= today) {
                    dates.push(date.toISOString().split('T')[0]);
                    count++;
                }
            }

            date.setDate(date.getDate() + 1);
        }

        setAvailableDates(dates);

        // Fetch availability for all dates
        if (dates.length > 0) {
            checkDatesAvailability(dates);
        }
    }, [currentMonthOffset]);

    const checkDatesAvailability = async (dates: string[]) => {
        try {
            const res = await fetch("http://localhost:5000/api/clinic/dates-availability", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dates }),
            });
            const data = await res.json();
            if (data.success) {
                setDatesAvailability(data.availability);
            }
        } catch (error) {
            console.error("Error checking dates availability:", error);
        }
    };

    const checkSlotAvailability = async (date: string) => {
        setLoadingSlots(true);
        try {
            const res = await fetch(`http://localhost:5000/api/clinic/availability/${date}`);
            const data = await res.json();
            if (data.success) {
                setBookedSlots(data.bookedSlots);
            }
        } catch (error) {
            console.error("Error checking slot availability:", error);
            setBookedSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDateSelect = (date: string) => {
        setFormData({ ...formData, sessionDate: date, slot: "" });
        checkSlotAvailability(date);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            alert("Please fill all personal information fields.");
            return;
        }

        if (!formData.slot) {
            alert("Please select a time slot.");
            return;
        }

        if (!formData.sessionDate) {
            alert("Please select a session date.");
            return;
        }

        if (!formData.question1 || !formData.question2 || !formData.question3) {
            alert("Please answer all three questions.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("http://localhost:5000/api/clinic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Something went wrong");
                setIsSubmitting(false);
                return;
            }

            setFormSubmitted(true);

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to reach server.");
            setIsSubmitting(false);
        }
    };

    if (formSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-4">
                <div className="max-w-2xl w-full text-center p-12 border-2 border-blue-500 shadow-xl rounded-xl bg-white">
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-16 h-16 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Slot Booked Successfully!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Thank you <strong>{formData.name}</strong>!
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Session Date:</strong> {formatDate(formData.sessionDate)}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Time Slot:</strong> {formData.slot}
                        </p>
                    </div>
                    <p className="text-gray-600 mb-2">
                        Confirmation email sent to <strong>{formData.email}</strong>
                    </p>


                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                setFormSubmitted(false);
                                setFormData({
                                    name: "",
                                    email: "",
                                    phone: "",
                                    question1: "",
                                    question2: "",
                                    question3: "",

                                    slot: "",
                                    sessionDate: "",
                                });
                                setBookedSlots([]);
                            }}
                            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                            Book Another Slot
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
    const allSlotsBooked = formData.sessionDate && availableSlots.length === 0;

    return (

        <>

            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-block mb-4">

                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Startup Clinic Booking</h1>
                        <p className="text-gray-600">20-min sessions | Every Tuesday & Thursday from 4:30 PM</p>
                    </div>

                    <div className="bg-white border-2 rounded-xl shadow-xl p-8 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
                                Personal Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
                                Select Session Date *
                            </h3>
                            <div className="flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setCurrentMonthOffset(Math.max(0, currentMonthOffset - 1))}
                                    disabled={currentMonthOffset === 0}
                                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-base font-bold text-gray-800">
                                    {displayMonth}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentMonthOffset(currentMonthOffset + 1)}
                                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 transition-all shadow-sm"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {availableDates.map((date) => {
                                    const dateObj = new Date(date + 'T00:00:00');
                                    const isFullyBooked = datesAvailability[date]?.isFullyBooked || false;
                                    const bookedCount = datesAvailability[date]?.bookedCount || 0;

                                    return (
                                        <button
                                            type="button"
                                            key={date}
                                            onClick={() => !isFullyBooked && handleDateSelect(date)}
                                            disabled={isFullyBooked}
                                            className={`p-4 rounded-lg border-2 text-sm font-medium transition-all relative ${formData.sessionDate === date
                                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-700 shadow-lg scale-105"
                                                : isFullyBooked
                                                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                                }`}
                                        >
                                            {isFullyBooked && (
                                                <div className="absolute top-1 right-1">
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                </div>
                                            )}
                                            <div className="text-xs opacity-75 mb-1">
                                                {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </div>
                                            <div className="font-bold text-lg">
                                                {dateObj.getDate()}
                                            </div>
                                            <div className="text-xs opacity-75 mt-1">
                                                {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                                            </div>
                                            {bookedCount > 0 && !isFullyBooked && (
                                                <div className="text-xs mt-1 text-orange-600 font-medium">
                                                    {5 - bookedCount} left
                                                </div>
                                            )}
                                            {isFullyBooked && (
                                                <div className="text-xs mt-1 text-red-500 font-medium">
                                                    Full
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {availableDates.length === 0 && (
                                <p className="text-center text-gray-500 py-4">No available dates in this period</p>
                            )}
                            {formData.sessionDate && (
                                <p className="text-sm text-green-600 flex items-center gap-1 bg-green-50 p-3 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Selected: {formatDate(formData.sessionDate)}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2 flex-1">
                                    Select Time Slot *
                                </h3>
                                {formData.sessionDate && loadingSlots && (
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                )}
                            </div>

                            {!formData.sessionDate ? (
                                <div className="bg-blue-50 p-6 rounded-lg text-center">
                                    <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Please select a date first to see available time slots</p>
                                </div>
                            ) : allSlotsBooked ? (
                                <div className="bg-red-50 p-6 rounded-lg text-center border-2 border-red-200">
                                    <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                                    <p className="text-lg font-semibold text-gray-900 mb-1">All Slots Booked</p>
                                    <p className="text-sm text-gray-600">Please select a different date</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {timeSlots.map((s) => {
                                            const isBooked = bookedSlots.includes(s);
                                            return (
                                                <button
                                                    type="button"
                                                    key={s}
                                                    onClick={() => !isBooked && setFormData({ ...formData, slot: s })}
                                                    disabled={isBooked}
                                                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all relative ${formData.slot === s
                                                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-700 shadow-md scale-105"
                                                        : isBooked
                                                            ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
                                                            : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                                                        }`}
                                                >
                                                    {isBooked && (
                                                        <div className="absolute top-1 right-1">
                                                            <XCircle className="w-3 h-3 text-red-500" />
                                                        </div>
                                                    )}
                                                    {s}
                                                    {isBooked && (
                                                        <div className="text-xs text-red-500 mt-1">Booked</div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {availableSlots.length > 0 && (
                                        <p className="text-xs text-gray-500 text-center">
                                            {availableSlots.length} of {timeSlots.length} slots available
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
                                Questions for Mentor *
                            </h3>
                            <input
                                type="text"
                                placeholder="Question 1"
                                value={formData.question1}
                                onChange={(e) => setFormData({ ...formData, question1: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                            />
                            <input
                                type="text"
                                placeholder="Question 2"
                                value={formData.question2}
                                onChange={(e) => setFormData({ ...formData, question2: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                            />
                            <input
                                type="text"
                                placeholder="Question 3"
                                value={formData.question3}
                                onChange={(e) => setFormData({ ...formData, question3: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                            />
                        </div>



                        <div className="text-center pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto transition-all hover:scale-105 shadow-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Booking...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" /> Confirm Booking
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-500 mt-3">
                                You'll receive a confirmation email and calendar invite
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <FloatingWhatsApp />
        </>
    );
}