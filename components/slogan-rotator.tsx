"use client"

import { useState, useEffect } from "react"
import slogansData from "@/assets/slogans.json"

export function SloganRotator() {
  const [currentSlogan, setCurrentSlogan] = useState("")
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Set initial random slogan
    const randomSlogan = slogansData.slogans[Math.floor(Math.random() * slogansData.slogans.length)]
    setCurrentSlogan(randomSlogan)

    // Rotate slogans every 4 seconds
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        const newSlogan = slogansData.slogans[Math.floor(Math.random() * slogansData.slogans.length)]
        setCurrentSlogan(newSlogan)
        setIsVisible(true)
      }, 300) // Half of transition duration
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-8 flex items-center justify-center">
      <p
        className={`text-lg text-muted-foreground transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        {currentSlogan}
      </p>
    </div>
  )
}
