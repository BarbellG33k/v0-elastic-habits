"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, CheckCircle, Plus, User } from "lucide-react"
import { HabitProgress } from "@/components/habit-progress"
import { DailyStreak } from "@/components/daily-streak"
import { RecentActivity } from "@/components/recent-activity"
import { useAuth } from "@/contexts/auth-context"
import { useHabits } from "@/hooks/use-habits"

export default function Home() {
  const { user, isLoading: authLoading } = useAuth()
  const { habits, isLoading: habitsLoading } = useHabits()

  // If not authenticated, show welcome screen
  if (!authLoading && !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Momentum</h1>
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
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-lg text-muted-foreground">Manage your habits and track progress.</p>
        </div>
        <Button asChild variant="outline" size="lg">
          <Link href="/habits/new">Add New Habit</Link>
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-teal-500" />
              Habit Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HabitProgress habits={habits} />
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
            <DailyStreak habits={habits} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5 text-orange-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity habits={habits} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
