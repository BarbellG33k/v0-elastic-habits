import { supabase } from "./supabase"

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("user_roles").select("is_admin").eq("user_id", userId).single()

    if (error) {
      console.error("Error checking admin status:", error)
      return false
    }

    return data?.is_admin || false
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

export async function getUserRole(userId: string) {
  try {
    const { data, error } = await supabase.from("user_roles").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching user role:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error fetching user role:", error)
    throw error
  }
}

export async function toggleUserStatus(userId: string, isEnabled: boolean) {
  try {
    const { error } = await supabase
      .from("user_roles")
      .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
      .eq("user_id", userId)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error toggling user status:", error)
    throw error
  }
}

export async function toggleAdminStatus(userId: string, isAdmin: boolean) {
  try {
    const { error } = await supabase
      .from("user_roles")
      .update({ is_admin: isAdmin, updated_at: new Date().toISOString() })
      .eq("user_id", userId)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error toggling admin status:", error)
    throw error
  }
}
