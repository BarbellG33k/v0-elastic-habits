"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import type { Habit, HabitTracking } from "@/types/habit"
import { useToast } from "./use-toast"

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [tracking, setTracking] = useState<HabitTracking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Fetch habits from Supabase
  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([])
      setTracking([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Add timeout to prevent hanging
      const habitsPromise = supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false })

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Habits fetch timeout')), 10000)
      )

      const { data: habitsData, error: habitsError } = await Promise.race([habitsPromise, timeoutPromise]) as any

      if (habitsError) {
        throw habitsError
      }

      // Transform the data to match our Habit type
      const transformedHabits: Habit[] = habitsData.map((habit: any) => ({
        id: habit.id,
        name: habit.name,
        activities: habit.activities,
        createdAt: habit.created_at,
        stats: { completedDays: 0, streak: 0 }, // We'll calculate this from tracking data
      }))

      setHabits(transformedHabits)

      // Fetch tracking data with timeout
      const trackingPromise = supabase
        .from("habit_tracking")
        .select("*")
        .order("date", { ascending: false })

      const trackingTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Tracking fetch timeout')), 10000)
      )

      const { data: trackingData, error: trackingError } = await Promise.race([trackingPromise, trackingTimeoutPromise]) as any

      if (trackingError) {
        throw trackingError
      }

      // Transform the data to match our HabitTracking type
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
    } catch (error: any) {
      // console.log('Habits fetch error:', error)
      toast({
        title: "Error fetching data",
        description: error.message.includes('timeout') ? 'Request timed out. Please try again.' : error.message,
        variant: "destructive",
      })
      // Set empty data on error to prevent infinite loading
      setHabits([])
      setTracking([])
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  // Fetch data when user changes
  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  // Add a new habit
  const addHabit = useCallback(
    async (habit: Omit<Habit, "id" | "createdAt">) => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("habits")
          .insert({
            name: habit.name,
            activities: habit.activities,
            user_id: user.id,
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        // Add the new habit to state
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
    [user, toast],
  )

  // Update an existing habit
  const updateHabit = useCallback(
    async (updatedHabit: Habit) => {
      if (!user) return

      try {
        const { error } = await supabase
          .from("habits")
          .update({
            name: updatedHabit.name,
            activities: updatedHabit.activities,
          })
          .eq("id", updatedHabit.id)

        if (error) {
          throw error
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
    [user, toast],
  )

  // Delete a habit
  const deleteHabit = useCallback(
    async (habitId: string) => {
      if (!user) return

      try {
        const { error } = await supabase.from("habits").delete().eq("id", habitId)

        if (error) {
          throw error
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
    [user, toast],
  )

  // Track a habit
  const trackHabit = useCallback(
    async (trackingData: Omit<HabitTracking, "id">) => {
      if (!user) return

      try {
        const { error } = await supabase.from("habit_tracking").upsert({
          habit_id: trackingData.habitId,
          user_id: user.id,
          date: trackingData.date,
          activity_index: trackingData.activityIndex,
          level_index: trackingData.levelIndex,
          timestamp: new Date().toISOString(),
        })

        if (error) {
          throw error
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
    [user, toast],
  )

  // Untrack a habit
  const untrackHabit = useCallback(
    async (habitId: string, date: string, activityIndex: number, levelIndex: number) => {
      if (!user) return

      try {
        const { error } = await supabase
          .from("habit_tracking")
          .delete()
          .match({
            habit_id: habitId,
            date: date,
            activity_index: activityIndex,
            level_index: levelIndex,
          })

        if (error) {
          throw error
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
    [user, toast],
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
    if (!user) return

    try {
      // Delete all habit tracking
      const { error: trackingError } = await supabase.from("habit_tracking").delete().eq("user_id", user.id)

      if (trackingError) {
        throw trackingError
      }

      // Delete all habits
      const { error: habitsError } = await supabase.from("habits").delete().eq("user_id", user.id)

      if (habitsError) {
        throw habitsError
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
  }, [user, toast])

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
  }
}
