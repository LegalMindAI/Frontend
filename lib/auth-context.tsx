"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "firebase/auth"
import { auth } from "./firebase"
import { onAuthStateChangedListener } from "./auth"
import { storeToken, clearStoredToken, refreshStoredToken } from "./token-manager"

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
      
      // Store or clear token based on auth state
      if (authUser) {
        // Get and store the token when user signs in
        authUser.getIdToken().then(token => {
          storeToken(token)
        }).catch(error => {
          console.error("Error getting auth token:", error)
        })
      } else {
        // Clear token when user signs out
        clearStoredToken()
      }
    })

    // Check email verification status periodically when user is logged in but not verified
    let interval: NodeJS.Timeout | null = null
    if (user && !user.emailVerified) {
      interval = setInterval(() => {
        user.reload().then(() => {
          if (user.emailVerified) {
            setIsVerified(true)
            if (interval) clearInterval(interval)
            
            // Refresh token when email is verified
            refreshStoredToken(user).catch(error => {
              console.error("Error refreshing token after verification:", error)
            })
          }
        })
      }, 5000) // Check every 5 seconds
    }

    // Refresh token periodically to keep it valid
    let tokenRefreshInterval: NodeJS.Timeout | null = null
    if (user) {
      // Refresh token every 30 minutes
      tokenRefreshInterval = setInterval(() => {
        refreshStoredToken(user).catch(error => {
          console.error("Error refreshing token:", error)
        })
      }, 30 * 60 * 1000) // 30 minutes
    }

    return () => {
      unsubscribe()
      if (interval) clearInterval(interval)
      if (tokenRefreshInterval) clearInterval(tokenRefreshInterval)
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