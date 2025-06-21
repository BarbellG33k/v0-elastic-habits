"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { HabitTracking } from "@/types/habit"
import { useToast } from "./use-toast"
import { useDataRefresh } from "@/contexts/data-refresh-context"

const INSIGHTS_CACHE_KEY = 'momentum_insights_cache_v1'
const INSIGHTS_CACHE_TIMESTAMP_KEY = 'momentum_insights_cache_timestamp_v1'
const CACHE_EXPIRY_MS = 30 * 60 * 1000 // 30 minutes

function saveInsightsCache(tracking: HabitTracking[]) {
  localStorage.setItem(INSIGHTS_CACHE_KEY, JSON.stringify(tracking))
  localStorage.setItem(INSIGHTS_CACHE_TIMESTAMP_KEY, Date.now().toString())
}

function loadInsightsCache() {
  try {
    const tracking = JSON.parse(localStorage.getItem(INSIGHTS_CACHE_KEY) || '[]')
    const timestamp = parseInt(localStorage.getItem(INSIGHTS_CACHE_TIMESTAMP_KEY) || '0', 10)
    return { tracking, timestamp }
  } catch {
    return { tracking: [], timestamp: 0 }
  }
}

export function useInsights() {
  const [insightsTracking, setInsightsTracking] = useState<HabitTracking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, session, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const { registerRefreshFunctions } = useDataRefresh()

  // Fetch insights data (last 90 days)
  const fetchInsights = useCallback(async (forceRefresh = false) => {
    if (!user || !session) {
      setInsightsTracking([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const { tracking: cachedTracking, timestamp } = loadInsightsCache()
    const cacheIsValid = Date.now() - timestamp < CACHE_EXPIRY_MS

    // If we have valid cache and not forcing refresh, use it
    if (cacheIsValid && cachedTracking.length && !forceRefresh) {
      setInsightsTracking(cachedTracking)
      setIsLoading(false)
      return
    }

    try {
      // Create timeout promise for insights data fetching
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Insights fetch timeout')), 5000)
      })

      const fetchPromise = fetch('/api/habits/tracking/insights', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      const response = await Promise.race([fetchPromise, timeoutPromise])

      if (!response.ok) {
        throw new Error('Failed to fetch insights data')
      }

      const trackingData = await response.json()
      const transformedTracking: HabitTracking[] = trackingData.map((track: any) => ({
        habitId: track.habit_id,
        date: track.date,
        activityIndex: track.activity_index,
        levelIndex: track.level_index,
        timestamp: track.timestamp,
      }))

      setInsightsTracking(transformedTracking)
      saveInsightsCache(transformedTracking)
    } catch (error: any) {
      // On error, use cache if available
      const { tracking: cachedTracking } = loadInsightsCache()
      if (cachedTracking.length) {
        setInsightsTracking(cachedTracking)
      } else {
        setInsightsTracking([])
        if (error.message === 'Insights fetch timeout') {
          toast({
            title: "Insights fetch timeout",
            description: "Could not load insights within 5 seconds. Please try again.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error fetching insights data",
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
      setInsightsTracking([])
      setIsLoading(false)
      return
    }
    fetchInsights()
  }, [fetchInsights, user, session, authLoading])

  // Register refresh function for global coordination
  useEffect(() => {
    const refreshInsightsGlobal = () => {
      // Clear cache to force fresh data
      localStorage.removeItem(INSIGHTS_CACHE_KEY)
      localStorage.removeItem(INSIGHTS_CACHE_TIMESTAMP_KEY)
      fetchInsights(true)
    }
    registerRefreshFunctions({ refreshInsights: refreshInsightsGlobal })
  }, [fetchInsights, registerRefreshFunctions])

  return {
    insightsTracking,
    isLoading,
    refreshInsights: fetchInsights,
  }
} 