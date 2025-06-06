"use client"

import { useEffect, useState } from "react"
import { format, subDays } from "date-fns"
import { useHabits } from "@/hooks/use-habits"

export function DailyStreak() {
  const { getTrackedHabits } = useHabits()
  const [days, setDays] = useState<{ date: string; hasActivity: boolean }[]>([])

  useEffect(() => {
    // Generate the last 7 days
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd")
      const hasActivity = getTrackedHabits(date).length > 0
      return { date, hasActivity }
    })

    setDays(lastSevenDays)
  }, [getTrackedHabits])

  return (
    <div className="flex justify-between items-center w-full">
      {days.map((day, index) => {
        const dayName = format(new Date(day.date), "E")
        const isToday = day.date === format(new Date(), "yyyy-MM-dd")

        return (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground mb-1">{dayName}</div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                ${isToday ? "border-2 border-primary" : ""}
                ${day.hasActivity ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}
              `}
            >
              {format(new Date(day.date), "d")}
            </div>
          </div>
        )
      })}
    </div>
  )
}
