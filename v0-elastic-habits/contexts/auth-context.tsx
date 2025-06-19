"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
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
  isOnline: boolean
  usingCache: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_CACHE_KEY = 'momentum_admin_status_cache_v1'

function saveAdminCache(isAdmin: boolean) {
  localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify({ isAdmin, timestamp: Date.now() }))
}
function loadAdminCache(): { isAdmin: boolean, timestamp: number } | null {
  try {
    const raw = localStorage.getItem(ADMIN_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true)
  const [usingCache, setUsingCache] = useState(false)
  const { toast } = useToast()
  const retryCountRef = useRef(0)
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null)

  // --- Network status effect ---
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // --- Session cache helpers ---
  const SESSION_CACHE_KEY = 'momentum_session_cache'
  const saveSessionCache = (session: Session | null) => {
    if (session) {
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(SESSION_CACHE_KEY)
    }
  }
  const loadSessionCache = (): Session | null => {
    try {
      const raw = localStorage.getItem(SESSION_CACHE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  // --- Robust session fetch with retry ---
  const fetchSessionWithRetry = async (maxRetries = 3, delayMs = 1000): Promise<Session | null> => {
    let lastError: any = null
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (session) return session
      } catch (err) {
        lastError = err
        await new Promise(res => setTimeout(res, delayMs))
      }
    }
    throw lastError
  }

  // --- Set user/admin from session ---
  const setUserAndAdminFromSession = async (session: Session | null) => {
    setSession(session)
    const currentUser = session?.user ?? null
    setUser(currentUser)
    saveSessionCache(session)
    if (currentUser) {
      // Temporarily disable admin check to prevent infinite loading
      // Check cached admin status first
      const cached = loadAdminCache()
      if (cached && typeof cached.isAdmin === 'boolean') {
        setIsAdmin(cached.isAdmin)
      } else {
        setIsAdmin(false)
      }
      
      // Try admin check in background without blocking the UI
      setTimeout(async () => {
        try {
          const adminPromise = supabase
            .from('user_roles')
            .select('is_admin')
            .eq('user_id', currentUser.id)
            .single()
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Admin check timeout')), 5000)
          )
          const { data: userRole } = await Promise.race([adminPromise, timeoutPromise]) as any
          const isUserAdmin = userRole?.is_admin === true
          setIsAdmin(isUserAdmin)
          saveAdminCache(isUserAdmin)
        } catch (error) {
          // Silently fail - we already set a default value above
          console.log('Admin check failed:', error)
        }
      }, 100)
    } else {
      setIsAdmin(false)
    }
  }

  // --- Auth initialization logic ---
  const initializeAuth = async () => {
    setIsLoading(true)
    setUsingCache(false)
    retryCountRef.current = 0
    let session: Session | null = null
    let cancelled = false
    try {
      session = await fetchSessionWithRetry(3, 1000)
      if (!cancelled) {
        await setUserAndAdminFromSession(session)
      }
    } catch (err) {
      // If offline or network error, try cache
      if (!isOnline) {
        const cached = loadSessionCache()
        if (cached) {
          setUsingCache(true)
          await setUserAndAdminFromSession(cached)
          toast({
            title: "Offline mode",
            description: "You are offline. Using last known session.",
            variant: "destructive",
          })
          return
        }
      }
      // If not offline, or no cache, treat as logged out
      setUser(null)
      setSession(null)
      setIsAdmin(false)
      saveSessionCache(null)
      if (!isOnline) {
        toast({
          title: "Offline",
          description: "You are offline and no cached session is available.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Authentication error",
          description: "Could not verify session. Please sign in again.",
          variant: "destructive",
        })
      }
    } finally {
      if (!cancelled) setIsLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    // On mount, try to use cache immediately for UI
    const cachedSession = loadSessionCache()
    if (cachedSession) {
      setSession(cachedSession)
      setUser(cachedSession.user)
      setUsingCache(true)
      setIsLoading(false) // Set loading to false when using cache
    }
    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!cancelled) {
        await setUserAndAdminFromSession(session)
        setUsingCache(false)
        setIsLoading(false) // Set loading to false after auth state change
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [isOnline])

  // Auto-retry logic: retry session sync every 300 seconds (5 minutes) when offline or using cache
  useEffect(() => {
    if (!isOnline || usingCache) {
      if (retryTimerRef.current) clearInterval(retryTimerRef.current)
      retryTimerRef.current = setInterval(() => {
        // Try to re-initialize auth (will use online if available)
        initializeAuth()
      }, 300_000) // 300 seconds = 5 minutes
    } else {
      if (retryTimerRef.current) {
        clearInterval(retryTimerRef.current)
        retryTimerRef.current = null
      }
    }
    return () => {
      if (retryTimerRef.current) clearInterval(retryTimerRef.current)
    }
  }, [isOnline, usingCache])

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
      value={{ user, session, isLoading, isAdmin, signUp, signIn, signInWithGoogle, signOut, updateProfile, isOnline, usingCache }}
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
