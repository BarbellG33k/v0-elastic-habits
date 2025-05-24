"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Coffee, Heart, Save, Trash2 } from "lucide-react"
import { useHabits } from "@/hooks/use-habits"
import { ReminderSettings } from "@/components/reminder-settings" // Import the new component

export default function SettingsPage() {
  const { toast } = useToast()
  const { clearAllData } = useHabits()
  const [settings, setSettings] = useState({
    notifications: true,
    reminderTime: "20:00",
    darkMode: false,
    dataRetention: "90",
  })

  const handleSaveSettings = () => {
    // In a real app, we would save these settings to localStorage or a database
    localStorage.setItem("habitSettings", JSON.stringify(settings))

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    })

    // Request notification permission if enabled
    if (settings.notifications && "Notification" in window) {
      Notification.requestPermission()
    }
  }

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all your habit data? This action cannot be undone.")) {
      clearAllData()
      toast({
        title: "Data cleared",
        description: "All your habit data has been removed.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-2xl py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Replace the old notifications card with our new ReminderSettings component */}
        <ReminderSettings />

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your habit tracking data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data-retention">Data Retention</Label>
              <Select
                value={settings.dataRetention}
                onValueChange={(value) => setSettings({ ...settings, dataRetention: value })}
              >
                <SelectTrigger id="data-retention">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="0">Forever</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">How long to keep your habit tracking history</p>
            </div>

            <div className="pt-4">
              <Button variant="destructive" onClick={handleClearData}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will permanently delete all your habits and tracking history
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Support This Project
            </CardTitle>
            <CardDescription>Help us keep Momentum free and improve it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Momentum is a free, open-source project. If you find it useful, please consider supporting its
              development.
            </p>
            <div className="flex justify-center">
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <a href="https://www.buymeacoffee.com/momentum" target="_blank" rel="noopener noreferrer">
                  <Coffee className="h-5 w-5" />
                  Buy me a coffee
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSaveSettings} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
