"use client"

import type { ColumnDef, Row, CellContext } from "@tanstack/react-table"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toggleUserStatus, toggleAdminStatus } from "@/lib/admin-utils"
import type { UserRole } from "@/types/UserRole"
import { formatDistanceToNow, parseISO } from "date-fns"

// This is a helper component to avoid hook violations
const ActionCell = ({ row, onUserUpdate }: { row: Row<UserRole>; onUserUpdate: () => void }) => {
  const { user: authUser } = useAuth()
  const { toast } = useToast()
  const user = row.original as UserRole

  const isCurrentUser = authUser?.id === user.user_id

  const handleToggleStatus = async (isEnabled: boolean) => {
    try {
      await toggleUserStatus(user.user_id, isEnabled)
      toast({
        title: "User updated",
        description: `User has been ${isEnabled ? "enabled" : "disabled"}`,
      })
      onUserUpdate()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleToggleAdmin = async (isAdmin: boolean) => {
    try {
      await toggleAdminStatus(user.user_id, isAdmin)
      toast({
        title: "User updated",
        description: `Admin privileges have been ${isAdmin ? "granted" : "revoked"}`,
      })
      onUserUpdate()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  return (
    <div className="flex justify-end items-center gap-4">
      <div className="flex items-center space-x-2">
        <Switch
          id={`enable-${user.user_id}`}
          checked={user.is_enabled}
          onCheckedChange={handleToggleStatus}
          disabled={isCurrentUser}
          aria-label="Toggle user enabled status"
        />
        <Label htmlFor={`enable-${user.user_id}`}>Enabled</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id={`admin-${user.user_id}`}
          checked={user.is_admin}
          onCheckedChange={handleToggleAdmin}
          disabled={isCurrentUser}
          aria-label="Toggle user admin status"
        />
        <Label htmlFor={`admin-${user.user_id}`}>Admin</Label>
      </div>
    </div>
  )
}

export const columns = ({ onUserUpdate }: { onUserUpdate: () => void }): ColumnDef<UserRole>[] => [
  {
    accessorKey: "full_name",
    header: "User",
    cell: ({ row }: CellContext<UserRole, unknown>) => {
      const user = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.full_name || "N/A"}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "is_enabled",
    header: "Status",
    cell: ({ row }: CellContext<UserRole, unknown>) => {
      const isEnabled = row.getValue("is_enabled")
      return isEnabled ? (
        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">Active</Badge>
      ) : (
        <Badge variant="destructive">Disabled</Badge>
      )
    },
  },
  {
    accessorKey: "is_admin",
    header: "Role",
    cell: ({ row }: CellContext<UserRole, unknown>) => {
      const isAdmin = row.getValue("is_admin")
      return isAdmin ? (
        <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
      ) : (
        <Badge variant="outline">User</Badge>
      )
    },
  },
  {
    accessorKey: "last_sign_in_at",
    header: "Last Active",
    cell: ({ row }: CellContext<UserRole, unknown>) => {
      const lastSignIn = row.getValue("last_sign_in_at")
      if (!lastSignIn || typeof lastSignIn !== "string") {
        return <span className="text-muted-foreground">Never</span>
      }
      try {
        return formatDistanceToNow(parseISO(lastSignIn), { addSuffix: true })
      } catch (error) {
        return <span className="text-muted-foreground">Invalid date</span>
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }: CellContext<UserRole, unknown>) => <ActionCell row={row} onUserUpdate={onUserUpdate} />,
  },
] 