"use client"

import { useEffect, useState } from "react"
import { X, Mail, FileText, ArrowLeft, Calendar } from "lucide-react"
import PDFViewer from "@/components/PDFViewer"
import FloatingWhatsApp from "@/components/FloatingWhatsapp"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"

type Newsletter = {
    _id: string
    title: string
    description: string
    newsletterDate: string
}

export default function AllNewsletters() {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([])
    const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
    const [showPDFViewer, setShowPDFViewer] = useState(false)
    const [pdfNewsletter, setPdfNewsletter] = useState<Newsletter | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAllNewsletters = async () => {
            try {
                const res = await fetch(`${API_URL}/api/newsletter/all`, {
                    cache: "no-store",
                })
                const data = await res.json()
                // Ensure data is an array
                setNewsletters(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Failed to fetch newsletters", error)
                setNewsletters([]) // Set empty array on error
            } finally {
                setLoading(false)
            }
        }

        fetchAllNewsletters()
    }, [])

    const handleReadNewsletter = (e: React.MouseEvent, newsletter: Newsletter) => {
        e.stopPropagation()
        if (!newsletter._id) return
        setPdfNewsletter(newsletter)
        setShowPDFViewer(true)
    }

    // Group newsletters by year - with safety check
    const newslettersByYear = Array.isArray(newsletters)
        ? newsletters.reduce((acc, newsletter) => {
            const year = new Date(newsletter.newsletterDate).getFullYear()
            if (!acc[year]) {
                acc[year] = []
            }
            acc[year].push(newsletter)
            return acc
        }, {} as Record<number, Newsletter[]>)
        : {}

    const years = Object.keys(newslettersByYear)
        .map(Number)
        .sort((a, b) => b - a)

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all"
                            >
                                <ArrowLeft size={24} className="text-blue-600 dark:text-blue-400" />
                            </button>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                                    Newsletter Archive
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Browse all past editions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                            <p className="text-muted-foreground mt-4">Loading newsletters...</p>
                        </div>
                    ) : newsletters.length === 0 ? (
                        <div className="text-center py-20">
                            <Mail className="w-16 h-16 text-blue-300 dark:text-blue-700 mx-auto mb-4" />
                            <p className="text-xl text-muted-foreground">No newsletters found.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {years.map((year) => (
                                <div key={year} className="animate-fade-in">
                                    {/* Year Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xl">
                                            {year}
                                        </div>
                                        <div className="flex-1 h-px bg-blue-200 dark:bg-blue-900"></div>
                                        <span className="text-sm text-muted-foreground">
                                            {newslettersByYear[year].length} newsletter{newslettersByYear[year].length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {/* Newsletters Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {newslettersByYear[year].map((newsletter, index) => (
                                            <div
                                                key={newsletter._id}
                                                className="glass-effect rounded-xl p-6 hover-lift cursor-pointer group border border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all animate-scale-in"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                                onClick={() => setSelectedNewsletter(newsletter)}
                                            >
                                                {/* Icon Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-all">
                                                        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <button
                                                        className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                        onClick={(e) => handleReadNewsletter(e, newsletter)}
                                                    >
                                                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </button>
                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold mb-3">
                                                    <Calendar size={14} />
                                                    {new Date(newsletter.newsletterDate).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "long",
                                                    })}
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all line-clamp-2">
                                                    {newsletter.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-sm text-muted-foreground line-clamp-3">
                                                    {newsletter.description}
                                                </p>

                                                {/* Read More Link */}
                                                <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900">
                                                    <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                                                        Read More
                                                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* PDF Viewer Modal */}
            {showPDFViewer && pdfNewsletter && (
                <PDFViewer
                    newsletterId={pdfNewsletter._id}
                    title={pdfNewsletter.title}
                    onClose={() => {
                        setShowPDFViewer(false)
                        setPdfNewsletter(null)
                    }}
                />
            )}

            {/* Newsletter Detail Modal */}
            {selectedNewsletter && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedNewsletter(null)}
                >
                    <div
                        className="bg-background rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in border border-blue-200 dark:border-blue-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-background border-b border-blue-200 dark:border-blue-800 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">
                                    {new Date(selectedNewsletter.newsletterDate).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {selectedNewsletter.title}
                                </h2>
                            </div>

                            <button
                                onClick={() => setSelectedNewsletter(null)}
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                                {selectedNewsletter.description}
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-blue-200 dark:border-blue-800 p-6 flex gap-4">
                            <button
                                onClick={() => setSelectedNewsletter(null)}
                                className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                            >
                                Close
                            </button>

                            <button
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
                                onClick={(e) => handleReadNewsletter(e, selectedNewsletter)}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <FileText size={18} />
                                    Open Newsletter PDF
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FloatingWhatsApp />
        </>
    )
}