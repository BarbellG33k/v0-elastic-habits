"use client"

import { useEffect, useState } from "react"
import { useHabits } from "@/hooks/use-habits"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useAuth } from "@/contexts/auth-context"

/**
 * Component that checks for untracked habits at 5:00 PM and shows a reminder toast
 * This component should be added to the layout or a component that's always rendered
 */
export function HabitReminder() {
  const { habits, getTrackedHabits } = useHabits()
  const { toast } = useToast()
  const { user } = useAuth()
  const [hasShownTodayReminder, setHasShownTodayReminder] = useState(false)

  useEffect(() => {
    // Only run for authenticated users
    if (!user) return

    // Check if we've already shown the reminder today
    const checkReminderShown = () => {
      const today = format(new Date(), "yyyy-MM-dd")
      const reminderShownKey = `habit-reminder-shown-${today}`

      // Check localStorage to see if we've shown the reminder today
      const hasShown = localStorage.getItem(reminderShownKey) === "true"
      setHasShownTodayReminder(hasShown)
      return hasShown
    }

    // Initial check
    checkReminderShown()

    // Function to check time and show reminder if needed
    const checkTimeAndShowReminder = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const today = format(now, "yyyy-MM-dd")

      // Check if it's 5:00 PM (17:00)
      if (currentHour === 17 && currentMinute === 0) {
        // Check if we've already shown the reminder today
        if (checkReminderShown()) return

        // Get tracked habits for today
        const trackedHabits = getTrackedHabits(today)
        const trackedHabitIds = new Set(trackedHabits.map((t) => t.habitId))

        // Find untracked habits
        const untrackedHabits = habits.filter((habit) => !trackedHabitIds.has(habit.id))

        // If there are untracked habits, show a reminder
        if (untrackedHabits.length > 0) {
          toast({
            title: "Habit Reminder",
            description: `You have ${untrackedHabits.length} habit${untrackedHabits.length > 1 ? "s" : ""} that ${untrackedHabits.length > 1 ? "haven't" : "hasn't"} been tracked today.`,
            duration: Number.POSITIVE_INFINITY, // Don't auto-dismiss
            action: (
              <button
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs"
                onClick={() => {
                  // Mark as shown for today
                  const reminderShownKey = `habit-reminder-shown-${today}`
                  localStorage.setItem(reminderShownKey, "true")
                  setHasShownTodayReminder(true)
                }}
              >
                Dismiss
              </button>
            ),
          })
        }
      }
    }

    // Check every minute
    const intervalId = setInterval(checkTimeAndShowReminder, 60000)

    // Also check immediately in case the component mounts right at 5:00 PM
    checkTimeAndShowReminder()

    return () => clearInterval(intervalId)
  }, [habits, getTrackedHabits, toast, user])

  // This component doesn't render anything visible
  return null
}
