import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { Toaster } from "@/components/ui/toaster"
import { Metadata } from 'next'
import { EnhancedHabitReminder } from "@/components/enhanced-habit-reminder"
import { Analytics } from '@vercel/analytics/next'
import { ClientLayoutShell } from "@/components/ClientLayoutShell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Momentum - Habit Tracker",
  description: "A modern habit tracking app based on the elastic habits concept",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ]
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Momentum'
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SettingsProvider>
              <ClientLayoutShell>
                {children}
              </ClientLayoutShell>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
