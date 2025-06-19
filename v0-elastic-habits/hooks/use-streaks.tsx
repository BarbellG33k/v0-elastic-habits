"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { HabitTracking } from "@/types/habit"
import { useToast } from "./use-toast"

const STREAKS_CACHE_KEY = 'momentum_streaks_cache_v1'
const STREAKS_CACHE_TIMESTAMP_KEY = 'momentum_streaks_cache_timestamp_v1'
const CACHE_EXPIRY_MS = 60 * 60 * 1000 // 1 hour

function saveStreaksCache(tracking: HabitTracking[]) {
  localStorage.setItem(STREAKS_CACHE_KEY, JSON.stringify(tracking))
  localStorage.setItem(STREAKS_CACHE_TIMESTAMP_KEY, Date.now().toString())
}

function loadStreaksCache() {
  try {
    const tracking = JSON.parse(localStorage.getItem(STREAKS_CACHE_KEY) || '[]')
    const timestamp = parseInt(localStorage.getItem(STREAKS_CACHE_TIMESTAMP_KEY) || '0', 10)
    return { tracking, timestamp }
  } catch {
    return { tracking: [], timestamp: 0 }
  }
}

export function useStreaks() {
  const [streaksTracking, setStreaksTracking] = useState<HabitTracking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, session, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  // Fetch streaks data (last year)
  const fetchStreaks = useCallback(async (forceRefresh = false) => {
    if (!user || !session) {
      setStreaksTracking([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const { tracking: cachedTracking, timestamp } = loadStreaksCache()
    const cacheIsValid = Date.now() - timestamp < CACHE_EXPIRY_MS

    // If we have valid cache and not forcing refresh, use it
    if (cacheIsValid && cachedTracking.length && !forceRefresh) {
      setStreaksTracking(cachedTracking)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/habits/tracking/streaks', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch streaks data')
      }

      const trackingData = await response.json()
      const transformedTracking: HabitTracking[] = trackingData.map((track: any) => ({
        habitId: track.habit_id,
        date: track.date,
        activityIndex: track.activity_index || 0,
        levelIndex: track.level_index || 0,
        timestamp: track.timestamp,
      }))

      setStreaksTracking(transformedTracking)
      saveStreaksCache(transformedTracking)
    } catch (error: any) {
      // On error, use cache if available
      const { tracking: cachedTracking } = loadStreaksCache()
      if (cachedTracking.length) {
        setStreaksTracking(cachedTracking)
      } else {
        setStreaksTracking([])
        toast({
          title: "Error fetching streaks data",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [user, session, toast])

  // Fetch data when user changes
  useEffect(() => {
    if (!user || !session || authLoading) {
      setStreaksTracking([])
      setIsLoading(false)
      return
    }
    fetchStreaks()
  }, [fetchStreaks, user, session, authLoading])

  return {
    streaksTracking,
    isLoading,
    refreshStreaks: fetchStreaks,
  }
} 