"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Plus, Target, Calendar, BarChart3, User, Settings } from "lucide-react"
import Link from "next/link"

export default function HowToUsePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-4xl py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            How to Use{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Momentum
            </span>
          </h1>
          <p className="text-muted-foreground">Learn how to build flexible habits that stick</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-500" />
              1. Getting Started
            </CardTitle>
            <CardDescription>Create your account and set up your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Sign Up</h4>
                <p className="text-sm text-muted-foreground">
                  Create your free account using email and password, or sign in with Google for quick access.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Profile Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Upload a profile picture or generate an avatar. Customize your settings in the profile page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Understanding Elastic Habits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-purple-500" />
              2. Understanding Elastic Habits
            </CardTitle>
            <CardDescription>The flexible approach to habit building</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What makes habits "elastic"?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Traditional habit trackers use an "all or nothing" approach. Momentum recognizes that life is
                unpredictable and some days you have more energy than others.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">B</span>
                </div>
                <h5 className="font-medium">Bronze Level</h5>
                <p className="text-xs text-muted-foreground">Minimum effort days</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-gray-600 dark:text-gray-400 font-bold text-sm">S</span>
                </div>
                <h5 className="font-medium">Silver Level</h5>
                <p className="text-xs text-muted-foreground">Moderate effort days</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">G</span>
                </div>
                <h5 className="font-medium">Gold Level</h5>
                <p className="text-xs text-muted-foreground">Maximum effort days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creating Your First Habit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5 text-green-500" />
              3. Creating Your First Habit
            </CardTitle>
            <CardDescription>Set up a habit with multiple activities and levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  1
                </Badge>
                <div>
                  <h4 className="font-medium">Navigate to Habits</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "Habits" in the navigation or "Add New Habit" from the dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  2
                </Badge>
                <div>
                  <h4 className="font-medium">Name Your Habit</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose a clear, motivating name like "Exercise" or "Reading".
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  3
                </Badge>
                <div>
                  <h4 className="font-medium">Define Activities</h4>
                  <p className="text-sm text-muted-foreground">
                    Create up to 3 different ways to complete your habit (e.g., "Cardio", "Strength", "Yoga").
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  4
                </Badge>
                <div>
                  <h4 className="font-medium">Set Achievement Levels</h4>
                  <p className="text-sm text-muted-foreground">
                    For each activity, define Bronze, Silver, and Gold levels (e.g., "10 min", "20 min", "30 min").
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Make Bronze level so easy you can't say no, even on your worst days. This keeps your streak alive!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              4. Daily Tracking
            </CardTitle>
            <CardDescription>Log your daily habit completions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Track Today</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Use the "Track Today" button or visit the Track page to log your habits.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Select the activity you completed</li>
                  <li>• Choose your achievement level</li>
                  <li>• See immediate visual feedback</li>
                  <li>• Update or untrack as needed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Track Past Days</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Missed logging yesterday? No problem! You can track past days too.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use the date picker to select any past date</li>
                  <li>• Fill in missed days to maintain accuracy</li>
                  <li>• Your streaks update automatically</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Understanding Your Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-500" />
              5. Understanding Your Progress
            </CardTitle>
            <CardDescription>Monitor your habit-building journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h5 className="font-medium">Daily Streaks</h5>
                <p className="text-xs text-muted-foreground">Track consecutive days of habit completion</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h5 className="font-medium">Progress Charts</h5>
                <p className="text-xs text-muted-foreground">Visual representation of your monthly progress</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h5 className="font-medium">Completion Rates</h5>
                <p className="text-xs text-muted-foreground">See your overall success percentage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips for Success */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-orange-500" />
              6. Tips for Success
            </CardTitle>
            <CardDescription>Make the most of your habit-building journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">✅ Do This</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Start with 1-3 habits maximum</li>
                    <li>• Make Bronze levels ridiculously easy</li>
                    <li>• Track consistently, even if it's just Bronze</li>
                    <li>• Celebrate small wins</li>
                    <li>• Use the flexibility when life gets busy</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">❌ Avoid This</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Don't create too many habits at once</li>
                    <li>• Don't make Bronze levels too challenging</li>
                    <li>• Don't aim for Gold every day</li>
                    <li>• Don't break your streak over perfectionism</li>
                    <li>• Don't forget to track past days if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Get Started */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-4">Ready to Build Better Habits?</h3>
            <p className="text-muted-foreground mb-6">
              Start your journey with flexible, sustainable habit tracking that adapts to your life.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/habits">Create Your First Habit</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/track">Start Tracking</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
