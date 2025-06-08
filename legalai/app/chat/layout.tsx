// app/chat/layout.tsx

"use client"

import React from "react"
import Header from "../components/Header"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen text-white relative">
      <div className="fixed inset-0 bg-black"></div>
      <div className="relative z-10">
        <Header />
        <main className="pt-24">
          {children}
        </main>
      </div>
    </div>
  )
}
