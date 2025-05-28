'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, LineChart, ListTodo, Target, Trophy } from "lucide-react";
import Link from "next/link";

export default function HowToUse() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          How to Use{" "}
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Momentum
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your guide to building lasting habits with flexibility and consistency
        </p>
      </div>

      <div className="space-y-8">
        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Target className="mr-2 h-6 w-6 text-purple-500" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Momentum is designed to help you build habits that last. Our approach is based on flexibility
              and realistic goal-setting, making it easier to maintain consistency even when life gets busy.
            </p>
            <div className="pl-4 border-l-2 border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold mb-2">Quick Start Steps:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Create an account or sign in</li>
                <li>Add your first habit</li>
                <li>Define activities and levels</li>
                <li>Start tracking daily</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Understanding Elastic Habits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
              Understanding Elastic Habits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Elastic habits are flexible goals that adapt to your daily capacity. Instead of rigid "all or
              nothing" goals, you can choose from different levels of achievement each day.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Mini Level</h4>
                <p className="text-sm">
                  A small but meaningful step. Perfect for busy days or when getting started.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Plus Level</h4>
                <p className="text-sm">
                  The standard goal. A solid achievement that builds consistent progress.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Elite Level</h4>
                <p className="text-sm">
                  Going above and beyond. For days when you have extra time and energy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creating Habits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <ListTodo className="mr-2 h-6 w-6 text-blue-500" />
              Creating Habits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              When creating a new habit, you'll define three key components:
            </p>
            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2">1. Core Habit</h3>
                <p>Choose a specific, measurable action you want to turn into a habit.</p>
              </div>
              <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2">2. Activities</h3>
                <p>Define up to three different ways to practice your habit. This provides variety and flexibility.</p>
              </div>
              <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2">3. Levels</h3>
                <p>Set mini, plus, and elite targets for each activity, creating nine total options for daily achievement.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <LineChart className="mr-2 h-6 w-6 text-orange-500" />
              Daily Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Tracking your habits is simple and flexible:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Visit the tracking page daily to log your achievements
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Choose any combination of activities and levels that match your day
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                View your progress and streaks to stay motivated
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Adjust your goals as needed to maintain consistency
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Success Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
              Success Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Start Small</h3>
                <p>Begin with mini levels and gradually increase as you build consistency.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Be Flexible</h3>
                <p>Adapt your targets to match your energy and available time each day.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Track Daily</h3>
                <p>Regular tracking helps build awareness and maintain momentum.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Celebrate Progress</h3>
                <p>Every achievement counts, no matter how small. Celebrate your wins!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="flex justify-center gap-4 mt-12">
          <Button asChild size="lg">
            <Link href="/habits">
              Create a Habit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/track">Start Tracking</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 