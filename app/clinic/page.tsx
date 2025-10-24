"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Send, Loader2 } from "lucide-react";

interface FormData {
    name: string;
    email: string;
    phone: string;
    question1: string;
    question2: string;
    question3: string;
    subscribeNewsletter: boolean;
    slot: string;
}

const slots = [
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
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.slot) {
            alert("Please select a slot.");
            return;
        }
        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const whatsappMessage = encodeURIComponent(
            `📅 Startup Clinic Booking\n\n` +
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone}\n` +
            `Slot: ${formData.slot}\n` +
            `Questions:\n1. ${formData.question1}\n2. ${formData.question2}\n3. ${formData.question3}\n` +
            `Subscribe Newsletter: ${formData.subscribeNewsletter ? "Yes" : "No"}`
        );

        const cibaWhatsApp = "919876543210";
        window.open(`https://wa.me/${cibaWhatsApp}?text=${whatsappMessage}`, "_blank");

        setFormSubmitted(true);
        setIsSubmitting(false);
    };

    if (formSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="max-w-2xl w-full text-center p-12 border-2 border-blue-500 shadow-xl rounded-xl bg-white"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="w-16 h-16 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Slot Booked Successfully!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Thank you {formData.name}. Your session is confirmed for <strong>{formData.slot}</strong>.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setFormSubmitted(false)}
                            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                            Book Another Slot
                        </button>
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="px-6 py-3 rounded-lg text-blue-700 font-medium bg-blue-100 hover:bg-blue-200"
                        >
                            Back to Website
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-block mb-4"
                    >
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <Calendar className="w-10 h-10 text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Startup Clinic Booking</h1>
                    <p className="text-gray-600">20-min sessions | Every Tuesday & Thursday from 4:30 PM</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border-2 rounded-xl shadow-xl p-8 space-y-6"
                >
                    {/* User Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 w-full border rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 w-full border rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="mt-1 w-full border rounded-md p-2"
                            />
                        </div>
                    </div>

                    {/* Slots as bubbles */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Select Slot *</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {slots.map((s) => (
                                <button
                                    type="button"
                                    key={s}
                                    onClick={() => setFormData({ ...formData, slot: s })}
                                    className={`px-4 py-2 rounded-full border transition-all ${formData.slot === s
                                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-700"
                                            : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Questions for Mentor *</label>
                        <input
                            type="text"
                            required
                            placeholder="Question 1"
                            value={formData.question1}
                            onChange={(e) => setFormData({ ...formData, question1: e.target.value })}
                            className="mt-1 w-full border rounded-md p-2"
                        />
                        <input
                            type="text"
                            required
                            placeholder="Question 2"
                            value={formData.question2}
                            onChange={(e) => setFormData({ ...formData, question2: e.target.value })}
                            className="mt-1 w-full border rounded-md p-2"
                        />
                        <input
                            type="text"
                            required
                            placeholder="Question 3"
                            value={formData.question3}
                            onChange={(e) => setFormData({ ...formData, question3: e.target.value })}
                            className="mt-1 w-full border rounded-md p-2"
                        />
                    </div>

                    {/* Newsletter */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.subscribeNewsletter}
                            onChange={(e) => setFormData({ ...formData, subscribeNewsletter: e.target.checked })}
                            id="newsletter"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="newsletter" className="text-sm text-gray-700">Subscribe to CIBA Newsletter</label>
                    </div>

                    {/* Submit */}
                    <div className="text-center pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center justify-center mx-auto"
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
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
