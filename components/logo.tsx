"use client"

import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Logo() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-pointer">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="2" />
              <path
                d="M8 16C8 16 12 10 16 16C20 22 24 16 24 16"
                stroke={isDark ? "#ffffff" : "#000000"}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="4" fill={isDark ? "#9333ea" : "#7c3aed"} />
            </svg>
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
