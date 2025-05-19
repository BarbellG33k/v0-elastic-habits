"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import type { Habit } from "@/types/habit"

interface HabitCardProps {
  habit: Habit
  onEdit?: (habit: Habit) => void
  onDelete?: (habitId: string) => void
}

export function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{habit.name}</CardTitle>
          <div className="flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(habit)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={() => onDelete(habit.id)}>
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
        <CardDescription>Created {new Date(habit.createdAt).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habit.activities.map(
            (activity, activityIndex) =>
              activity.name && (
                <div key={activityIndex} className="space-y-2">
                  <div className="font-medium">{activity.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {activity.levels.map(
                      (level, levelIndex) =>
                        level && (
                          <Badge key={levelIndex} variant="outline" className="flex gap-1 items-center">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                levelIndex === 0 ? "bg-amber-600" : levelIndex === 1 ? "bg-slate-400" : "bg-yellow-500"
                              }`}
                            ></span>
                            <span>
                              {levelIndex === 0 ? "Bronze" : levelIndex === 1 ? "Silver" : "Gold"}: {level}
                            </span>
                          </Badge>
                        ),
                    )}
                  </div>
                </div>
              ),
          )}
        </div>
      </CardContent>
    </Card>
  )
}
