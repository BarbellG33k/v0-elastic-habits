"use client"

import React, { createContext, useContext, useCallback, useRef } from "react"

type RefreshFunctions = {
  refreshInsights?: () => void
  refreshStreaks?: () => void
}

type DataRefreshContextType = {
  registerRefreshFunctions: (functions: RefreshFunctions) => void
  triggerRefresh: () => void
}

const DataRefreshContext = createContext<DataRefreshContextType | undefined>(undefined)

export function DataRefreshProvider({ children }: { children: React.ReactNode }) {
  const refreshFunctionsRef = useRef<RefreshFunctions>({})

  const registerRefreshFunctions = useCallback((functions: RefreshFunctions) => {
    refreshFunctionsRef.current = { ...refreshFunctionsRef.current, ...functions }
  }, [])

  const triggerRefresh = useCallback(() => {
    const { refreshInsights, refreshStreaks } = refreshFunctionsRef.current
    
    // Trigger refreshes with a small delay to ensure the API has processed the new data
    setTimeout(() => {
      if (refreshInsights) {
        refreshInsights()
      }
      if (refreshStreaks) {
        refreshStreaks()
      }
    }, 100)
  }, [])

  return (
    <DataRefreshContext.Provider value={{ registerRefreshFunctions, triggerRefresh }}>
      {children}
    </DataRefreshContext.Provider>
  )
}

export function useDataRefresh() {
  const context = useContext(DataRefreshContext)
  if (context === undefined) {
    throw new Error('useDataRefresh must be used within a DataRefreshProvider')
  }
  return context
} 