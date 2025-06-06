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
          const { data: userRole, error } = await supabase
            .from('user_roles')
            .select('is_admin')
            .eq('user_id', currentUser.id)
            .single()
          
          const isUserAdmin = userRole?.is_admin === true
          setIsAdmin(isUserAdmin)
          console.log(`AuthContext: User set. Admin status from DB: ${isUserAdmin}. isAdmin state set to: ${isUserAdmin}`)
        } catch (error) {
          console.error('Error fetching admin status:', error)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
        console.log('AuthContext: No user, isAdmin set to false')
      }
    }

    // Get initial session and set state
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting initial auth session:", error);
      }
      await setUserAndAdminFromSession(session)
      setIsLoading(false)
    }).catch(err => {
      console.error("Exception getting initial auth session:", err);
      setIsLoading(false);
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("AuthContext: Auth state changed.", _event)
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
