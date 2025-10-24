"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Play, Pause, Loader2, Send, Sprout, Link, ArrowLeft } from "lucide-react";

export default function SeedProgramApplication() {
    const [videoWatched, setVideoWatched] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [formData, setFormData] = useState({
        founderName: "",
        email: "",
        phone: "",
        startupName: "",
        description: "",
        stage: "",
        website: "",
    });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            if (video.currentTime / video.duration >= 0.9) {
                setVideoWatched(true);
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const whatsappMessage = encodeURIComponent(
            `🌱 New Seed Program Application\n\n` +
            `Founder: ${formData.founderName}\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone}\n` +
            `Startup: ${formData.startupName}\n` +
            `Stage: ${formData.stage}`
        );

        const cibaWhatsApp = "919876543210";
        window.open(`https://wa.me/${cibaWhatsApp}?text=${whatsappMessage}`, "_blank");

        setFormSubmitted(true);
        setIsSubmitting(false);
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-block mb-6"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <Sprout className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-5xl font-bold text-blue-900 mb-3">
                        Seed Program Application
                    </h1>
                    <p className="text-xl text-blue-600 font-semibold">
                        6 months | Early-stage startups
                    </p>
                </div>
                {/* <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold transition-all">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link> */}

                {/* Form Area */}
                <AnimatePresence mode="wait">
                    {!formSubmitted ? (
                        <motion.div
                            key="application"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Step 1: Video Section */}
                            <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-5">
                                    <h2 className="flex items-center gap-3 text-2xl font-semibold">
                                        <Play className="w-6 h-6" />
                                        Step 1: Watch Instructions (Required)
                                    </h2>
                                    <p className="text-blue-100 text-base">
                                        Please watch the entire video before proceeding to the
                                        application form.
                                    </p>
                                </div>
                                <div className="p-6">
                                    <div className="relative rounded-xl overflow-hidden bg-black">
                                        <video
                                            ref={videoRef}
                                            className="w-full aspect-video"
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                            src="/Screen Recording 2025-10-23 113537.mp4"
                                        />
                                        <button
                                            onClick={togglePlay}
                                            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition"
                                        >
                                            {!isPlaying && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl"
                                                >
                                                    <Play className="w-12 h-12 text-blue-600 ml-2" />
                                                </motion.div>
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex justify-between text-sm font-semibold text-blue-700 mb-2">
                                            <span>Progress: {Math.round(progress)}%</span>
                                            <span>
                                                {Math.floor(currentTime)}s / {Math.floor(duration)}s
                                            </span>
                                        </div>
                                        <div className="h-3 bg-blue-100 rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-600 to-blue-900"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>

                                        {videoWatched && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 flex items-center gap-2 text-green-600 font-semibold bg-green-50 p-3 rounded-lg"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                                Video completed! You can now fill the form.
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Form Section */}
                            <motion.div
                                initial={{ opacity: 0.3, filter: "blur(5px)" }}
                                animate={
                                    videoWatched
                                        ? { opacity: 1, filter: "blur(0px)" }
                                        : { opacity: 0.3, filter: "blur(5px)" }
                                }
                                transition={{ duration: 0.5 }}
                            >
                                <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition">
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-5">
                                        <h2 className="text-2xl font-semibold">
                                            Step 2: Application Form
                                        </h2>
                                        <p className="text-blue-100 text-base">
                                            {videoWatched
                                                ? "Fill in your startup details"
                                                : "Complete the video to unlock this form"}
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="p-8 space-y-6 text-blue-900"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="font-semibold">Founder Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    disabled={!videoWatched}
                                                    value={formData.founderName}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setFormData({
                                                            ...formData,
                                                            founderName: e.target.value,
                                                        })
                                                    }
                                                    className="mt-2 w-full border border-blue-200 rounded-lg p-3 focus:border-blue-600 outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="font-semibold">Email *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    disabled={!videoWatched}
                                                    value={formData.email}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setFormData({ ...formData, email: e.target.value })
                                                    }
                                                    className="mt-2 w-full border border-blue-200 rounded-lg p-3 focus:border-blue-600 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="font-semibold">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    disabled={!videoWatched}
                                                    value={formData.phone}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setFormData({ ...formData, phone: e.target.value })
                                                    }
                                                    className="mt-2 w-full border border-blue-200 rounded-lg p-3 focus:border-blue-600 outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="font-semibold">Startup Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    disabled={!videoWatched}
                                                    value={formData.startupName}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setFormData({
                                                            ...formData,
                                                            startupName: e.target.value,
                                                        })
                                                    }
                                                    className="mt-2 w-full border border-blue-200 rounded-lg p-3 focus:border-blue-600 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="font-semibold">Stage *</label>
                                            <input
                                                type="text"
                                                required
                                                disabled={!videoWatched}
                                                placeholder="e.g., Idea stage, MVP ready, Pre-revenue"
                                                value={formData.stage}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setFormData({ ...formData, stage: e.target.value })
                                                }
                                                className="mt-2 w-full border border-blue-200 rounded-lg p-3 focus:border-blue-600 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="font-semibold">Website (optional)</label>
                                            <input
                                                type="url"
                                                disabled={!videoWatched}
                                                value={formData.website}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setFormData({ ...formData, website: e.target.value })
                                                }
                                                className="mt-2 w-full border border-blue-200 rounded-lg p-3 focus:border-blue-600 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="font-semibold">
                                                Describe Your Startup *
                                            </label>
                                            <textarea
                                                required
                                                disabled={!videoWatched}
                                                rows={4}
                                                placeholder="Tell us about your startup, the problem you're solving, and your solution..."
                                                value={formData.description}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                    setFormData({
                                                        ...formData,
                                                        description: e.target.value,
                                                    })
                                                }
                                                className="mt-2 w-full border border-blue-200 rounded-lg p-3 focus:border-blue-600 outline-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!videoWatched || isSubmitting}
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-900 text-white font-bold py-4 text-lg rounded-lg shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 mr-2" /> Submit Application
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                            <div className="text-center p-12 bg-white border-2 border-green-500 rounded-xl shadow-2xl">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        delay: 0.2,
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 15,
                                    }}
                                    className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                                >
                                    <CheckCircle2 className="w-20 h-20 text-white" />
                                </motion.div>
                                <h2 className="text-4xl font-bold text-blue-900 mb-4">
                                    Application Submitted!
                                </h2>
                                <p className="text-lg text-blue-700 mb-6">
                                    Thank you for applying to the CIBA Seed Program. Our team will
                                    review your application and contact you soon.
                                </p>
                                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                                    <p className="text-blue-900 font-semibold">
                                        Confirmation email sent to{" "}
                                        <strong className="text-blue-600">{formData.email}</strong>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
