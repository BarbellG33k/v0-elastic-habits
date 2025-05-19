"use client"

import { useEffect, useRef } from "react"

export function HabitProgress() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Sample data - in a real app, this would come from your habit tracking data
    const data = [
      0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4, 0.8, 0.9, 0.7, 0.6, 0.8, 0.9, 0.5, 0.3, 0.7, 0.8, 0.9, 0.6, 0.7, 0.8, 0.9, 0.7,
      0.6, 0.5, 0.4, 0.8, 0.9, 0.7, 0.6,
    ]

    const width = canvas.width
    const height = canvas.height
    const barWidth = width / data.length - 1

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw bars
    data.forEach((value, index) => {
      const x = index * (barWidth + 1)
      const barHeight = value * height
      const y = height - barHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height)
      gradient.addColorStop(0, "rgba(124, 58, 237, 0.8)")
      gradient.addColorStop(1, "rgba(124, 58, 237, 0.3)")

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)
    })
  }, [])

  return (
    <div className="w-full h-32">
      <canvas ref={canvasRef} width={300} height={120} className="w-full h-full"></canvas>
    </div>
  )
}
