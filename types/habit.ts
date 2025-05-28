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
    lastTrackedDate?: string // YYYY-MM-DD format
  }
}

export interface HabitTracking {
  habitId: string
  date: string // YYYY-MM-DD format
  activityIndex: number
  levelIndex: number
  timestamp: string
}

// Helper function to check if a habit has been tracked today
export function isHabitTrackedToday(habit: Habit): boolean {
  if (!habit.stats.lastTrackedDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return habit.stats.lastTrackedDate === today;
}
