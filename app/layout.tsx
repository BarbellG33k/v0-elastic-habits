import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { EnhancedHabitReminder } from "@/components/enhanced-habit-reminder" // Import the reminder component

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Momentum - Habit Tracker",
  description: "A modern habit tracking app based on the elastic habits concept",
    generator: 'v0.dev'
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
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <EnhancedHabitReminder /> {/* Add the reminder component here */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
