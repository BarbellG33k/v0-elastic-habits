"use client"

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Trophy } from "lucide-react"
import { addDays, subDays } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import { useHabits } from "@/hooks/use-habits"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRecentActivity } from "@/hooks/use-recent-activity"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import "@/styles/track.css"

export default function TrackPage() {
  const { habits, trackHabit, untrackHabit, isLoading: habitsLoading } = useHabits()
  const { 
    recentTracking, 
    getTrackedHabits, 
    isLoading: recentActivityLoading 
  } = useRecentActivity()
  const { user } = useAuth()
  const { toast } = useToast()
  const { theme } = useTheme()
  const [userTimeZone, setUserTimeZone] = useState("UTC");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  
  const [defaultTabs, setDefaultTabs] = useState<Record<string, string>>({})
  const [untrackingHabit, setUntrackingHabit] = useState<{
    habitId: string;
    activityIndex: number;
    levelIndex: number;
  } | null>(null)

  useEffect(() => {
    setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const formattedDate = useMemo(() => {
    return formatInTimeZone(selectedDate, userTimeZone, "EEEE, MMMM d, yyyy")
  }, [selectedDate, userTimeZone]);

  const formattedSelectedDateString = useMemo(() => {
    return formatInTimeZone(selectedDate, userTimeZone, "yyyy-MM-dd")
  }, [selectedDate, userTimeZone]);

  const todayString = useMemo(() => {
    return formatInTimeZone(new Date(), userTimeZone, "yyyy-MM-dd")
  }, [userTimeZone]);

  const isToday = formattedSelectedDateString === todayString;

  const trackedHabitsForDate = useMemo(
    () => getTrackedHabits(formattedSelectedDateString),
    [getTrackedHabits, formattedSelectedDateString, recentTracking],
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
  }, [habits, trackedHabitsForDate, recentTracking])

  const handleTrackHabit = (habitId: string, activityIndex: number, levelIndex: number) => {
    // Check if any level is already selected for this activity
    const isActivityTracked = trackedHabitsForDate.some(
      (th) => th.habitId === habitId && th.activityIndex === activityIndex
    );

    if (isActivityTracked) {
      toast({
        title: "Cannot select multiple levels",
        description: "Please untrack the current level before selecting a new one.",
        variant: "destructive",
      });
      return;
    }

    trackHabit({
      habitId,
      date: formattedSelectedDateString,
      activityIndex,
      levelIndex,
      timestamp: new Date().toISOString(),
    })
  }

  const handleUntrackHabit = () => {
    if (!untrackingHabit) return;

    untrackHabit(
      untrackingHabit.habitId,
      formattedSelectedDateString,
      untrackingHabit.activityIndex,
      untrackingHabit.levelIndex
    );
    setUntrackingHabit(null);
  }

  const getLevelClasses = (levelIndex: number, isSelected: boolean, isActivityTracked: boolean) => {
    const baseClass = 'level-button';
    const levelClass = {
      0: 'level-button-bronze',
      1: 'level-button-silver',
      2: 'level-button-gold',
    }[levelIndex] || '';

    // If this level is selected (tracked), it should always be bright
    if (isSelected) {
      return `${baseClass} ${levelClass} selected`;
    }

    // If another level is tracked for this activity, this one should be disabled
    if (isActivityTracked) {
      return `${baseClass} ${levelClass} disabled`;
    }

    // Otherwise, show normal unselected state
    return `${baseClass} ${levelClass}`;
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
  if (habitsLoading || recentActivityLoading) {
    return (
      <div className="container max-w-5xl py-6 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-muted-foreground">Loading your habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-6">
      <AlertDialog open={!!untrackingHabit} onOpenChange={(open) => !open && setUntrackingHabit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Untrack Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to untrack this habit? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUntrackHabit}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Track Your Habits</h1>
          <span className="text-muted-foreground flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {formattedDate} {isToday && <Badge className="ml-2">Today</Badge>}
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
            Previous Day
          </Button>
          <Button onClick={() => setSelectedDate(new Date())} disabled={isToday}>
            Today
          </Button>
          <Button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            disabled={
              formatInTimeZone(addDays(selectedDate, 1), userTimeZone, "yyyy-MM-dd") > todayString
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
              <Link href="/habits">Create Your First Habit</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {habits.map((habit) => {
            const trackedActivities = trackedHabitsForDate.filter((th) => th.habitId === habit.id)

            return (
              <Card key={habit.id} className="habit-card">
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
                            <TabsTrigger 
                              key={activityIndex} 
                              value={`activity-${activityIndex}`} 
                              className="activity-tab"
                            >
                              {activity.name}
                              {trackedActivities.some((ta) => ta.activityIndex === activityIndex) && (
                                <CheckCircle2 className="activity-tab-completed h-4 w-4" />
                              )}
                            </TabsTrigger>
                          ),
                      )}
                    </TabsList>

                    {habit.activities.map(
                      (activity, activityIndex) =>
                        activity.name && (
                          <TabsContent key={activityIndex} value={`activity-${activityIndex}`}>
                            <div className="levels-grid">
                              {activity.levels.map(
                                (level, levelIndex) =>
                                  level && (
                                    <div key={levelIndex} className="text-center">
                                      <Button
                                        className={getLevelClasses(
                                          levelIndex,
                                          trackedActivities.some(
                                            (ta) => ta.activityIndex === activityIndex && ta.levelIndex === levelIndex
                                          ),
                                          trackedActivities.some(
                                            (ta) => ta.activityIndex === activityIndex && ta.levelIndex !== levelIndex
                                          )
                                        )}
                                        onClick={() => {
                                          const isTracked = trackedActivities.some(
                                            (ta) => ta.activityIndex === activityIndex && ta.levelIndex === levelIndex
                                          );
                                          if (isTracked) {
                                            setUntrackingHabit({
                                              habitId: habit.id,
                                              activityIndex,
                                              levelIndex,
                                            });
                                          } else {
                                            handleTrackHabit(habit.id, activityIndex, levelIndex);
                                          }
                                        }}
                                        disabled={
                                          !trackedActivities.some(
                                            (ta) => ta.activityIndex === activityIndex && ta.levelIndex === levelIndex
                                          ) && 
                                          trackedActivities.some(
                                            (ta) => ta.activityIndex === activityIndex
                                          )
                                        }
                                      >
                                        <Trophy className="trophy-icon" />
                                        <div className="level-name">{getLevelName(levelIndex)}</div>
                                        <div className="level-description">{level}</div>
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
