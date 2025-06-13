// app/chat/layout.tsx

"use client"

import React from "react"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen h-screen bg-black flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
