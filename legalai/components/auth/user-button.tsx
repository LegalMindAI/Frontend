"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { logout } from "@/lib/auth"
import { AuthModal } from "./auth-modal"
import { toast } from "@/components/ui/toast"

export function UserButton() {
  const { user, loading, isVerified } = useAuth()
  const [showEmailVerificationModal, setShowEmailVerificationModal] = React.useState(false)

  // Show email verification modal if user is logged in but not verified
  React.useEffect(() => {
    if (user && !user.emailVerified) {
      setShowEmailVerificationModal(true)
    } else {
      setShowEmailVerificationModal(false)
    }
  }, [user])

  // Display loading state
  if (loading) {
    return <Button variant="outline" disabled>Loading...</Button>
  }

  // If user is not logged in, show login button
  if (!user) {
    return <AuthModal />
  }

  // Get user's initials for the avatar
  const initials = getUserInitials(user.displayName || user.email || "User")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="w-10 h-10 rounded-full p-0 flex items-center justify-center text-lg font-medium"
          >
            {initials}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="font-medium">
            {user.displayName || user.email}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await logout()
              toast({
                title: "Logged out",
                description: "You have been successfully logged out."
              })
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Email verification modal */}
      {showEmailVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
            <p className="mb-4">
              We've sent a verification email to <span className="font-medium">{user.email}</span>.
              Please verify your email to continue.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  await logout()
                  setShowEmailVerificationModal(false)
                  toast({
                    title: "Logged out",
                    description: "You have been logged out."
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await user.reload()
                  if (user.emailVerified) {
                    setShowEmailVerificationModal(false)
                    toast({
                      title: "Email verified",
                      description: "Your email has been successfully verified."
                    })
                  } else {
                    toast({
                      title: "Not verified",
                      description: "Email not verified yet. Please check your inbox.",
                      variant: "destructive"
                    })
                  }
                }}
              >
                I've Verified
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Helper function to get user's initials
function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
} 