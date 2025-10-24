"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, X, MessageCircle, Sparkles } from "lucide-react"

interface Message {
    id: number
    text: string
    isBot: boolean
    timestamp: Date
}

const faqData = {
    "what is incubation center": "Our incubation center in Vashi, Navi Mumbai provides startups with world-class mentorship, funding opportunities, office space, and access to a thriving community of entrepreneurs. We help transform your ideas into successful businesses.",
    "how to apply": "You can start your application by clicking the 'Start Your Application' button on our homepage. The process includes submitting your startup idea, team details, and business plan. Our team reviews applications on a rolling basis.",
    "funding": "We help startups raise funding through our network of investors and VCs. Our portfolio startups have raised over ₹10Cr+ collectively. We also provide pitch training and investor introductions.",
    "programs": "We offer various programs including 3-month and 6-month incubation tracks, mentorship sessions, workshops on product development, marketing, fundraising, and legal compliance. We also organize demo days and networking events.",
    "mentors": "Our mentors include successful entrepreneurs, industry experts, and investors with expertise in tech startups, business strategy, product development, finance, marketing, and legal matters. You get personalized 1-on-1 mentorship sessions.",
    "location": "We are located in Vashi, Navi Mumbai, Maharashtra. Our state-of-the-art facility includes co-working spaces, meeting rooms, and event areas.",
    "fees": "We offer flexible pricing models. Contact us for detailed information about our programs and associated costs. We also have scholarship programs for promising startups.",
    "eligibility": "We accept early-stage startups across sectors including tech, fintech, healthtech, edtech, and more. Your startup should be scalable with a clear business model and passionate team.",
    "success rate": "We have a 95% growth rate among our incubated startups. Over 50+ active startups are part of our ecosystem, and many have successfully raised funding and scaled their operations.",
    "contact": "You can reach us by booking a free consultation through our website, or contact us directly. We're here to help you succeed!",
}

const quickQuestions = [
    "What is the incubation center?",
    "How do I apply?",
    "What programs do you offer?",
    "Tell me about mentors",
    "What's your success rate?",
]

export default function FAQChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi! 👋 I'm your virtual assistant. Ask me anything about our incubation center, programs, mentorship, or how to apply!",
            isBot: true,
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const findAnswer = (question: string): string => {
        const lowerQuestion = question.toLowerCase()

        for (const [key, answer] of Object.entries(faqData)) {
            if (lowerQuestion.includes(key)) {
                return answer
            }
        }

        return "I'm not sure about that specific question. Could you try asking about our programs, application process, mentorship, funding, or location? You can also book a free consultation to speak with our team directly!"
    }

    const handleSend = (text?: string) => {
        const messageText = text || inputValue.trim()
        if (!messageText) return

        const userMessage: Message = {
            id: Date.now(),
            text: messageText,
            isBot: false,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsTyping(true)

        setTimeout(() => {
            const botResponse: Message = {
                id: Date.now() + 1,
                text: findAnswer(messageText),
                isBot: true,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botResponse])
            setIsTyping(false)
        }, 1000)
    }

    const handleQuickQuestion = (question: string) => {
        handleSend(question)
    }

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 z-50 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-blue-500/50 group"
                    aria-label="Open chat"
                >
                    <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-4 right-4 z-50 w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-blue-100 animate-scale-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Bot className="w-6 h-6" />
                                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">FAQ Assistant</h3>
                                <p className="text-xs text-blue-100">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-blue-50/30 to-white">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                            >
                                {message.isBot && (
                                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-2xl px-3 py-2 ${message.isBot
                                            ? "bg-white border border-blue-100 text-gray-800 shadow-sm"
                                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                                        }`}
                                >
                                    <p className="text-xs leading-relaxed">{message.text}</p>
                                    <p className={`text-[10px] mt-1 ${message.isBot ? "text-gray-400" : "text-blue-100"}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                {!message.isBot && (
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-2 justify-start">
                                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white border border-blue-100 rounded-2xl px-3 py-2 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length === 1 && (
                        <div className="px-3 pb-2 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                <span className="font-semibold">Quick questions:</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickQuestion(question)}
                                        className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-full border border-blue-200 transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-blue-100">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Type your question..."
                                className="flex-1 px-3 py-2 border border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!inputValue.trim()}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
                                aria-label="Send message"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
        </>
    )
}