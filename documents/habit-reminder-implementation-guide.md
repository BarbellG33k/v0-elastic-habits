# Habit Reminder Implementation Guide

This guide explains how to implement the 5:00 PM habit reminder feature in the Momentum app.

## Overview

The habit reminder feature will:
1. Check the user's local time
2. At 5:00 PM (or a user-configured time), check if there are any habits without tracked activities for the day
3. Show a toast notification that requires manual dismissal
4. Remember if the notification has been shown today to avoid showing it multiple times

## Implementation Steps

### 1. Add the Required Files

Copy these files to your project:
- `components/habit-reminder.tsx` - Basic implementation
- `components/enhanced-habit-reminder.tsx` - Advanced implementation with more features
- `hooks/use-reminder-settings.ts` - Hook for managing reminder settings
- `components/reminder-settings.tsx` - UI component for configuring reminders

### 2. Update the Layout

Add the reminder component to your app's layout file (`app/layout.tsx`):

\`\`\`tsx
import { EnhancedHabitReminder } from "@/components/enhanced-habit-reminder"

// Inside your layout component's return statement:
<Toaster />
<EnhancedHabitReminder /> {/* Add this line */}
\`\`\`

### 3. Update the Settings Page

Replace the existing notifications card in your settings page with the new `ReminderSettings` component:

\`\`\`tsx
import { ReminderSettings } from "@/components/reminder-settings"

// Inside your settings page:
<div className="space-y-6">
  <ReminderSettings />
  {/* Other settings cards... */}
</div>
\`\`\`

## How It Works

### Checking for Untracked Habits

The reminder system checks for habits that haven't been fully tracked for the day:

1. It gets all habits for the current user
2. It gets all tracked activities for today
3. It identifies habits that have no tracked activities or have some activities that haven't been tracked
4. If there are untracked habits, it shows a toast notification

### Reminder Settings

Users can configure:
- Whether reminders are enabled
- The time when reminders should be shown (default: 5:00 PM)

These settings are stored in localStorage and persist across sessions.

### Preventing Multiple Reminders

To avoid showing multiple reminders on the same day:
1. When a reminder is shown, it stores a flag in localStorage
2. The flag is specific to the current date
3. Before showing a reminder, it checks if the flag exists for today

## Customization Options

### Changing the Default Reminder Time

To change the default reminder time from 5:00 PM to another time:

\`\`\`tsx
// In hooks/use-reminder-settings.ts
const [settings, setSettings] = useState<ReminderSettings>({
  enabled: true,
  time: "18:00" // Change to 6:00 PM or any other time in 24-hour format
})
\`\`\`

### Modifying the Reminder Message

To change the text of the reminder:

\`\`\`tsx
// In components/enhanced-habit-reminder.tsx
toast({
  title: "Your Custom Title",
  description: `Your custom message about ${untrackedHabits.length} habits.`,
  // ...
})
\`\`\`

## Testing

To test the reminder functionality without waiting for 5:00 PM:

1. Temporarily modify the time check in `enhanced-habit-reminder.tsx`:
   \`\`\`tsx
   // Instead of checking for a specific hour and minute
   // if (currentHour === reminderHour && currentMinute === reminderMinute) {
   
   // Use this for testing (will show reminder 2 minutes after the component mounts)
   if (true) {
   \`\`\`

2. After testing, revert the change to use the actual time check.
