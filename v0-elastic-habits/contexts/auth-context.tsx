"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Set user and isAdmin state based on the session object
    const setUserAndAdminFromSession = async (session: Session | null) => {
      setSession(session)
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      // Check admin status from the database since JWT hooks aren't working
      if (currentUser) {
        try {
          // Keep a reasonable timeout for admin check to prevent hanging, but longer than before
          const adminPromise = supabase
            .from('user_roles')
            .select('is_admin')
            .eq('user_id', currentUser.id)
            .single()
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Admin check timeout')), 15000)
          )
          
          const { data: userRole } = await Promise.race([adminPromise, timeoutPromise]) as any
          const isUserAdmin = userRole?.is_admin === true
          setIsAdmin(isUserAdmin)
        } catch (error) {
          console.log('Admin check failed or timed out:', error)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
    }

    // Add timeout to initial session check
    const initializeAuth = async () => {
      try {
        // Remove aggressive timeout - let Supabase handle session checking naturally
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session check error:', error)
          // On error, still set not authenticated but don't throw
          setUser(null)
          setSession(null)
          setIsAdmin(false)
        } else {
          // Process the session normally
          await setUserAndAdminFromSession(session)
        }
      } catch (err) {
        console.error('Auth initialization failed:', err)
        // Set as not authenticated on unexpected errors
        setUser(null)
        setSession(null)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await setUserAndAdminFromSession(session)
      // No need to set isLoading here, as it's for the initial load.
      // Subsequent changes happen while the app is running.
    })

    return () => {
      subscription.unsubscribe()
    }
  }, []) // The dependency array is empty as this effect should only run once to set up listeners.

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Account created",
        description: "Please check your email for the confirmation link",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // We no longer need to check if the user is enabled here,
      // as that logic can be part of an RLS policy or the token hook itself if desired.
      // For now, the successful login is sufficient. The new token will have the claim.
      
      toast({
        title: "Welcome back",
        description: "You have successfully signed in",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, session, isLoading, isAdmin, signUp, signIn, signInWithGoogle, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
