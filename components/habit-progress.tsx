"use client"

import { useEffect, useState } from "react"
import { useHabits } from "@/hooks/use-habits"
import { format, subDays, eachDayOfInterval } from "date-fns"

export function HabitProgress() {
  const { habits, getTrackedHabits } = useHabits()
  const [completionData, setCompletionData] = useState<{ date: string; completion: number }[]>([])

  useEffect(() => {
    // Generate data for the last 30 days
    const endDate = new Date()
    const startDate = subDays(endDate, 29) // 30 days including today

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    const data = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      const trackedHabits = getTrackedHabits(dateStr)

      // Calculate completion rate for this day
      let completionRate = 0
      if (habits.length > 0) {
        // Count unique habits that were tracked that day
        const uniqueHabitsTracked = new Set(trackedHabits.map((t) => t.habitId)).size
        completionRate = (uniqueHabitsTracked / habits.length) * 100
      }

      return {
        date: format(day, "MMM dd"),
        completion: completionRate,
      }
    })

    setCompletionData(data)
  }, [habits, getTrackedHabits])

  // Draw the chart using canvas
  useEffect(() => {
    const canvas = document.getElementById("progress-chart") as HTMLCanvasElement
    if (!canvas || completionData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const width = canvas.width
    const height = canvas.height
    const barWidth = Math.max(2, width / completionData.length - 2)
    const maxValue = 100 // percentage

    // Draw bars
    completionData.forEach((item, index) => {
      const x = index * (barWidth + 2)
      const barHeight = (item.completion / maxValue) * height
      const y = height - barHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height)
      gradient.addColorStop(0, "rgba(124, 58, 237, 0.8)")
      gradient.addColorStop(1, "rgba(124, 58, 237, 0.3)")

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)
    })
  }, [completionData])

  return (
    <div className="w-full h-32">
      <canvas id="progress-chart" width={300} height={120} className="w-full h-full"></canvas>
    </div>
  )
}
