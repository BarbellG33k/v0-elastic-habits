"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { HabitTracking } from "@/types/habit"
import { useToast } from "./use-toast"
import { useDataRefresh } from "@/contexts/data-refresh-context"

const RECENT_CACHE_KEY = 'momentum_recent_cache_v1'
const RECENT_CACHE_TIMESTAMP_KEY = 'momentum_recent_cache_timestamp_v1'
const CACHE_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes (shorter for recent data)

function saveRecentCache(tracking: HabitTracking[]) {
  localStorage.setItem(RECENT_CACHE_KEY, JSON.stringify(tracking))
  localStorage.setItem(RECENT_CACHE_TIMESTAMP_KEY, Date.now().toString())
}

function loadRecentCache() {
  try {
    const tracking = JSON.parse(localStorage.getItem(RECENT_CACHE_KEY) || '[]')
    const timestamp = parseInt(localStorage.getItem(RECENT_CACHE_TIMESTAMP_KEY) || '0', 10)
    return { tracking, timestamp }
  } catch {
    return { tracking: [], timestamp: 0 }
  }
}

export function useRecentActivity() {
  const [recentTracking, setRecentTracking] = useState<HabitTracking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, session, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const { registerRefreshFunctions } = useDataRefresh()

  // Fetch recent activity data (last 7 days)
  const fetchRecentActivity = useCallback(async (forceRefresh = false) => {
    if (!user || !session) {
      setRecentTracking([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const { tracking: cachedTracking, timestamp } = loadRecentCache()
    const cacheIsValid = Date.now() - timestamp < CACHE_EXPIRY_MS

    // If we have valid cache and not forcing refresh, use it
    if (cacheIsValid && cachedTracking.length && !forceRefresh) {
      setRecentTracking(cachedTracking)
      setIsLoading(false)
      return
    }

    try {
      // Create timeout promise for recent activity data fetching
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Recent activity fetch timeout')), 5000)
      })

      const fetchPromise = fetch('/api/habits/tracking/recent', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      const response = await Promise.race([fetchPromise, timeoutPromise])

      if (!response.ok) {
        throw new Error('Failed to fetch recent activity data')
      }

      const trackingData = await response.json()
      const transformedTracking: HabitTracking[] = trackingData.map((track: any) => ({
        habitId: track.habit_id,
        date: track.date,
        activityIndex: track.activity_index,
        levelIndex: track.level_index,
        timestamp: track.timestamp,
      }))

      setRecentTracking(transformedTracking)
      saveRecentCache(transformedTracking)
    } catch (error: any) {
      // On error, use cache if available
      const { tracking: cachedTracking } = loadRecentCache()
      if (cachedTracking.length) {
        setRecentTracking(cachedTracking)
      } else {
        setRecentTracking([])
        if (error.message === 'Recent activity fetch timeout') {
          toast({
            title: "Recent activity fetch timeout",
            description: "Could not load recent activity within 5 seconds. Please try again.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error fetching recent activity data",
            description: error.message,
            variant: "destructive",
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [user, session, toast])

  // Fetch data when user changes
  useEffect(() => {
    if (!user || !session || authLoading) {
      setRecentTracking([])
      setIsLoading(false)
      return
    }
    fetchRecentActivity()
  }, [fetchRecentActivity, user, session, authLoading])

  // Register refresh function for global coordination
  useEffect(() => {
    const refreshRecentGlobal = () => {
      // Clear cache to force fresh data
      localStorage.removeItem(RECENT_CACHE_KEY)
      localStorage.removeItem(RECENT_CACHE_TIMESTAMP_KEY)
      fetchRecentActivity(true)
    }
    registerRefreshFunctions({ refreshRecent: refreshRecentGlobal })
  }, [fetchRecentActivity, registerRefreshFunctions])

  // Helper function to get tracked habits for a specific date
  const getTrackedHabits = useCallback(
    (date: string) => {
      return recentTracking.filter((t) => t.date === date)
    },
    [recentTracking],
  )

  return {
    recentTracking,
    isLoading,
    refreshRecentActivity: fetchRecentActivity,
    getTrackedHabits,
  }
} 