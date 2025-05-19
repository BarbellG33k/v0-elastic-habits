"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const { searchParams } = new URL(window.location.href)
        const code = searchParams.get("code")

        if (!code) {
          throw new Error("No code provided in callback URL")
        }

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          throw error
        }

        // Redirect to the dashboard
        router.push("/")
      } catch (error) {
        console.error("Error during auth callback:", error)
        router.push("/auth/sign-in?error=Authentication%20failed")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
