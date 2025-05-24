"use client"

import { useEffect, useState } from "react"
import { useHabits } from "@/hooks/use-habits"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useAuth } from "@/contexts/auth-context"
import { useReminderSettings } from "@/hooks/use-reminder-settings"
import { Bell } from "lucide-react"
import Link from "next/link"

/**
 * Enhanced version of the habit reminder with configurable time and more features
 */
export function EnhancedHabitReminder() {
  const { habits, getTrackedHabits } = useHabits()
  const { toast } = useToast()
  const { user } = useAuth()
  const { settings } = useReminderSettings()
  const [hasShownTodayReminder, setHasShownTodayReminder] = useState(false)

  useEffect(() => {
    // Only run for authenticated users and if reminders are enabled
    if (!user || !settings.enabled) return

    // Parse the reminder time
    const [reminderHour, reminderMinute] = settings.time.split(":").map(Number)

    // Check if we've already shown the reminder today
    const checkReminderShown = () => {
      const today = format(new Date(), "yyyy-MM-dd")
      const reminderShownKey = `habit-reminder-shown-${today}`

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

      // Check if it's reminder time
      if (currentHour === reminderHour && currentMinute === reminderMinute) {
        // Check if we've already shown the reminder today
        if (checkReminderShown()) return

        // Get tracked habits for today
        const trackedHabits = getTrackedHabits(today)

        // Create a map of habit IDs to their tracked activities
        const trackedActivitiesMap = new Map()
        trackedHabits.forEach((t) => {
          if (!trackedActivitiesMap.has(t.habitId)) {
            trackedActivitiesMap.set(t.habitId, new Set())
          }
          trackedActivitiesMap.get(t.habitId).add(t.activityIndex)
        })

        // Find habits with untracked activities
        const untrackedHabits = habits.filter((habit) => {
          // If no activities tracked for this habit at all
          if (!trackedActivitiesMap.has(habit.id)) return true

          // Check if all activities are tracked
          const trackedActivities = trackedActivitiesMap.get(habit.id)
          const totalActivities = habit.activities.filter((a) => a.name.trim() !== "").length
          return trackedActivities.size < totalActivities
        })

        // If there are untracked habits, show a reminder
        if (untrackedHabits.length > 0) {
          toast({
            title: "Habit Reminder",
            description: `You have ${untrackedHabits.length} habit${untrackedHabits.length > 1 ? "s" : ""} with untracked activities today.`,
            duration: Number.POSITIVE_INFINITY, // Don't auto-dismiss
            action: (
              <div className="flex gap-2">
                <Link href="/track">
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs">
                    Track Now
                  </button>
                </Link>
                <button
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-8 rounded-md px-3 text-xs"
                  onClick={() => {
                    // Mark as shown for today
                    const reminderShownKey = `habit-reminder-shown-${today}`
                    localStorage.setItem(reminderShownKey, "true")
                    setHasShownTodayReminder(true)
                  }}
                >
                  Dismiss
                </button>
              </div>
            ),
            icon: <Bell className="h-5 w-5 text-blue-500" />,
          })
        }
      }
    }

    // Check every minute
    const intervalId = setInterval(checkTimeAndShowReminder, 60000)

    // Also check immediately in case the component mounts right at reminder time
    checkTimeAndShowReminder()

    return () => clearInterval(intervalId)
  }, [habits, getTrackedHabits, toast, user, settings])

  // This component doesn't render anything visible
  return null
}
