'use client';

import { useEffect, useCallback } from 'react';
import { useSettings } from '@/contexts/settings-context';
import { useHabits } from '@/hooks/use-habits';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { isHabitTrackedToday } from '@/types/habit';

export function EnhancedHabitReminder() {
  const { settings, updateSettings } = useSettings();
  const { habits } = useHabits();
  const { toast } = useToast();
  const router = useRouter();

  const checkAndShowReminder = useCallback(() => {
    if (!settings.reminderSettings.enabled) return;

    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const [reminderHour, reminderMinute] = settings.reminderSettings.reminderTime.split(':').map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check if reminder should be shown (at the configured time)
    if (currentHour === reminderHour && currentMinute === reminderMinute) {
      // Check if we haven't shown the reminder today
      if (settings.reminderSettings.lastShownDate !== today) {
        // Check for untracked habits
        const untrackedHabits = habits.filter(habit => !isHabitTrackedToday(habit));

        if (untrackedHabits.length > 0) {
          toast({
            title: "Untracked Habits Reminder",
            description: `You have ${untrackedHabits.length} habit${untrackedHabits.length > 1 ? 's' : ''} left to track today.`,
            duration: 0, // Persist until manually dismissed
            action: (
              <Button 
                onClick={() => {
                  router.push('/track');
                  // Update last shown date after user interaction
                  updateSettings({
                    reminderSettings: {
                      ...settings.reminderSettings,
                      lastShownDate: today,
                    },
                  });
                }}
                variant="default"
              >
                Track Now
              </Button>
            ),
          });
        }
      }
    }
  }, [settings, habits, toast, router, updateSettings]);

  useEffect(() => {
    // Check every minute
    const interval = setInterval(checkAndShowReminder, 60000);
    
    // Also check immediately on mount
    checkAndShowReminder();

    return () => clearInterval(interval);
  }, [checkAndShowReminder]);

  // This component doesn't render anything
  return null;
} 