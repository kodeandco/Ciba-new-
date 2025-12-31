"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Rocket,
    Users,
    Video,
    ExternalLink,
    Award,
    Calendar,
    TrendingUp,
    CheckCircle,
    Play,
    Building2,
    Lock,
    Check,
    Mail,
    Phone,
    Linkedin
} from "lucide-react";

interface Startup {
    name: string;
    founder: string;
    description: string;
    funding: string;
    year: string;
    stage: string;
}

interface VideoItem {
    id: number;
    title: string;
    duration: string;
    thumbnail: string;
    description: string;
    videoUrl: string;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
    bio: string;
    email: string;
    phone: string;
    linkedin: string;
}

const fundedStartups: Startup[] = [
    {
        name: "TechVenture AI",
        founder: "Rahul Sharma",
        description: "AI-powered supply chain optimization platform",
        funding: "₹20 Lakhs",
        year: "2024",
        stage: "Seed"
    },
    {
        name: "HealthSync",
        founder: "Priya Patel",
        description: "Telemedicine platform connecting rural healthcare",
        funding: "₹20 Lakhs",
        year: "2024",
        stage: "Seed"
    },
    {
        name: "EduTech Solutions",
        founder: "Amit Kumar",
        description: "Personalized learning platform using ML",
        funding: "₹20 Lakhs",
        year: "2023",
        stage: "Seed"
    },
    {
        name: "GreenEnergy Co",
        founder: "Sneha Reddy",
        description: "Solar energy solutions for urban households",
        funding: "₹20 Lakhs",
        year: "2023",
        stage: "Seed"
    }
];

const videoLibrary: VideoItem[] = [
    {
        id: 1,
        title: "Introduction to NIDHI SSP",
        duration: "8:45",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        description: "Overview of the NIDHI Seed Support Program and eligibility criteria",
        videoUrl: "/videos/nidhi-intro.mp4"
    },
    {
        id: 2,
        title: "Application Process Guide",
        duration: "12:30",
        thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
        description: "Step-by-step guide to completing your NIDHI SSP application",
        videoUrl: "/videos/application-guide.mp4"
    },
    {
        id: 3,
        title: "Success Stories",
        duration: "15:20",
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        description: "Hear from founders who successfully raised funding through NIDHI SSP",
        videoUrl: "/videos/success-stories.mp4"
    },
    {
        id: 4,
        title: "Pitch Preparation Tips",
        duration: "10:15",
        thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
        description: "Expert tips on preparing your pitch deck and presentation",
        videoUrl: "/videos/pitch-tips.mp4"
    }
];

const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        role: "Program Director",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
        bio: "Leading innovation in student entrepreneurship with 15+ years of experience",
        email: "rajesh.kumar@ciba.in",
        phone: "+91 98765 43210",
        linkedin: "https://linkedin.com/in/rajeshkumar"
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Mentorship Coordinator",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
        bio: "Connecting startups with industry experts and mentors",
        email: "priya.sharma@ciba.in",
        phone: "+91 98765 43211",
        linkedin: "https://linkedin.com/in/priyasharma"
    },
    {
        id: 3,
        name: "Amit Patel",
        role: "Technology Advisor",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        bio: "Helping startups build scalable technology solutions",
        email: "amit.patel@ciba.in",
        phone: "+91 98765 43212",
        linkedin: "https://linkedin.com/in/amitpatel"
    },
    {
        id: 4,
        name: "Sneha Reddy",
        role: "Finance & Operations Head",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        bio: "Managing funding disbursement and operational excellence",
        email: "sneha.reddy@ciba.in",
        phone: "+91 98765 43213",
        linkedin: "https://linkedin.com/in/snehareddy"
    },
    {
        id: 5,
        name: "Vikram Singh",
        role: "Marketing & Outreach Lead",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        bio: "Building awareness and community engagement for NIDHI SSP",
        email: "vikram.singh@ciba.in",
        phone: "+91 98765 43214",
        linkedin: "https://linkedin.com/in/vikramsingh"
    },
    {
        id: 6,
        name: "Ananya Gupta",
        role: "Legal & Compliance Advisor",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
        bio: "Ensuring regulatory compliance and legal support for startups",
        email: "ananya.gupta@ciba.in",
        phone: "+91 98765 43215",
        linkedin: "https://linkedin.com/in/ananyagupta"
    }
];

export default function NidhiSSPPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "funded" | "videos" | "team">("overview");
    const [watchedVideos, setWatchedVideos] = useState<number[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
    const [videoProgress, setVideoProgress] = useState<{ [key: number]: number }>({});

    const allVideosWatched = watchedVideos.length === videoLibrary.length;

    const handleVideoEnd = (videoId: number) => {
        if (!watchedVideos.includes(videoId)) {
            setWatchedVideos([...watchedVideos, videoId]);
        }
    };

    const handleVideoTimeUpdate = (videoId: number, currentTime: number, duration: number) => {
        const progress = (currentTime / duration) * 100;
        setVideoProgress(prev => ({ ...prev, [videoId]: progress }));

        if (progress >= 95 && !watchedVideos.includes(videoId)) {
            setWatchedVideos([...watchedVideos, videoId]);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-block mb-6"
                    >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                            <Rocket className="w-12 h-12 text-blue-600" />
                        </div>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        NIDHI Seed Support Program
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-blue-100">
                        Empowering Student Innovators & Early-Stage Startups
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-base md:text-lg">
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            <span>Up to ₹20 Lakhs Funding</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>6 Months Duration</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <span>Mentorship & Support</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b-2 border-blue-200 shadow-md">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-center gap-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`px-4 md:px-6 py-3 md:py-4 font-semibold transition-all text-sm md:text-base whitespace-nowrap ${activeTab === "overview"
                                ? "text-blue-600 border-b-4 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                                <span>Overview</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("funded")}
                            className={`px-4 md:px-6 py-3 md:py-4 font-semibold transition-all text-sm md:text-base whitespace-nowrap ${activeTab === "funded"
                                ? "text-blue-600 border-b-4 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                                <span>Funded</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("videos")}
                            className={`px-4 md:px-6 py-3 md:py-4 font-semibold transition-all text-sm md:text-base relative whitespace-nowrap ${activeTab === "videos"
                                ? "text-blue-600 border-b-4 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Video className="w-4 h-4 md:w-5 md:h-5" />
                                <span>Videos</span>
                                {!allVideosWatched && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("team")}
                            className={`px-4 md:px-6 py-3 md:py-4 font-semibold transition-all text-sm md:text-base whitespace-nowrap ${activeTab === "team"
                                ? "text-blue-600 border-b-4 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 md:w-5 md:h-5" />
                                <span>Team</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6 md:space-y-8"
                    >
                        {!allVideosWatched && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 md:p-6"
                            >
                                <div className="flex items-start gap-3">
                                    <Video className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-yellow-900 mb-1">Required: Watch All Videos First</h3>
                                        <p className="text-yellow-800 text-sm md:text-base">
                                            You must watch all {videoLibrary.length} videos in the Video Library section before you can apply. Progress: {watchedVideos.length}/{videoLibrary.length} videos completed.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-blue-200">
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4 md:mb-6">
                                About NIDHI SSP
                            </h2>
                            <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
                                The NIDHI Seed Support Program (SSP) is a flagship initiative by the Department of Science and Technology (DST), Government of India, designed to provide financial and mentorship support to student innovators and early-stage startups.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                                <div className="bg-blue-50 p-4 md:p-6 rounded-lg border-2 border-blue-200">
                                    <h3 className="font-bold text-lg md:text-xl text-blue-900 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                        Eligibility
                                    </h3>
                                    <ul className="space-y-2 text-sm md:text-base text-gray-700">
                                        <li>• Student innovators from recognized institutions</li>
                                        <li>• Early-stage startups (incorporated or not)</li>
                                        <li>• Technology-driven innovative ideas</li>
                                        <li>• Prototype or proof of concept stage</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 p-4 md:p-6 rounded-lg border-2 border-blue-200">
                                    <h3 className="font-bold text-lg md:text-xl text-blue-900 mb-3 flex items-center gap-2">
                                        <Award className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                        What You Get
                                    </h3>
                                    <ul className="space-y-2 text-sm md:text-base text-gray-700">
                                        <li>• Up to ₹20 Lakhs seed funding</li>
                                        <li>• Expert mentorship & guidance</li>
                                        <li>• Access to CIBA ecosystem</li>
                                        <li>• Networking opportunities</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="text-center">
                                <a
                                    href={allVideosWatched ? "https://tripetto.app/run/2AIHZRI343" : "#"}
                                    target={allVideosWatched ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                        if (!allVideosWatched) {
                                            e.preventDefault();
                                            setActiveTab("videos");
                                            alert("Please watch all videos in the Video Library section before applying.");
                                        }
                                    }}
                                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-bold shadow-xl transition-all ${allVideosWatched
                                        ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:scale-105 hover:shadow-2xl"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {allVideosWatched ? (
                                        <>
                                            <ExternalLink className="w-6 h-6" />
                                            Apply Now for NIDHI SSP
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-6 h-6" />
                                            Watch Videos to Unlock Application
                                        </>
                                    )}
                                </a>
                                {allVideosWatched && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-green-600 font-semibold mt-3 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        All videos completed! You can now apply.
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Funded Startups Tab */}
                {activeTab === "funded" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
                                Funded Startups
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg">
                                Meet the innovative startups that received NIDHI SSP funding through CIBA
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                            {fundedStartups.map((startup, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                                            <Building2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        </div>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                                            {startup.year}
                                        </span>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
                                        {startup.name}
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-600 mb-1">
                                        <span className="font-semibold">Founder:</span> {startup.founder}
                                    </p>
                                    <p className="text-sm md:text-base text-gray-700 mb-4">
                                        {startup.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t-2 border-blue-100">
                                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm md:text-base">
                                            <Award className="w-4 h-4 md:w-5 md:h-5" />
                                            {startup.funding}
                                        </div>
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                                            {startup.stage}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Video Library Tab */}
                {activeTab === "videos" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
                                Video Library - Required Viewing
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg mb-4">
                                Watch all videos to unlock the application form
                            </p>
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{watchedVideos.length}/{videoLibrary.length}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-900">Progress</p>
                                        <p className="text-sm text-blue-700">Videos completed</p>
                                    </div>
                                </div>
                                {allVideosWatched && (
                                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                                        <CheckCircle className="w-6 h-6" />
                                        <span className="hidden sm:inline">All Complete!</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                            {videoLibrary.map((video, index) => {
                                const isWatched = watchedVideos.includes(video.id);
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all"
                                    >
                                        <div
                                            className="relative h-40 md:h-48 bg-gray-200 cursor-pointer group"
                                            onClick={() => setSelectedVideo(video.id)}
                                        >
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <Play className="w-6 h-6 md:w-8 md:h-8 text-blue-600 ml-1" />
                                                </motion.div>
                                            </div>
                                            <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-black bg-opacity-70 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                                                {video.duration}
                                            </div>
                                            {isWatched && (
                                                <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-green-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1">
                                                    <Check className="w-3 h-3 md:w-4 md:h-4" />
                                                    Watched
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 md:p-6">
                                            <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-2">
                                                {video.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-gray-600 mb-4">
                                                {video.description}
                                            </p>
                                            <button
                                                onClick={() => setSelectedVideo(video.id)}
                                                className={`w-full py-2 rounded-lg font-semibold transition-all ${isWatched
                                                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                                    }`}
                                            >
                                                {isWatched ? "Watch Again" : "Watch Video"}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Team Tab */}
                {activeTab === "team" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
                                Our NIDHI SSP Team
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg">
                                Meet the dedicated professionals supporting your startup journey
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all"
                                >
                                    <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white mb-1">
                                                {member.name}
                                            </h3>
                                            <p className="text-blue-100 text-sm font-semibold">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                                            {member.bio}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Mail className="w-4 h-4 text-blue-600" />
                                                <a href={`mailto:${member.email}`} className="hover:text-blue-600 transition-colors">
                                                    {member.email}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Phone className="w-4 h-4 text-blue-600" />
                                                <a href={`tel:${member.phone}`} className="hover:text-blue-600 transition-colors">
                                                    {member.phone}
                                                </a>
                                            </div>
                                        </div>

                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                            Connect on LinkedIn
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl overflow-hidden max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {videoLibrary.find(v => v.id === selectedVideo)?.title}
                                    </h3>
                                    <p className="text-sm text-blue-100">Watch the full video to mark as complete</p>
                                </div>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="text-white hover:bg-blue-700 p-2 rounded-lg transition-all"
                                    title="Close video"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="aspect-video bg-black">
                                <video
                                    src={videoLibrary.find(v => v.id === selectedVideo)?.videoUrl}
                                    className="w-full h-full"
                                    controls
                                    controlsList="nodownload"
                                    onEnded={() => handleVideoEnd(selectedVideo)}
                                    onTimeUpdate={(e) => {
                                        const video = e.currentTarget;
                                        handleVideoTimeUpdate(selectedVideo, video.currentTime, video.duration);
                                    }}
                                    autoPlay
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="p-4 bg-blue-50">
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                                        <span>Progress</span>
                                        <span>{Math.round(videoProgress[selectedVideo] || 0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${videoProgress[selectedVideo] || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {watchedVideos.includes(selectedVideo) ? (
                                    <button
                                        onClick={() => setSelectedVideo(null)}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Video Complete - Close
                                    </button>
                                ) : (
                                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-center">
                                        <p className="text-yellow-800 text-sm font-semibold">
                                            ⏳ Watch at least 95% of the video to mark it as complete
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}