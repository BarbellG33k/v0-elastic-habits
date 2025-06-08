"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { supabase } from "@/lib/supabase"
import type { UserRole } from "@/types/UserRole"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ActiveUser = {
  user_id: string
  email: string
  full_name: string
  total_activities: number
  last_activity: string
  streak_days: number
}

export default function AdminPage() {
  const { user, isAdmin, isLoading: authIsLoading } = useAuth()
  const [users, setUsers] = useState<UserRole[]>([])
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [pageIsLoading, setPageIsLoading] = useState(true)
  const [activeUsersLoading, setActiveUsersLoading] = useState(true)
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) {
      setPageIsLoading(false)
      return
    }

    setPageIsLoading(true)

    try {
      // This RPC function 'get_all_user_roles' should be created in Supabase.
      // It safely queries user roles, handling joins and avoiding RLS issues
      // that might occur when a client-side library tries to query directly.
      const { data, error } = await supabase.rpc("get_all_user_roles")

      if (error) {
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
        setUsers(data || [])
      }
    } catch (err: any) {
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

  const fetchActiveUsers = useCallback(async () => {
    if (!isAdmin) {
      setActiveUsersLoading(false)
      return
    }

    setActiveUsersLoading(true)
    try {
      const { data, error } = await supabase.rpc("get_active_users", { limit_count: 20 })

      if (error) {
        toast({
          title: "Error fetching active users",
          description: error.message,
          variant: "destructive",
        })
        setActiveUsers([])
      } else {
        setActiveUsers(data || [])
      }
    } catch (err: any) {
      setActiveUsers([])
    } finally {
      setActiveUsersLoading(false)
    }
  }, [isAdmin, toast])

  useEffect(() => {
    // Only run fetchUsers if auth has loaded and the user's admin status is known.
    if (!authIsLoading) {
      fetchUsers()
      fetchActiveUsers()
    }
  }, [authIsLoading, fetchUsers, fetchActiveUsers])

  const handleUserUpdate = useCallback(() => {
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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="active">Top 20 Most Active</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Active Users (Last 30 Days)</CardTitle>
              <CardDescription>
                Users ranked by total habit tracking activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeUsersLoading ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : activeUsers.length === 0 ? (
                <p className="text-muted-foreground">No active users found in the last 30 days.</p>
              ) : (
                <div className="space-y-4">
                  {activeUsers.map((activeUser, index) => (
                    <div key={activeUser.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="font-mono text-sm text-muted-foreground">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{activeUser.full_name || 'Unknown User'}</p>
                          <p className="text-sm text-muted-foreground">{activeUser.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{activeUser.total_activities} activities</p>
                        <p className="text-sm text-muted-foreground">
                          {activeUser.streak_days} days active
                        </p>
                        {activeUser.last_activity && (
                          <p className="text-xs text-muted-foreground">
                            Last: {new Date(activeUser.last_activity).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
