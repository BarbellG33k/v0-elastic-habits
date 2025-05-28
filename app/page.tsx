"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Calendar, CheckCircle, Plus, User } from "lucide-react"
import { HabitProgress } from "@/components/habit-progress"
import { DailyStreak } from "@/components/daily-streak"
import { RecentActivity } from "@/components/recent-activity"
import { AboutSection } from "@/components/about-section"
import { useAuth } from "@/contexts/auth-context"
import { useHabits } from "@/hooks/use-habits"
import { SloganRotator } from "@/components/SloganRotator"

export default function Home() {
  const { user, isLoading: authLoading } = useAuth()
  const { habits, isLoading: habitsLoading } = useHabits()

  // If not authenticated, show welcome screen
  if (!authLoading && !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Momentum
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Track your habits with flexibility. Define 3 different activities with 3 levels each per habit.
          </p>
          <div className="flex gap-4 mt-6">
            <Button asChild size="lg">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
          <Button asChild variant="link" size="lg" className="text-muted-foreground hover:text-primary">
            <Link href="/how-to-use">
              Show me how to use the app
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <SloganRotator />
        </div>

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

  // Loading state
  if (authLoading || habitsLoading) {
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
          <p className="text-muted-foreground">Track your habits with flexibility</p>
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
            <CardDescription>Your active habits</CardDescription>
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
                {habits.slice(0, 3).map((habit) => (
                  <div key={habit.id} className="flex justify-between items-center">
                    <span className="font-medium">{habit.name}</span>
                    <span className="text-sm text-muted-foreground">{habit.stats.completedDays} days</span>
                  </div>
                ))}
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
                {habits.length > 0 ? Math.max(...habits.map((h) => h.stats.streak)) : 0} Days
              </div>
              <div className="text-sm text-muted-foreground">Current streak</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-500" />
              Progress
            </CardTitle>
            <CardDescription>Monthly completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <HabitProgress />
            <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
              <div>
                <div className="font-medium">
                  {habits.length > 0
                    ? Math.round(
                        (habits.reduce((sum, h) => sum + h.stats.completedDays, 0) / (habits.length * 30)) * 100,
                      )
                    : 0}
                  %
                </div>
                <div className="text-muted-foreground">Completion</div>
              </div>
              <div>
                <div className="font-medium">{habits.reduce((sum, h) => sum + h.stats.completedDays, 0)}</div>
                <div className="text-muted-foreground">Active days</div>
              </div>
              <div>
                <div className="font-medium">{habits.length}</div>
                <div className="text-muted-foreground">Habits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {habits.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your habit completions in the last 7 days</CardDescription>
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
