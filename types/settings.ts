export interface AppSettings {
  sloganRotationInterval: number; // in milliseconds
  // Add other app-wide settings here as needed
}

export const DEFAULT_SETTINGS: AppSettings = {
  sloganRotationInterval: 4000, // 4 seconds by default
}; 