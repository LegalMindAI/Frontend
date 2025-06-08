"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "firebase/auth"
import { auth } from "./firebase"
import { onAuthStateChangedListener } from "./auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  isVerified: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isVerified: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((authUser) => {
      setUser(authUser)
      setIsVerified(authUser?.emailVerified || false)
      setLoading(false)
    })

    // Check email verification status periodically when user is logged in but not verified
    let interval: NodeJS.Timeout | null = null
    if (user && !user.emailVerified) {
      interval = setInterval(() => {
        user.reload().then(() => {
          if (user.emailVerified) {
            setIsVerified(true)
            if (interval) clearInterval(interval)
          }
        })
      }, 5000) // Check every 5 seconds
    }

    return () => {
      unsubscribe()
      if (interval) clearInterval(interval)
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, isVerified }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
} 