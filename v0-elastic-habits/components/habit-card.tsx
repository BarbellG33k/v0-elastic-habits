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

const levelNames = ["Bronze", "Silver", "Gold"];
const levelBadgeClasses = [
  "bg-amber-600 text-white",   // Bronze
  "bg-slate-400 text-white",   // Silver
  "bg-yellow-400 text-black"    // Gold
];

export default function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{habit.name}</span>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(habit)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={() => onDelete(habit.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex gap-2 mb-1 items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="secondary">Streak: {habit.stats.streak}</Badge>
              <Badge variant="secondary">Completed: {habit.stats.completedDays}</Badge>
            </div>
            <div className="text-sm font-normal text-right whitespace-nowrap">Created {habit.createdAt ? new Date(habit.createdAt).toLocaleDateString() : "-"}</div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habit.activities.map((activity, activityIndex) => (
            <div key={activityIndex} className="space-y-2">
              <h4 className="font-medium">{activity.name}</h4>
              <div className="flex flex-wrap gap-2">
                {activity.levels.map((level, levelIndex) => (
                  <Badge
                    key={levelIndex}
                    className={levelBadgeClasses[levelIndex] + " px-2 py-1 text-xs font-semibold flex items-center gap-1"}
                  >
                    <span>{levelNames[levelIndex]}:</span> <span>{level}</span>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
