"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Calendar, CheckCircle, Plus, User } from "lucide-react"
import { HabitInsights } from "@/components/habit-insights"
import { DailyStreak } from "@/components/daily-streak"
import { RecentActivity } from "@/components/recent-activity"
import { AboutSection } from "@/components/about-section"
import { useAuth } from "@/contexts/auth-context"
import { useHabits } from "@/hooks/use-habits"
import { useStreaks } from "@/hooks/use-streaks"
import { SloganRotator } from "@/components/slogan-rotator"
import HabitCard from '@/components/habit-card'

export default function Home() {
  const { user, isLoading: authLoading } = useAuth()
  
  // Only call useHabits when we have a user
  const { habits, isLoading: habitsLoading } = useHabits()
  const { streaksTracking } = useStreaks()

  // If auth is still loading, show loading state
  if (authLoading) {
    return (
      <div className="container max-w-5xl py-6 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show sign in prompt
  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-6">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                Elastic Habits
              </span>
            </h1>
            <SloganRotator intervalMs={15000} />
          </div>
          <Link href="/auth/sign-in">
            <Button>Sign In</Button>
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Flexible Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Choose from 9 different options per habit, adapting to your daily capacity.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Daily Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Build momentum with daily streaks and visualize your progress over time.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-purple-500" />
                User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Access your habits from any device with secure cloud storage.</p>
            </CardContent>
          </Card>
        </div>

        <AboutSection />
      </div>
    )
  }

  // If habits are still loading (user is authenticated), show loading state
  if (habitsLoading) {
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
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Elastic Habits
            </span>
          </h1>
          <SloganRotator intervalMs={15000} />
        </div>
        <Link href="/track">
          <Button>
            Track Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Habits Overview
            </CardTitle>
            <CardDescription>Your active habits <span className="text-xs opacity-75">*365 days</span></CardDescription>
          </CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">You don't have any habits yet</p>
                <Link href="/habits">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Habit
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.slice(0, 3).map((habit) => {
                  // Calculate completed days using 365-day streaks data
                  const habitTracking = streaksTracking.filter(t => t.habitId === habit.id)
                  const uniqueDays = new Set(habitTracking.map(t => t.date)).size
                  
                  return (
                    <div key={habit.id} className="flex justify-between items-center">
                      <span className="font-medium">{habit.name}</span>
                      <span className="text-sm text-muted-foreground">{uniqueDays} days</span>
                    </div>
                  )
                })}
                <Link href="/habits">
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    {habits.length > 3 ? "View All Habits" : "Add New Habit"}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Current Streak
            </CardTitle>
            <CardDescription>Your daily activity</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyStreak />
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold">
                {(() => {
                  if (habits.length === 0 || streaksTracking.length === 0) return 0;
                  
                  // Calculate the maximum streak across all habits using streaks data
                  const habitStreaks = habits.map(habit => {
                    const habitTracking = streaksTracking.filter(t => t.habitId === habit.id)
                    const dates = [...new Set(habitTracking.map(t => t.date))].sort()
                    
                    let maxStreak = 0
                    let currentStreak = 0
                    
                    for (let i = dates.length - 1; i >= 0; i--) {
                      if (i === dates.length - 1) {
                        currentStreak = 1
                      } else {
                        const prevDate = new Date(dates[i + 1])
                        const currDate = new Date(dates[i])
                        const diffTime = Math.abs(prevDate.getTime() - currDate.getTime())
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                        
                        if (diffDays === 1) {
                          currentStreak++
                        } else {
                          maxStreak = Math.max(maxStreak, currentStreak)
                          currentStreak = 1
                        }
                      }
                    }
                    
                    return Math.max(maxStreak, currentStreak)
                  })
                  
                  return Math.max(...habitStreaks, 0)
                })()} Days
              </div>
              <div className="text-sm text-muted-foreground">Current streak <span className="text-xs opacity-75">*365 days</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-500" />
              Insights
            </CardTitle>
            <CardDescription>Your activity highlights <span className="text-xs opacity-75">*90 days</span></CardDescription>
          </CardHeader>
          <CardContent>
            <HabitInsights />
          </CardContent>
        </Card>
      </div>

      {habits.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
                              <CardTitle>Recent Activity <span className="text-xs text-muted-foreground">*last 7 days</span></CardTitle>
                              <CardDescription>Your habit completions from the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
