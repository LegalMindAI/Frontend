"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { 
  signUpWithEmail, 
  loginWithEmail, 
  signInWithGoogle 
} from "@/lib/auth"
import { User } from "firebase/auth"
import Cookies from "js-cookie"
import { toast } from "@/components/ui/toast"

export function AuthModal() {
  const searchParams = useSearchParams()
  const showLogin = searchParams.get('login') === 'true'
  
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isSignUp, setIsSignUp] = React.useState<boolean>(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: ""
  })
  const [open, setOpen] = React.useState(showLogin)

  // Update open state when query param changes
  React.useEffect(() => {
    setOpen(showLogin)
  }, [showLogin])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  // Set session cookie when user is authenticated
  const setSessionCookie = (user: User) => {
    Cookies.set('session', 'true', { expires: 7 }) // 7 days
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        await signUpWithEmail(formData.email, formData.password, formData.name)
        toast({
          title: "Account created!",
          description: "Please check your email for verification."
        })
      } else {
        const user = await loginWithEmail(formData.email, formData.password)
        
        if (!user.emailVerified) {
          toast({
            title: "Email not verified",
            description: "Please verify your email before logging in.",
            variant: "destructive"
          })
          setIsLoading(false)
          return
        }
        
        setSessionCookie(user)
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in."
        })
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Authentication error",
        description: error instanceof Error ? error.message : "Failed to authenticate",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)

    try {
      const user = await signInWithGoogle()
      setSessionCookie(user)
      toast({
        title: "Welcome!",
        description: "You have successfully logged in with Google."
      })
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast({
        title: "Authentication error",
        description: error instanceof Error ? error.message : "Failed to authenticate with Google",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create an account" : "Login"}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? "Enter your details below to create your account"
              : "Enter your credentials to access your account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  disabled={isLoading}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                disabled={isLoading}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </DialogFooter>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
        <div className="text-center text-sm mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 