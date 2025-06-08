"use client"

import { useHabits } from "@/hooks/use-habits"
import { Trophy } from "lucide-react"
import type { Habit, HabitTracking } from "@/types/habit"

interface ActivityInsight {
  name: string
  habitName: string
  count: number
  level: string
}

export function HabitInsights() {
  const { habits, tracking } = useHabits()

  // Calculate active days in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const recentTracking = tracking.filter(t => 
    new Date(t.date) >= thirtyDaysAgo
  )
  
  const activeDays = new Set(recentTracking.map(t => t.date)).size

  // Calculate top activities by level in the last 30 days
  const activityStats: Record<string, ActivityInsight> = {}
  
  recentTracking.forEach(track => {
    const habit = habits.find(h => h.id === track.habitId)
    if (!habit || !habit.activities[track.activityIndex]) return
    
    const activity = habit.activities[track.activityIndex]
    // Map level index to level name instead of using the detailed criteria
    const levelNames = ['Bronze', 'Silver', 'Gold']
    const level = levelNames[track.levelIndex] || 'Unknown'
    const key = `${habit.name}-${activity.name}-${level}`
    
    if (!activityStats[key]) {
      activityStats[key] = {
        name: activity.name,
        habitName: habit.name,
        count: 0,
        level: level
      }
    }
    activityStats[key].count++
  })

  // Get top 3 gold activities
  const goldActivities = Object.values(activityStats)
    .filter(stat => stat.level.toLowerCase().includes('gold'))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  // Get top 3 overall activities if no gold, or if we want to show more
  const topActivities = Object.values(activityStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  // Count total gold achievements in last month
  const totalGoldCount = Object.values(activityStats)
    .filter(stat => stat.level.toLowerCase().includes('gold'))
    .reduce((sum, stat) => sum + stat.count, 0)

  const getRankIcon = (index: number) => {
    if (index === 0) return <span className="text-lg">🥇</span>
    if (index === 1) return <span className="text-lg">🥈</span>
    if (index === 2) return <span className="text-lg">🥉</span>
    return null
  }

  const getLevelColor = (level: string) => {
    if (level.toLowerCase().includes('gold')) return 'text-yellow-600'
    if (level.toLowerCase().includes('silver')) return 'text-gray-600'
    return 'text-amber-600'
  }

  return (
    <div className="space-y-4">
      {/* Active Days */}
      <div className="text-center">
        <div className="text-xl font-bold">{activeDays}</div>
        <div className="text-xs text-muted-foreground">Active days (30d)</div>
      </div>

      {/* Gold Achievements */}
      {totalGoldCount > 0 && (
        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start justify-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <span className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm leading-tight">
              {totalGoldCount} Gold achievements this month!
            </span>
          </div>
        </div>
      )}

      {/* Top 3 Activities */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-muted-foreground">Top Activities (30d)</h4>
        {topActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No activities tracked yet</p>
        ) : (
          <div className="space-y-1">
            {topActivities.map((activity, index) => (
              <div key={`${activity.habitName}-${activity.name}-${activity.level}`} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {getRankIcon(index)}
                  <span className="font-medium truncate">{activity.name}</span>
                  <span className="text-muted-foreground text-xs truncate">({activity.habitName})</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <span className="font-semibold text-xs">{activity.count}x</span>
                  <span className={`font-medium text-xs ${getLevelColor(activity.level)}`}>
                    {activity.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 