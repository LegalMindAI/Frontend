// app/chat/page.tsx

"use client";

import { useAuth } from "@/lib/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import AIChat from "../components/Chat"

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatType = searchParams.get('type')

  // Effect to redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/?login=true")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the effect
  }

  return <AIChat chatType={chatType || "Basic Research"} />
}
