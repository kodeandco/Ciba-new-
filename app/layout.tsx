import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ThemeToggle from "@/components/ThemeToggle"  // ADD THIS LINE

import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CIBA Mumbai - Center for Incubation and Business Acceleration",
  description:
    "CIBA Mumbai is a center for incubation and business acceleration in Vashi, Navi Mumbai, fostering innovation and entrepreneurship.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <ThemeToggle />
        {children}
        <Analytics />
      </body>
    </html>
  )
}