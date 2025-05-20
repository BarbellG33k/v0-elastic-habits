"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { toggleUserStatus, toggleAdminStatus } from "@/lib/admin-utils"
import { format, formatDistanceToNow, subDays } from "date-fns"
import { CheckCircle, Search, Shield, ShieldAlert, UserX } from "lucide-react"

type UserWithRole = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
  role: {
    is_admin: boolean
    is_enabled: boolean
    last_active: string
  }
}

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [inactiveFilter, setInactiveFilter] = useState<"all" | "30days" | "90days">("all")

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin && !isLoading) {
      router.push("/")
      toast({
        title: "Access denied",
        description: "You do not have permission to access this page",
        variant: "destructive",
      })
    }
  }, [isAdmin, isLoading, router, toast])

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return

      try {
        setIsLoading(true)

        // Fetch all users from auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

        if (authError) throw authError

        // Fetch all user roles
        const { data: userRoles, error: rolesError } = await supabase.from("user_roles").select("*")

        if (rolesError) throw rolesError

        // Combine the data
        const combinedUsers = authUsers.users.map((authUser) => {
          const userRole = userRoles.find((role) => role.user_id === authUser.id) || {
            is_admin: false,
            is_enabled: true,
            last_active: null,
          }

          return {
            id: authUser.id,
            email: authUser.email,
            created_at: authUser.created_at,
            last_sign_in_at: authUser.last_sign_in_at,
            user_metadata: authUser.user_metadata,
            role: {
              is_admin: userRole.is_admin,
              is_enabled: userRole.is_enabled,
              last_active: userRole.last_active,
            },
          }
        })

        setUsers(combinedUsers)
      } catch (error: any) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [isAdmin, toast])

  const handleToggleStatus = async (userId: string, isEnabled: boolean) => {
    try {
      await toggleUserStatus(userId, isEnabled)

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: { ...u.role, is_enabled: isEnabled } } : u)),
      )

      toast({
        title: "User updated",
        description: `User has been ${isEnabled ? "enabled" : "disabled"}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      await toggleAdminStatus(userId, isAdmin)

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: { ...u.role, is_admin: isAdmin } } : u)),
      )

      toast({
        title: "User updated",
        description: `Admin privileges ${isAdmin ? "granted" : "revoked"}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter((user) => {
    // Apply search filter
    const matchesSearch =
      searchTerm === "" ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())

    // Apply inactive filter
    let matchesInactive = true
    if (inactiveFilter !== "all" && user.role.last_active) {
      const lastActive = new Date(user.role.last_active)
      const daysAgo = inactiveFilter === "30days" ? 30 : 90
      const cutoffDate = subDays(new Date(), daysAgo)
      matchesInactive = lastActive < cutoffDate
    }

    return matchesSearch && (inactiveFilter === "all" || matchesInactive)
  })

  if (!isAdmin && !isLoading) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="inactive-filter">Inactive Filter:</Label>
                  <select
                    id="inactive-filter"
                    className="border rounded p-2"
                    value={inactiveFilter}
                    onChange={(e) => setInactiveFilter(e.target.value as "all" | "30days" | "90days")}
                  >
                    <option value="all">All Users</option>
                    <option value="30days">Inactive 30+ Days</option>
                    <option value="90days">Inactive 90+ Days</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Created</th>
                        <th className="text-left py-3 px-4">Last Active</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Admin</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-muted-foreground">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="py-3 px-4">
                              <div className="font-medium">{user.user_metadata?.full_name || "No Name"}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </td>
                            <td className="py-3 px-4">{format(new Date(user.created_at), "MMM d, yyyy")}</td>
                            <td className="py-3 px-4">
                              {user.role.last_active ? (
                                <div title={format(new Date(user.role.last_active), "MMM d, yyyy h:mm a")}>
                                  {formatDistanceToNow(new Date(user.role.last_active), { addSuffix: true })}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Never</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {user.role.is_enabled ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="mr-1 h-3 w-3" /> Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  <UserX className="mr-1 h-3 w-3" /> Disabled
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {user.role.is_admin ? (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  <ShieldAlert className="mr-1 h-3 w-3" /> Admin
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  <Shield className="mr-1 h-3 w-3" /> User
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-4">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`user-status-${user.id}`}
                                    checked={user.role.is_enabled}
                                    onCheckedChange={(checked) => handleToggleStatus(user.id, checked)}
                                    disabled={user.id === user?.id} // Can't disable yourself
                                  />
                                  <Label htmlFor={`user-status-${user.id}`}>
                                    {user.role.is_enabled ? "Enabled" : "Disabled"}
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`user-admin-${user.id}`}
                                    checked={user.role.is_admin}
                                    onCheckedChange={(checked) => handleToggleAdmin(user.id, checked)}
                                    disabled={user.id === user?.id} // Can't change your own admin status
                                  />
                                  <Label htmlFor={`user-admin-${user.id}`}>Admin</Label>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Reports</CardTitle>
              <CardDescription>View reports on user activity and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Inactive Users (30+ days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="animate-pulse h-24 bg-muted rounded-md"></div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">
                          {
                            users.filter((u) => {
                              if (!u.role.last_active) return true
                              const lastActive = new Date(u.role.last_active)
                              return lastActive < subDays(new Date(), 30)
                            }).length
                          }
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Users who haven't been active in the last 30 days
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => setInactiveFilter("30days")}>
                          View Users
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Inactive Users (90+ days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="animate-pulse h-24 bg-muted rounded-md"></div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">
                          {
                            users.filter((u) => {
                              if (!u.role.last_active) return true
                              const lastActive = new Date(u.role.last_active)
                              return lastActive < subDays(new Date(), 90)
                            }).length
                          }
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Users who haven't been active in the last 90 days
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => setInactiveFilter("90days")}>
                          View Users
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Disabled Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="animate-pulse h-24 bg-muted rounded-md"></div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">{users.filter((u) => !u.role.is_enabled).length}</div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Accounts that have been disabled by administrators
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Admin Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="animate-pulse h-24 bg-muted rounded-md"></div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">{users.filter((u) => u.role.is_admin).length}</div>
                        <p className="text-sm text-muted-foreground mt-2">Users with administrative privileges</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
