import { supabase } from "./supabase"

// The isUserAdmin and getUserRole functions are no longer needed for client-side
// admin checks, as this is now handled by the 'custom_is_admin' JWT claim.
// They are removed to simplify the codebase and avoid confusion.

export async function toggleUserStatus(userId: string, isEnabled: boolean) {
  try {
    const { error } = await supabase
      .from("user_roles")
      .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
      .eq("user_id", userId)

    if (error) {
      // Handle recursion error
      if (error.code === "42P17" || error.message?.includes("infinite recursion")) {
        throw new Error("Cannot update user status due to a database policy error. Please ask the administrator to check the RLS policies on the user_roles table.");
      }
      
      if (Object.keys(error).length === 0 && !error.message) {
        throw new Error("Failed to toggle user status. A database connection error may have occurred.");
      }
      throw error
    }

    return true
  } catch (error: any) {
    console.error("Error toggling user status:", error)
    // Create a more informative error if we're dealing with an empty object
    if (typeof error === 'object' && error !== null && Object.keys(error).length === 0 && !error.message) {
      throw new Error("Failed to toggle user status due to a database connection error.");
    }
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
      // Handle recursion error
      if (error.code === "42P17" || error.message?.includes("infinite recursion")) {
        throw new Error("Cannot update admin status due to a database policy error. Please ask the administrator to check the RLS policies on the user_roles table.");
      }
      
      if (Object.keys(error).length === 0 && !error.message) {
        throw new Error("Failed to toggle admin status. A database connection error may have occurred.");
      }
      throw error
    }

    return true
  } catch (error: any) {
    console.error("Error toggling admin status:", error)
    // Create a more informative error if we're dealing with an empty object
    if (typeof error === 'object' && error !== null && Object.keys(error).length === 0 && !error.message) {
      throw new Error("Failed to toggle admin status due to a database connection error.");
    }
    throw error
  }
}
