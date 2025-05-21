"use client"

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Trophy } from "lucide-react"
import { format } from "date-fns"
import { useHabits } from "@/hooks/use-habits"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function TrackPage() {
  const { habits, trackHabit, getTrackedHabits, isLoading } = useHabits()
  const { user } = useAuth()
  const { toast } = useToast()
  const { theme } = useTheme()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [defaultTabs, setDefaultTabs] = useState<Record<string, string>>({})
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy")

  const formattedSelectedDateString = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate])
  const isToday = formattedSelectedDateString === format(new Date(), "yyyy-MM-dd")

  const trackedHabitsForDate = useMemo(
    () => getTrackedHabits(formattedSelectedDateString),
    [getTrackedHabits, formattedSelectedDateString],
  )

  // Set default tabs based on tracked habits
  useEffect(() => {
    const newDefaultTabs: Record<string, string> = {}
    habits.forEach((habit) => {
      const trackedForHabit = trackedHabitsForDate.filter((th) => th.habitId === habit.id)
      if (trackedForHabit.length > 0) {
        // Get the most recently tracked activity for this habit
        const mostRecent = trackedForHabit.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0]

        newDefaultTabs[habit.id] = `activity-${mostRecent.activityIndex}`
      } else {
        // Default to first activity if none tracked
        newDefaultTabs[habit.id] = `activity-0`
      }
    })
    // Only update if newDefaultTabs is actually different to prevent potential loops
    setDefaultTabs((currentDefaultTabs) => {
      if (JSON.stringify(currentDefaultTabs) !== JSON.stringify(newDefaultTabs)) {
        return newDefaultTabs
      }
      return currentDefaultTabs
    })
  }, [habits, trackedHabitsForDate])

  const handleTrackHabit = (habitId: string, activityIndex: number, levelIndex: number) => {
    trackHabit({
      habitId,
      date: formattedSelectedDateString,
      activityIndex,
      levelIndex,
      timestamp: new Date().toISOString(),
    })
  }

  const getLevelColor = (levelIndex: number) => {
    switch (levelIndex) {
      case 0:
        return "bg-amber-600 hover:bg-amber-700"
      case 1:
        return "bg-slate-400 hover:bg-slate-500"
      case 2:
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return ""
    }
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

  // If not authenticated, redirect to sign in
  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">Please sign in to track your habits</p>
            <Button asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-5xl py-6 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Track Your Habits</h1>
          <p className="text-muted-foreground flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {formattedDate} {isToday && <Badge className="ml-2">Today</Badge>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}>
            Previous Day
          </Button>
          <Button onClick={() => setSelectedDate(new Date())} disabled={isToday}>
            Today
          </Button>
          <Button
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 86400000))}
            disabled={
              format(new Date(selectedDate.getTime() + 86400000), "yyyy-MM-dd") > format(new Date(), "yyyy-MM-dd")
            }
          >
            Next Day
          </Button>
        </div>
      </header>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">You don't have any habits to track yet</p>
            <Button asChild>
              <Link href="/habits" className="btn btn-default">Create Your First Habit</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {habits.map((habit) => {
            const trackedActivities = trackedHabitsForDate.filter((th) => th.habitId === habit.id)

            return (
              <Card key={habit.id}>
                <CardHeader className="pb-3">
                  <CardTitle>{habit.name}</CardTitle>
                  <CardDescription>Select an activity and level to track</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={defaultTabs[habit.id] || `activity-0`} className="w-full">
                    <TabsList className="w-full justify-start mb-4">
                      {habit.activities.map(
                        (activity, activityIndex) =>
                          activity.name && (
                            <TabsTrigger key={activityIndex} value={`activity-${activityIndex}`} className="flex-1">
                              {activity.name}
                              {trackedActivities.some((ta) => ta.activityIndex === activityIndex) && (
                                <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
                              )}
                            </TabsTrigger>
                          ),
                      )}
                    </TabsList>

                    {habit.activities.map(
                      (activity, activityIndex) =>
                        activity.name && (
                          <TabsContent key={activityIndex} value={`activity-${activityIndex}`}>
                            <div className="grid grid-cols-3 gap-4">
                              {activity.levels.map(
                                (level, levelIndex) =>
                                  level && (
                                    <div key={levelIndex} className="text-center">
                                      <Button
                                        className={`w-full h-24 flex flex-col items-center justify-center ${getLevelColor(levelIndex)} ${
                                          trackedActivities.some(
                                            (ta) => ta.activityIndex === activityIndex && ta.levelIndex === levelIndex,
                                          )
                                            ? theme === "dark"
                                              ? "ring-2 ring-gray-300"
                                              : "ring-2 ring-black"
                                            : ""
                                        }`}
                                        onClick={() => handleTrackHabit(habit.id, activityIndex, levelIndex)}
                                        disabled={trackedActivities.some(
                                          (ta) => ta.activityIndex === activityIndex && ta.levelIndex === levelIndex,
                                        )}
                                      >
                                        <Trophy className="h-6 w-6 mb-2" />
                                        <div className="font-medium">{getLevelName(levelIndex)}</div>
                                        <div className="text-xs">{level}</div>
                                      </Button>
                                    </div>
                                  ),
                              )}
                            </div>
                          </TabsContent>
                        ),
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
