"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState("Processing authentication...")

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      // Set a timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.log("⏰ Callback timeout, redirecting to sign-in...")
        setStatus("Authentication timeout. Redirecting to sign-in...")
        router.push("/auth/sign-in?error=Authentication%20timeout")
      }, 10000) // 10 second timeout

      try {
        console.log("🔍 Starting OAuth callback process...")
        setStatus("Getting auth code from URL...")
        
        // Get the auth code from the URL
        const { searchParams } = new URL(window.location.href)
        const code = searchParams.get("code")
        const error = searchParams.get("error")
        const errorDescription = searchParams.get("error_description")

        console.log("📋 URL parameters:", { 
          hasCode: !!code, 
          codeLength: code?.length, 
          error, 
          errorDescription,
          fullUrl: window.location.href 
        })

        // Check for OAuth errors first
        if (error) {
          console.error("❌ OAuth error:", error, errorDescription)
          clearTimeout(timeoutId)
          throw new Error(`OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`)
        }

        // If no code is provided, check if we're already authenticated
        if (!code) {
          console.log("⚠️ No code provided, checking if already authenticated...")
          
          // Check if we already have a session
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            console.log("✅ Already authenticated, redirecting to dashboard...")
            clearTimeout(timeoutId)
            setStatus("Already authenticated! Redirecting...")
            await new Promise(resolve => setTimeout(resolve, 1000))
            router.push("/")
            return
          } else {
            console.error("❌ No code provided and no existing session")
            clearTimeout(timeoutId)
            setStatus("No authentication code found. Redirecting to sign-in...")
            await new Promise(resolve => setTimeout(resolve, 1000))
            router.push("/auth/sign-in?error=No%20authentication%20code%20found")
            return
          }
        }

        console.log("✅ Auth code found, attempting exchange...")
        setStatus("Exchanging code for session...")
        
        // Try to exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        console.log("🔄 Exchange result:", { 
          hasData: !!data, 
          hasSession: !!data?.session, 
          error: exchangeError?.message 
        })

        if (exchangeError) {
          console.error("❌ Code exchange error:", exchangeError)
          
          // Even if exchange fails, check if we have a session
          console.log("🔍 Checking for existing session despite exchange error...")
          const { data: { session } } = await supabase.auth.getSession()
          
          console.log("📋 Session check result:", { hasSession: !!session })
          
          if (session) {
            console.log("✅ Session exists despite exchange error, proceeding...")
            clearTimeout(timeoutId)
            setStatus("Authentication successful! Redirecting...")
            await new Promise(resolve => setTimeout(resolve, 1000))
            router.push("/")
            return
          } else {
            throw exchangeError
          }
        }

        if (!data.session) {
          console.error("❌ No session returned from code exchange")
          throw new Error("No session returned from code exchange")
        }

        console.log("✅ Session exchange successful!")
        clearTimeout(timeoutId)
        setStatus("Authentication successful! Redirecting...")
        
        // Wait a moment to ensure the session is properly set
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirect to the dashboard
        router.push("/")
      } catch (error: any) {
        console.error("❌ Auth callback error:", error)
        clearTimeout(timeoutId)
        
        // Final check - see if we have a session despite all errors
        try {
          console.log("🔍 Final session check...")
          const { data: { session } } = await supabase.auth.getSession()
          
          console.log("📋 Final session check result:", { hasSession: !!session })
          
          if (session) {
            console.log("✅ Session exists despite error, redirecting to dashboard")
            setStatus("Authentication successful! Redirecting...")
            await new Promise(resolve => setTimeout(resolve, 1000))
            router.push("/")
          } else {
            console.error("❌ No session found, redirecting to sign-in")
            setStatus("Authentication failed. Redirecting to sign-in...")
            await new Promise(resolve => setTimeout(resolve, 1000))
            router.push("/auth/sign-in?error=Authentication%20failed")
          }
        } catch (sessionError) {
          console.error("❌ Error checking session:", sessionError)
          setStatus("Authentication failed. Redirecting to sign-in...")
          await new Promise(resolve => setTimeout(resolve, 1000))
          router.push("/auth/sign-in?error=Authentication%20failed")
        }
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{status}</p>
      </div>
    </div>
  )
}
