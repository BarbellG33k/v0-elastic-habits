"use client"
import { OfflineBanner } from "@/components/OfflineBanner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { EnhancedHabitReminder } from "@/components/enhanced-habit-reminder"
import React from "react"

export function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OfflineBanner />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
      <EnhancedHabitReminder />
    </>
  )
} 