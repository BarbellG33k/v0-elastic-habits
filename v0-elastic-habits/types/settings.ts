export interface AppSettings {
  sloganRotationInterval: number; // in milliseconds
  reminderSettings: {
    enabled: boolean;
    reminderTime: string; // 24-hour format HH:mm
    lastShownDate?: string; // ISO date string for tracking daily reminder state
  };
  // Add other app-wide settings here as needed
}

export const DEFAULT_SETTINGS: AppSettings = {
  sloganRotationInterval: 4000, // 4 seconds by default
  reminderSettings: {
    enabled: true,
    reminderTime: "17:00", // 5:00 PM by default
  },
}; 