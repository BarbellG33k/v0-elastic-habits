'use client';

import { useSettings } from "@/contexts/settings-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ReminderSettings() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(settings.reminderSettings.enabled);
  const [reminderTime, setReminderTime] = useState(settings.reminderSettings.reminderTime);

  const handleSave = () => {
    updateSettings({
      reminderSettings: {
        ...settings.reminderSettings,
        enabled,
        reminderTime,
      },
    });

    toast({
      title: "Settings saved",
      description: "Your reminder preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reminders</CardTitle>
        <CardDescription>Configure when you want to be reminded about untracked habits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reminder-toggle">Enable daily reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get notified if you have untracked habits at your chosen time
            </p>
          </div>
          <Switch
            id="reminder-toggle"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reminder-time">Reminder time</Label>
          <div className="flex gap-4">
            <Input
              id="reminder-time"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              disabled={!enabled}
              className="max-w-[200px]"
            />
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose when you want to receive your daily reminder
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 