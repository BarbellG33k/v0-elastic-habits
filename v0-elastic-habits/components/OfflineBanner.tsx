"use client"
import React from "react"
import { useAuth } from "@/contexts/auth-context"

export function OfflineBanner() {
  const { isOnline, usingCache } = useAuth()

  // Manual retry: reload the page (or could expose a refetch function from context)
  const handleRetry = () => {
    window.location.reload()
  }

  if (isOnline && !usingCache) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      background: '#b91c1c',
      color: 'white',
      padding: '12px 0',
      textAlign: 'center',
      fontWeight: 600,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <span>
        {isOnline ? 'Unable to verify session. Using cached data.' : 'You are offline. Some features may be unavailable.'}
      </span>
      <button
        onClick={handleRetry}
        style={{
          marginLeft: 16,
          background: 'white',
          color: '#b91c1c',
          border: 'none',
          borderRadius: 4,
          padding: '4px 12px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Retry now
      </button>
    </div>
  )
} 