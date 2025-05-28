'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/settings-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSettings() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [rotationInterval, setRotationInterval] = useState(settings.sloganRotationInterval / 1000);

  const handleSave = () => {
    updateSettings({
      sloganRotationInterval: rotationInterval * 1000, // Convert to milliseconds
    });
    toast({
      title: "Settings updated",
      description: "The settings have been saved successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Settings</CardTitle>
          <CardDescription>Configure the behavior of homepage elements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rotationInterval">Slogan Rotation Interval (seconds)</Label>
            <div className="flex gap-4">
              <Input
                id="rotationInterval"
                type="number"
                min="1"
                max="30"
                value={rotationInterval}
                onChange={(e) => setRotationInterval(Number(e.target.value))}
                className="max-w-[200px]"
              />
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Set how frequently the welcome slogans rotate on the homepage (1-30 seconds)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 