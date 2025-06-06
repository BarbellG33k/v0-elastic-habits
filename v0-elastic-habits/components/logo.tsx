"use client"

import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import Image from "next/image"

export function Logo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During server render and initial mount, use light theme colors
  const isDark = mounted ? theme === "dark" : false

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-pointer">
            <Image
              src="/favicon.png"
              alt="Momentum Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="ml-2 text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Momentum
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">
            Momentum helps you build consistent routines with flexibility. Define multiple activities and achievement
            levels for each habit to maintain your streak even when life gets hectic.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
