"use client"

import { useEffect, useState } from "react"
import { subDays } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import { useRecentActivity } from "@/hooks/use-recent-activity"

export function DailyStreak() {
  const { getTrackedHabits, recentTracking } = useRecentActivity()
  const [days, setDays] = useState<{ date: string; hasActivity: boolean }[]>([])
  const [todayDate, setTodayDate] = useState<string>("")

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const today = new Date()
    
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i)
      const dateStr = formatInTimeZone(date, userTimeZone, "yyyy-MM-dd")
      const hasActivity = getTrackedHabits(dateStr).length > 0
      return { date: dateStr, hasActivity }
    })
    
    setDays(lastSevenDays)
    setTodayDate(formatInTimeZone(today, userTimeZone, "yyyy-MM-dd"))
    
  }, [getTrackedHabits, recentTracking])

  return (
    <div className="flex justify-between items-center w-full">
      {days.map((day, index) => {
        const dayDate = new Date(`${day.date}T00:00:00`)
        const dayName = formatInTimeZone(dayDate, "UTC", "E")
        const dayOfMonth = formatInTimeZone(dayDate, "UTC", "d")
        const isToday = day.date === todayDate

        return (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground mb-1">{dayName}</div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                ${isToday ? "border-2 border-primary" : ""}
                ${day.hasActivity ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}
              `}
            >
              {dayOfMonth}
            </div>
          </div>
        )
      })}
    </div>
  )
}
