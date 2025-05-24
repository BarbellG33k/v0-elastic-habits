"use client"

import { useReminderSettings } from "@/hooks/use-reminder-settings"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

export function ReminderSettings() {
  const { settings, updateSettings } = useReminderSettings()

  // Generate time options (every 30 minutes)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      const value = `${formattedHour}:${formattedMinute}`

      // Format for display (12-hour clock with AM/PM)
      let displayHour = hour % 12
      if (displayHour === 0) displayHour = 12
      const period = hour < 12 ? "AM" : "PM"
      const displayValue = `${displayHour}:${formattedMinute} ${period}`

      timeOptions.push({ value, display: displayValue })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Habit Reminders
        </CardTitle>
        <CardDescription>Configure reminders to help you stay on track</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reminder-enabled">Daily Reminders</Label>
            <p className="text-sm text-muted-foreground">Receive a reminder if you haven't tracked all habits</p>
          </div>
          <Switch
            id="reminder-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSettings({ enabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reminder-time">Reminder Time</Label>
          <Select
            value={settings.time}
            onValueChange={(value) => updateSettings({ time: value })}
            disabled={!settings.enabled}
          >
            <SelectTrigger id="reminder-time">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
