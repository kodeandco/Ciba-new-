// "use client"

// import { useEffect, useRef, useState } from "react"
// import { ArrowRight, Zap, CheckCircle } from "lucide-react"

// interface Startup {
//   _id: string
//   companyName: string
//   tagline: string
//   careerUrl: string
//   hasImage?: boolean
//   createdAt?: string
// }

// const BACKEND_URL = "http://localhost:5000"

// export default function StartupCards() {
//   const [incubatedStartups, setIncubatedStartups] = useState<Startup[]>([])
//   const [graduatedStartups, setGraduatedStartups] = useState<Startup[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [visibleCards, setVisibleCards] = useState<number[]>([])
//   const sectionRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const fetchStartups = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const [incubatedRes, graduatedRes] = await Promise.all([
//           fetch(`${BACKEND_URL}/api/admin/incubated-startups`),
//           fetch(`${BACKEND_URL}/api/admin/graduated-startups`),
//         ])

//         if (!incubatedRes.ok || !graduatedRes.ok) {
//           throw new Error("Failed to fetch startups")
//         }

//         const incubatedData = await incubatedRes.json()
//         const graduatedData = await graduatedRes.json()

//         setIncubatedStartups(Array.isArray(incubatedData.startups) ? incubatedData.startups : [])
//         setGraduatedStartups(Array.isArray(graduatedData.startups) ? graduatedData.startups : [])
//       } catch (err) {
//         console.error("❌ Startup fetch failed:", err)
//         setError("Failed to load startups. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStartups()
//   }, [])

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const cardIndex = Number.parseInt(entry.target.getAttribute("data-index") || "0")
//             setVisibleCards((prev) => [...new Set([...prev, cardIndex])])
//           }
//         })
//       },
//       { threshold: 0.1 },
//     )

//     const cards = sectionRef.current?.querySelectorAll("[data-index]")
//     cards?.forEach((card) => observer.observe(card))

//     return () => observer.disconnect()
//   }, [incubatedStartups, graduatedStartups])

//   if (loading) {
//     return (
//       <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
//         <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
//         <p className="mt-4 text-gray-600">Loading startups...</p>
//       </section>
//     )
//   }

//   if (error) {
//     return (
//       <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
//         <p className="text-red-600">{error}</p>
//       </section>
//     )
//   }

//   const allStartups = [...incubatedStartups, ...graduatedStartups]

//   if (allStartups.length === 0) {
//     return (
//       <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
//         <p className="text-gray-600">No startups listed yet.</p>
//       </section>
//     )
//   }

//   return (
//     <section id="startups" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={sectionRef}>
//       <div className="text-center mb-16 animate-slide-up">
//         <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Startup Ecosystem</h2>
//         <p className="text-lg text-muted-foreground">
//           Discover the innovative startups we're incubating and the success stories of our graduated companies
//         </p>
//       </div>

//       {/* Currently Incubating Startups */}
//       {incubatedStartups.length > 0 && (
//         <div className="mb-20">
//           <div className="flex items-center gap-3 mb-8">
//             <Zap className="w-6 h-6 text-blue-600" />
//             <h3 className="text-2xl font-bold text-blue-900">Currently Incubating</h3>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {incubatedStartups.map((startup, index) => (
//               <div
//                 key={startup._id}
//                 data-index={index}
//                 className={`group relative overflow-hidden rounded-xl transition-all duration-700 ${visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
//                   }`}
//                 style={{ transitionDelay: `${index * 100}ms` }}
//               >
//                 {/* Card Background */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                 {/* Card Content */}
//                 <div className="relative bg-white border border-gray-200 p-6 h-full flex flex-col justify-between group-hover:shadow-xl transition-shadow">
//                   <div>
//                     {startup.hasImage ? (
//                       <img
//                         src={`${BACKEND_URL}/api/admin/incubated-startups/${startup._id}/image`}
//                         alt={startup.companyName}
//                         className="w-12 h-12 rounded-lg object-cover mb-4"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
//                         <Zap className="w-6 h-6 text-blue-600" />
//                       </div>
//                     )}
//                     <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
//                       Incubating
//                     </span>
//                     <h3 className="text-xl font-bold text-foreground mb-2">{startup.companyName}</h3>
//                     <p className="text-sm text-muted-foreground leading-relaxed">{startup.tagline}</p>
//                   </div>

//                   <button
//                     onClick={() => window.open(startup.careerUrl, "_blank", "noopener,noreferrer")}
//                     className="mt-4 flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all hover:text-blue-700"
//                   >
//                     View Opportunities
//                     <ArrowRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Graduated Startups */}
//       {graduatedStartups.length > 0 && (
//         <div className="mb-12">
//           <div className="flex items-center gap-3 mb-8">
//             <CheckCircle className="w-6 h-6 text-green-600" />
//             <h3 className="text-2xl font-bold text-blue-900">Graduated Success Stories</h3>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {graduatedStartups.map((startup, index) => {
//               const adjustedIndex = index + incubatedStartups.length
//               return (
//                 <div
//                   key={startup._id}
//                   data-index={adjustedIndex}
//                   className={`group relative overflow-hidden rounded-xl transition-all duration-700 ${visibleCards.includes(adjustedIndex) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
//                     }`}
//                   style={{ transitionDelay: `${index * 100}ms` }}
//                 >
//                   {/* Card Background */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                   {/* Card Content */}
//                   <div className="relative bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 p-6 h-full flex flex-col justify-between group-hover:shadow-xl transition-shadow">
//                     <div>
//                       {startup.hasImage ? (
//                         <img
//                           src={`${BACKEND_URL}/api/admin/graduated-startups/${startup._id}/image`}
//                           alt={startup.companyName}
//                           className="w-12 h-12 rounded-lg object-cover mb-4"
//                         />
//                       ) : (
//                         <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
//                           <CheckCircle className="w-6 h-6 text-green-600" />
//                         </div>
//                       )}
//                       <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-3">
//                         Graduated
//                       </span>
//                       <h3 className="text-xl font-bold text-foreground mb-2">{startup.companyName}</h3>
//                       <p className="text-sm text-muted-foreground leading-relaxed">{startup.tagline}</p>
//                     </div>

//                     <button
//                       onClick={() => window.open(startup.careerUrl, "_blank", "noopener,noreferrer")}
//                       className="mt-4 flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all hover:text-green-700"
//                     >
//                       View Opportunities
//                       <ArrowRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       )}
//     </section>
//   )
// }