"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { Habit, HabitTracking } from "@/types/habit"
import { useToast } from "./use-toast"

const HABITS_CACHE_KEY = 'momentum_habits_cache_v1'
const TRACKING_CACHE_KEY = 'momentum_tracking_cache_v1'
const CACHE_TIMESTAMP_KEY = 'momentum_habits_cache_timestamp_v1'
const CACHE_EXPIRY_MS = 60 * 60 * 1000 // 1 hour

function saveCache(habits: Habit[], tracking: HabitTracking[]) {
  localStorage.setItem(HABITS_CACHE_KEY, JSON.stringify(habits))
  localStorage.setItem(TRACKING_CACHE_KEY, JSON.stringify(tracking))
  localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
}

function loadCache() {
  try {
    const habits = JSON.parse(localStorage.getItem(HABITS_CACHE_KEY) || '[]')
    const tracking = JSON.parse(localStorage.getItem(TRACKING_CACHE_KEY) || '[]')
    const timestamp = parseInt(localStorage.getItem(CACHE_TIMESTAMP_KEY) || '0', 10)
    return { habits, tracking, timestamp }
  } catch {
    return { habits: [], tracking: [], timestamp: 0 }
  }
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [tracking, setTracking] = useState<HabitTracking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [usingCache, setUsingCache] = useState(false)
  const { user, session, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  // Fetch habits from API or cache
  const fetchHabits = useCallback(async (forceRefresh = false) => {
    if (!user || !session) {
      setHabits([])
      setTracking([])
      setIsLoading(false)
      setUsingCache(false)
      return
    }

    setIsLoading(true)
    setUsingCache(false)
    const { habits: cachedHabits, tracking: cachedTracking, timestamp } = loadCache()
    const cacheIsValid = Date.now() - timestamp < CACHE_EXPIRY_MS
    const isActuallyOffline = typeof navigator !== 'undefined' && navigator.onLine === false

    // If we have valid cache and not forcing refresh, use it
    if (cacheIsValid && cachedHabits.length && cachedTracking.length && !forceRefresh) {
      setHabits(cachedHabits)
      setTracking(cachedTracking)
      setIsLoading(false)
      setUsingCache(false)
      return
    }

    try {
      // Fetch habits from API
      const habitsResponse = await fetch('/api/habits', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!habitsResponse.ok) {
        throw new Error('Failed to fetch habits')
      }

      const habitsData = await habitsResponse.json()
      const transformedHabits: Habit[] = habitsData.map((habit: any) => ({
        id: habit.id,
        name: habit.name,
        activities: habit.activities,
        createdAt: habit.created_at,
        stats: { completedDays: 0, streak: 0 }, // We'll calculate this from tracking data
      }))

      setHabits(transformedHabits)

      // Fetch tracking data from API
      const trackingResponse = await fetch('/api/habits/tracking', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!trackingResponse.ok) {
        throw new Error('Failed to fetch tracking data')
      }

      const trackingData = await trackingResponse.json()
      const transformedTracking: HabitTracking[] = trackingData.map((track: any) => ({
        habitId: track.habit_id,
        date: track.date,
        activityIndex: track.activity_index,
        levelIndex: track.level_index,
        timestamp: track.timestamp,
      }))

      setTracking(transformedTracking)

      // Calculate stats for each habit
      const updatedHabits = transformedHabits.map((habit) => {
        const habitTracking = transformedTracking.filter((t) => t.habitId === habit.id)
        const dates = [...new Set(habitTracking.map((t) => t.date))].sort()

        // Simple streak calculation
        let streak = 0
        if (dates.length > 0) {
          streak = 1
          for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1])
            const currDate = new Date(dates[i])
            const diffTime = Math.abs(currDate.getTime() - prevDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 1) {
              streak++
            } else {
              streak = 1
            }
          }
        }

        return {
          ...habit,
          stats: {
            completedDays: dates.length,
            streak,
          },
        }
      })

      setHabits(updatedHabits)
      setTracking(transformedTracking)
      saveCache(updatedHabits, transformedTracking)
      setUsingCache(false)
    } catch (error: any) {
      // On error, use cache if available
      const { habits: cachedHabits, tracking: cachedTracking, timestamp } = loadCache()
      if (cachedHabits.length && cachedTracking.length) {
        setHabits(cachedHabits)
        setTracking(cachedTracking)
        setUsingCache(true)
        if (isActuallyOffline || (error.message && error.message.toLowerCase().includes('network'))) {
          toast({
            title: "Offline mode",
            description: "Using cached habit data. Some features may be read-only.",
            variant: "destructive",
          })
        }
      } else {
        setHabits([])
        setTracking([])
        setUsingCache(false)
        toast({
          title: "Error fetching data",
          description: error.message.includes('timeout') ? 'Request timed out. Please try again.' : error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Fetch data when user changes
  useEffect(() => {
    if (!user || !session || authLoading) {
      setHabits([])
      setTracking([])
      setIsLoading(false)
      return
    }
    fetchHabits()
  }, [fetchHabits, user, session, authLoading])

  // Set up periodic refresh
  useEffect(() => {
    if (!user || !session) return

    const refreshInterval = setInterval(() => {
      fetchHabits(true)
    }, CACHE_EXPIRY_MS)

    return () => clearInterval(refreshInterval)
  }, [user, session, fetchHabits])

  // Add a new habit
  const addHabit = useCallback(
    async (habit: Omit<Habit, "id" | "createdAt">) => {
      if (!user || !session) return

      try {
        const response = await fetch('/api/habits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(habit),
        })

        if (!response.ok) {
          throw new Error('Failed to create habit')
        }

        const data = await response.json()
        const newHabit: Habit = {
          id: data.id,
          name: data.name,
          activities: data.activities,
          createdAt: data.created_at,
          stats: { completedDays: 0, streak: 0 },
        }

        setHabits((prev) => [newHabit, ...prev])

        toast({
          title: "Habit created",
          description: `${habit.name} has been added to your habits`,
        })
      } catch (error: any) {
        toast({
          title: "Error creating habit",
          description: error.message,
          variant: "destructive",
        })
      }
    },
    [user, session, toast],
  )

  // Update an existing habit
  const updateHabit = useCallback(
    async (updatedHabit: Habit) => {
      if (!user || !session) return

      try {
        const response = await fetch(`/api/habits/${updatedHabit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(updatedHabit),
        })

        if (!response.ok) {
          throw new Error('Failed to update habit')
        }

        // Update the habit in state
        setHabits((prev) => prev.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit)))

        toast({
          title: "Habit updated",
          description: `${updatedHabit.name} has been updated`,
        })
      } catch (error: any) {
        toast({
          title: "Error updating habit",
          description: error.message,
          variant: "destructive",
        })
      }
    },
    [user, session, toast],
  )

  // Delete a habit
  const deleteHabit = useCallback(
    async (habitId: string) => {
      if (!user || !session) return

      try {
        const response = await fetch(`/api/habits/${habitId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete habit')
        }

        // Remove the habit from state
        setHabits((prev) => prev.filter((habit) => habit.id !== habitId))
        setTracking((prev) => prev.filter((track) => track.habitId !== habitId))

        toast({
          title: "Habit deleted",
          description: "The habit has been removed",
        })
      } catch (error: any) {
        toast({
          title: "Error deleting habit",
          description: error.message,
          variant: "destructive",
        })
      }
    },
    [user, session, toast],
  )

  // Track a habit
  const trackHabit = useCallback(
    async (trackingData: Omit<HabitTracking, "id">) => {
      if (!user || !session) return

      try {
        const response = await fetch('/api/habits/tracking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(trackingData),
        })

        if (!response.ok) {
          throw new Error('Failed to track habit')
        }

        // Update tracking in state
        setTracking((prev) => {
          // Remove any existing tracking for this habit/activity/level on this date
          const filtered = prev.filter(
            (t) =>
              !(
                t.habitId === trackingData.habitId &&
                t.date === trackingData.date &&
                t.activityIndex === trackingData.activityIndex &&
                t.levelIndex === trackingData.levelIndex
              ),
          )

          const newTracking = [...filtered, trackingData]
          
          // Update habit stats directly instead of refetching
          setHabits((prevHabits) => {
            return prevHabits.map((habit) => {
              if (habit.id === trackingData.habitId) {
                const habitTracking = newTracking.filter((t) => t.habitId === habit.id)
                const dates = [...new Set(habitTracking.map((t) => t.date))].sort()

                // Simple streak calculation
                let streak = 0
                if (dates.length > 0) {
                  streak = 1
                  for (let i = 1; i < dates.length; i++) {
                    const prevDate = new Date(dates[i - 1])
                    const currDate = new Date(dates[i])
                    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime())
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                    if (diffDays === 1) {
                      streak++
                    } else {
                      streak = 1
                    }
                  }
                }

                return {
                  ...habit,
                  stats: {
                    completedDays: dates.length,
                    streak,
                  },
                }
              }
              return habit
            })
          })

          return newTracking
        })

        toast({
          title: "Habit tracked",
          description: "Your progress has been saved",
        })
      } catch (error: any) {
        toast({
          title: "Error tracking habit",
          description: error.message,
          variant: "destructive",
        })
      }
    },
    [user, session, toast],
  )

  // Untrack a habit
  const untrackHabit = useCallback(
    async (habitId: string, date: string, activityIndex: number, levelIndex: number) => {
      if (!user || !session) return

      try {
        const response = await fetch('/api/habits/tracking', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            habitId,
            date,
            activityIndex,
            levelIndex,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to untrack habit')
        }

        // Remove the tracking from state
        setTracking((prev) =>
          prev.filter(
            (t) =>
              !(
                t.habitId === habitId &&
                t.date === date &&
                t.activityIndex === activityIndex &&
                t.levelIndex === levelIndex
              ),
          ),
        )

        toast({
          title: "Habit untracked",
          description: "The habit tracking has been removed",
        })
      } catch (error: any) {
        toast({
          title: "Error untracking habit",
          description: error.message,
          variant: "destructive",
        })
      }
    },
    [user, session, toast],
  )

  // Get tracked habits for a specific date
  const getTrackedHabits = useCallback(
    (date: string) => {
      return tracking.filter((t) => t.date === date)
    },
    [tracking],
  )

  // Clear all data
  const clearAllData = useCallback(async () => {
    if (!user || !session) return

    try {
      const response = await fetch('/api/habits/clear', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to clear data')
      }

      // Clear state
      setHabits([])
      setTracking([])

      toast({
        title: "Data cleared",
        description: "All your habit data has been removed",
      })
    } catch (error: any) {
      toast({
        title: "Error clearing data",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [user, session, toast])

  return {
    habits,
    tracking,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    trackHabit,
    untrackHabit,
    getTrackedHabits,
    clearAllData,
    refreshHabits: fetchHabits,
    usingCache,
  }
}
