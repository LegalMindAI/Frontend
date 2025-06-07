import "./globals.css"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import type React from "react" // Import React

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LegalAI - Virtual Legal Assistant",
  description: "AI-powered legal assistant with 42k+ case studies. Get expert legal research and consultation.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} bg-black text-white `}>{children}</body>
    </html>
  )
}
