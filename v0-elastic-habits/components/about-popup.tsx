"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Info } from "lucide-react"

export function AboutPopup() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">About</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            About{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Momentum
            </span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="space-y-4">
            <p>
              Momentum is a habit tracking app designed to help you build consistent routines with flexibility in mind.
            </p>

            <p>
              Built on the "elastic habits" concept, Momentum recognizes that life isn't always predictable. Some days you
              have more energy and time than others. Instead of the rigid "all or nothing" approach of traditional habit
              trackers, Momentum lets you define multiple activities and achievement levels for each habit.
            </p>

            <p>
              For example, on busy days, you might only complete a 10-minute workout (Bronze level), while on days with
              more free time, you might achieve a full 30-minute session (Gold level). This flexibility helps maintain
              your streak even when life gets hectic.
            </p>

            <p>
              The app is completely free and open-source. Your support through "Buy Me a Coffee" helps cover hosting costs
              and enables continued development of new features.
            </p>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
