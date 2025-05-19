export interface Habit {
  id: string
  name: string
  activities: {
    name: string
    levels: string[] // Bronze, Silver, Gold
  }[]
  createdAt: string
  stats: {
    completedDays: number
    streak: number
  }
}

export interface HabitTracking {
  habitId: string
  date: string // YYYY-MM-DD format
  activityIndex: number
  levelIndex: number
  timestamp: string
}
