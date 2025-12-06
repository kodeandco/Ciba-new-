"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Calendar, Send, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface FormData {
    name: string;
    email: string;
    phone: string;
    question1: string;
    question2: string;
    question3: string;
    subscribeNewsletter: boolean;
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
        subscribeNewsletter: false,
        slot: "",
        sessionDate: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

    // Generate next 8 Tuesdays and Thursdays
    useEffect(() => {
        const dates: string[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Add month offset
        const startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() + currentMonthOffset);
        startDate.setDate(1);

        let date = new Date(startDate);
        let count = 0;

        // Generate dates for 2 months from the offset month
        while (count < 16) {
            const dayOfWeek = date.getDay();


            if (dayOfWeek === 3 || dayOfWeek === 5) {
                // Only include if it's today or future
                if (date >= today) {
                    dates.push(date.toISOString().split('T')[0]);
                    count++;
                }
            }

            date.setDate(date.getDate() + 1);
        }

        setAvailableDates(dates);
    }, [currentMonthOffset]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.slot) {
            alert("Please select a time slot.");
            return;
        }

        if (!formData.sessionDate) {
            alert("Please select a session date.");
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
                    <p className="text-gray-600 mb-6">
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
                                    subscribeNewsletter: false,
                                    slot: "",
                                    sessionDate: "",
                                });
                            }}
                            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                            Book Another Slot
                        </button>
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="px-6 py-3 rounded-lg text-blue-700 font-medium bg-blue-100 hover:bg-blue-200 transition-all"
                        >
                            Back to Website
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-block mb-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <Calendar className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Startup Clinic Booking</h1>
                    <p className="text-gray-600">20-min sessions | Every Tuesday & Thursday from 4:30 PM</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border-2 rounded-xl shadow-xl p-8 space-y-6"
                >
                    {/* User Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
                            Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
                            Select Session Date *
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                onClick={() => setCurrentMonthOffset(Math.max(0, currentMonthOffset - 1))}
                                disabled={currentMonthOffset === 0}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                                {currentMonthOffset === 0 ? "This Month" : `+${currentMonthOffset} Month${currentMonthOffset > 1 ? 's' : ''}`}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentMonthOffset(currentMonthOffset + 1)}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {availableDates.map((date) => (
                                <button
                                    type="button"
                                    key={date}
                                    onClick={() => setFormData({ ...formData, sessionDate: date })}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${formData.sessionDate === date
                                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-700 shadow-md"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                        }`}
                                >
                                    <div className="text-xs opacity-75 mb-1">
                                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className="font-bold">
                                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </button>
                            ))}
                        </div>
                        {formData.sessionDate && (
                            <p className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Selected: {formatDate(formData.sessionDate)}
                            </p>
                        )}
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
                            Select Time Slot *
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {timeSlots.map((s) => (
                                <button
                                    type="button"
                                    key={s}
                                    onClick={() => setFormData({ ...formData, slot: s })}
                                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.slot === s
                                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-700 shadow-md"
                                        : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
                            Questions for Mentor *
                        </h3>
                        <input
                            type="text"
                            required
                            placeholder="Question 1"
                            value={formData.question1}
                            onChange={(e) => setFormData({ ...formData, question1: e.target.value })}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="text"
                            required
                            placeholder="Question 2"
                            value={formData.question2}
                            onChange={(e) => setFormData({ ...formData, question2: e.target.value })}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="text"
                            required
                            placeholder="Question 3"
                            value={formData.question3}
                            onChange={(e) => setFormData({ ...formData, question3: e.target.value })}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Newsletter */}
                    <div className="flex items-center gap-2 pt-4">
                        <input
                            type="checkbox"
                            checked={formData.subscribeNewsletter}
                            onChange={(e) => setFormData({ ...formData, subscribeNewsletter: e.target.checked })}
                            id="newsletter"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="newsletter" className="text-sm text-gray-700">
                            Subscribe to CIBA Newsletter for startup resources and updates
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="text-center pt-6">
                        <button
                            type="submit"
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
                            You'll receive a confirmation email after booking
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}