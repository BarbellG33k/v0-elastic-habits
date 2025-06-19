"use client"

import { useEffect, useState } from "react"
import { useHabits } from "@/hooks/use-habits"
import { format, parseISO } from "date-fns"
import type { Habit } from "@/types/habit"

type ActivityItem = {
  date: string
  habit: Habit
  activityIndex: number
  levelIndex: number
  timestamp: string
}

export function RecentActivity() {
  const { habits, tracking } = useHabits()
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])

  useEffect(() => {
    if (!habits.length || !tracking.length) return

    // Get the most recent tracking entries sorted by activity date, then timestamp as tiebreaker
    const sortedTracking = [...tracking]
      .sort((a, b) => {
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime()
        if (dateComparison !== 0) return dateComparison
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
      .slice(0, 10) // Get the 10 most recent entries

    // Map tracking data to include habit details
    const activityItems = sortedTracking
      .map((track) => {
        const habit = habits.find((h) => h.id === track.habitId)
        if (!habit) return null

        return {
          date: track.date,
          habit,
          activityIndex: track.activityIndex,
          levelIndex: track.levelIndex,
          timestamp: track.timestamp,
        }
      })
      .filter(Boolean) as ActivityItem[]

    setRecentActivity(activityItems)
  }, [habits, tracking])

  const formatRelativeDate = (dateStr: string) => {
    const today = format(new Date(), "yyyy-MM-dd")
    const yesterday = format(new Date(new Date().setDate(new Date().getDate() - 1)), "yyyy-MM-dd")

    if (dateStr === today) return "Today"
    if (dateStr === yesterday) return "Yesterday"

    // For other dates, return the formatted date
    return format(parseISO(dateStr), "MMM d")
  }

  const getLevelName = (levelIndex: number) => {
    switch (levelIndex) {
      case 0:
        return "Bronze"
      case 1:
        return "Silver"
      case 2:
        return "Gold"
      default:
        return ""
    }
  }

  if (recentActivity.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Start tracking your habits to see your recent activity here
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentActivity.map((item, index) => {
        const activity = item.habit.activities[item.activityIndex]
        const level = activity?.levels[item.levelIndex]

        return (
          <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
            <div>
              <div className="font-medium">{item.habit.name}</div>
              <div className="text-sm text-muted-foreground">
                {activity?.name} • {getLevelName(item.levelIndex)} ({level})
              </div>
            </div>
            <div className="text-sm text-muted-foreground">{formatRelativeDate(item.date)}</div>
          </div>
        )
      })}
    </div>
  )
}
