"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { supabase } from "@/lib/supabase"
import type { UserRole } from "@/types/UserRole"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPage() {
  const { user, isAdmin, isLoading: authIsLoading } = useAuth()
  const [users, setUsers] = useState<UserRole[]>([])
  const [pageIsLoading, setPageIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) {
      setPageIsLoading(false)
      return
    }

    console.log("AdminPage: Admin verified, fetching users...")
    setPageIsLoading(true)

    try {
      // This RPC function 'get_all_user_roles' should be created in Supabase.
      // It safely queries user roles, handling joins and avoiding RLS issues
      // that might occur when a client-side library tries to query directly.
      const { data, error } = await supabase.rpc("get_all_user_roles")

      if (error) {
        console.error("Error fetching users:", error)
        // Check for specific, known-safe errors to suppress toasts
        if (error.code === "42P17" || error.message.includes("infinite recursion")) {
          toast({
            title: "Database Policy Error",
            description: "Could not load all users due to a recursion error in your RLS policies. Please ask an administrator to run the `URGENT-fix-admin-recursion.sql` script in the Supabase SQL Editor.",
            variant: "destructive",
            duration: 15000,
          })
          // Fallback to showing at least the current admin user
          if (user) {
            setUsers([{ 
              user_id: user.id, 
              email: user.email || 'No Email',
              full_name: user.user_metadata.full_name || 'No Name',
              is_admin: true, 
              is_enabled: true, 
              created_at: user.created_at, 
              updated_at: user.updated_at || user.created_at,
              last_sign_in_at: user.last_sign_in_at || ''
            }])
          }
        } else {
          toast({
            title: "Error fetching users",
            description: `There was a problem retrieving the user list: ${error.message}`,
            variant: "destructive",
          })
        }
        setUsers([])
      } else {
        console.log("AdminPage: Users fetched successfully.")
        setUsers(data || [])
      }
    } catch (err: any) {
      console.error("Critical error in fetchUsers:", err)
      toast({
        title: "An unexpected error occurred",
        description: "Could not fetch users. Please check the console for details.",
        variant: "destructive",
      })
      setUsers([])
    } finally {
      setPageIsLoading(false)
    }
  }, [isAdmin, user, toast])

  useEffect(() => {
    // Only run fetchUsers if auth has loaded and the user's admin status is known.
    if (!authIsLoading) {
      fetchUsers()
    }
  }, [authIsLoading, fetchUsers])

  const handleUserUpdate = useCallback(() => {
    console.log("AdminPage: Refreshing user list after update.")
    toast({
      title: "Refreshing user list...",
      description: "Getting the latest data.",
    })
    fetchUsers()
  }, [fetchUsers, toast])

  // Display a full-page loading skeleton while auth is resolving.
  if (authIsLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // If the user is not an admin, show a clear access denied message.
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  // Main admin view
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {pageIsLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <DataTable
          columns={columns({ onUserUpdate: handleUserUpdate })}
          data={users}
        />
      )}
    </div>
  )
}
