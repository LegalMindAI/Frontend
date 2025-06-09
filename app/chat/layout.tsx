// app/chat/layout.tsx

"use client"

import React from "react"
import Header from "../components/Header"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {  return (
    <div className="h-screen text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-black"></div>
      <div className="relative z-10 h-screen flex flex-col">
        <main className="flex-1 flex flex-col h-full">
          {children}
        </main>
      </div>
    </div>
  )
}
