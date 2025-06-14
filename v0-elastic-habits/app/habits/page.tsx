"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HabitCard from "@/components/habit-card"
import { Plus, Save } from "lucide-react"
import { useHabits } from "@/hooks/use-habits"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function HabitsPage() {
  const { habits, addHabit, updateHabit, deleteHabit, isLoading } = useHabits()
  const { user } = useAuth()
  const [newHabit, setNewHabit] = useState({
    name: "",
    activities: [
      { name: "", levels: ["", "", ""] },
      { name: "", levels: ["", "", ""] },
      { name: "", levels: ["", "", ""] },
    ],
  })
  const [editingHabit, setEditingHabit] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState("current")

  const handleActivityChange = (index: number, value: string) => {
    const updated = { ...newHabit }
    updated.activities[index].name = value
    setNewHabit(updated)
  }

  const handleLevelChange = (activityIndex: number, levelIndex: number, value: string) => {
    const updated = { ...newHabit }
    updated.activities[activityIndex].levels[levelIndex] = value
    setNewHabit(updated)
  }

  const handleSubmit = () => {
    if (newHabit.name.trim() === "") return

    // Validate that at least one activity and level is filled
    const hasValidActivity = newHabit.activities.some(
      (activity) => activity.name.trim() !== "" && activity.levels.some((level) => level.trim() !== ""),
    )

    if (!hasValidActivity) return

    addHabit({
      name: newHabit.name,
      activities: newHabit.activities,
      stats: { completedDays: 0, streak: 0 },
    })

    // Reset form
    setNewHabit({
      name: "",
      activities: [
        { name: "", levels: ["", "", ""] },
        { name: "", levels: ["", "", ""] },
        { name: "", levels: ["", "", ""] },
      ],
    })
  }

  const handleEdit = (habit: any) => {
    setEditingHabit(habit.id)
    setNewHabit({
      name: habit.name,
      activities: habit.activities,
    })
    setTabValue("add")
  }

  const handleUpdate = () => {
    if (!editingHabit) return

    const habitToUpdate = habits.find((h) => h.id === editingHabit)
    if (!habitToUpdate) return

    updateHabit({
      ...habitToUpdate,
      name: newHabit.name,
      activities: newHabit.activities,
    })

    setEditingHabit(null)
    setNewHabit({
      name: "",
      activities: [
        { name: "", levels: ["", "", ""] },
        { name: "", levels: ["", "", ""] },
        { name: "", levels: ["", "", ""] },
      ],
    })

    // Switch back to current tab
    const currentTab = document.querySelector('[data-value="current"]') as HTMLElement;
    currentTab?.click();
  }

  const handleCancel = () => {
    setEditingHabit(null)
    setNewHabit({
      name: "",
      activities: [
        { name: "", levels: ["", "", ""] },
        { name: "", levels: ["", "", ""] },
        { name: "", levels: ["", "", ""] },
      ],
    })
    setTabValue("current")
  }

  const handleTabChange = (value: string) => {
    if (value === "current" && editingHabit) {
      // Cancel edit mode when switching to current tab
      setEditingHabit(null)
      setNewHabit({
        name: "",
        activities: [
          { name: "", levels: ["", "", ""] },
          { name: "", levels: ["", "", ""] },
          { name: "", levels: ["", "", ""] },
        ],
      })
    }
    setTabValue(value)
  }

  // If not authenticated, redirect to sign in
  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">Please sign in to manage your habits</p>
            <Button asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
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
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Habits</h1>

      <Tabs value={tabValue} onValueChange={handleTabChange} defaultValue="current">
        <TabsList className="mb-4">
          <TabsTrigger value="current">Current Habits</TabsTrigger>
          <TabsTrigger value="add">{editingHabit ? "Edit Habit" : "Add New Habit"}</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You don't have any habits yet</p>
              <Button onClick={() => {
                const addTab = document.querySelector('[data-value="add"]') as HTMLElement;
                addTab?.click();
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Habit
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {habits.map((habit) => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit}
                  onEdit={handleEdit} 
                  onDelete={deleteHabit} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingHabit ? "Edit Habit" : "Create a New Habit"}</CardTitle>
              <CardDescription>
                Define your habit with 3 activities and 3 levels for each activity (bronze, silver, gold)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="habit-name">Habit Name</Label>
                <Input
                  id="habit-name"
                  placeholder="e.g., Exercise, Reading, Meditation"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                />
              </div>

              {newHabit.activities.map((activity, activityIndex) => (
                <div key={activityIndex} className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`activity-${activityIndex}`}>Activity {activityIndex + 1}</Label>
                    <Input
                      id={`activity-${activityIndex}`}
                      placeholder={`e.g., ${activityIndex === 0 ? "Running" : activityIndex === 1 ? "Strength Training" : "Stretching"}`}
                      value={activity.name}
                      onChange={(e) => handleActivityChange(activityIndex, e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {activity.levels.map((level, levelIndex) => (
                      <div key={levelIndex} className="space-y-2">
                        <Label htmlFor={`level-${activityIndex}-${levelIndex}`}>
                          {levelIndex === 0 ? "Bronze" : levelIndex === 1 ? "Silver" : "Gold"}
                        </Label>
                        <Input
                          id={`level-${activityIndex}-${levelIndex}`}
                          placeholder={`e.g., ${levelIndex === 0 ? "10 min" : levelIndex === 1 ? "20 min" : "30 min"}`}
                          value={level}
                          onChange={(e) => handleLevelChange(activityIndex, levelIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              {editingHabit ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate}>
                    <Save className="mr-2 h-4 w-4" />
                    Update Habit
                  </Button>
                </>
              ) : (
                <Button onClick={handleSubmit} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Habit
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
