"use client"

import { useState, useEffect } from "react"

type ReminderSettings = {
  enabled: boolean
  time: string // in 24-hour format, e.g., "17:00"
}

export function useReminderSettings() {
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: true,
    time: "17:00", // Default to 5:00 PM
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("habit-reminder-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse reminder settings", e)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings: Partial<ReminderSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem("habit-reminder-settings", JSON.stringify(updatedSettings))
  }

  return {
    settings,
    updateSettings,
  }
}
