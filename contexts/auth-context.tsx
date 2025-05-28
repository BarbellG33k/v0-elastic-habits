"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { getUserRole } from "@/lib/admin-utils"

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

  // Check if user is admin and enabled
  const checkUserRole = async (userId: string) => {
    if (!userId) return

    try {
      const userRole = await getUserRole(userId)

      // If no role returned, treat as non-admin enabled user
      if (!userRole) {
        setIsAdmin(false)
        return
      }

      // If user is disabled, sign them out
      if (!userRole.is_enabled) {
        await supabase.auth.signOut()
        toast({
          title: "Account disabled",
          description: "Your account has been disabled. Please contact support.",
          variant: "destructive",
        })
        return
      }

      setIsAdmin(userRole.is_admin || false)
    } catch (error: any) {
      console.error("Error checking user role:", error)
      
      // Handle all expected error cases silently
      if (error.message?.includes('infinite recursion') ||
          error.message?.includes('creating default role') ||
          error.message?.includes('PGRST116') ||
          error?.code === 'PGRST116') {
        setIsAdmin(false)
        return
      }

      // Only show toast for truly unexpected errors
      if (!error.message?.includes('default role')) {
        toast({
          title: "Error checking permissions",
          description: "There was an error checking your permissions. Please try again later.",
          variant: "destructive",
        })
      }
      
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        checkUserRole(session.user.id)
      }

      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        checkUserRole(session.user.id)
      } else {
        setIsAdmin(false)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [toast])

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

      // Check if user is enabled
      if (data.user) {
        const userRole = await getUserRole(data.user.id)

        if (userRole && !userRole.is_enabled) {
          await supabase.auth.signOut()
          throw new Error("Your account has been disabled. Please contact support.")
        }
      }

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
