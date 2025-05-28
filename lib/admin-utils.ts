import { supabase } from "./supabase"

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("user_roles").select("is_admin").eq("user_id", userId).single()

    if (error) {
      if (error.code === 'PGRST116') return false // No record found
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
  if (!userId) {
    return null
  }

  try {
    // First try to get the role with a simpler query
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("is_admin, is_enabled, created_at, updated_at")
      .eq("user_id", userId)
      .maybeSingle()

    // If we got data, return it with full structure
    if (roleData) {
      return {
        user_id: userId,
        ...roleData,
        is_admin: roleData.is_admin || false,
        is_enabled: roleData.is_enabled !== false // default to true if undefined
      }
    }

    // If no data found or there was an error, create a default role
    const defaultRole = {
      user_id: userId,
      is_admin: false,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    try {
      // Try to insert the default role
      const { data: insertedData, error: insertError } = await supabase
        .from("user_roles")
        .insert(defaultRole)
        .select()
        .single()

      if (insertError) {
        console.warn("Could not create default role, using fallback:", insertError)
        return defaultRole // Return default even if insert fails
      }

      return insertedData || defaultRole
    } catch (insertError) {
      // If insert fails, log and return default
      console.warn("Error during role creation, using fallback:", insertError)
      return defaultRole
    }

  } catch (error: any) {
    // Handle specific error cases
    if (error.message?.includes('infinite recursion') || 
        error.message?.includes('recursion') ||
        error.code === 'PGRST116') {
      console.warn('Using default non-admin role due to:', error.message || error.code)
      return {
        user_id: userId,
        is_admin: false,
        is_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    // For other errors, throw with better context
    const enhancedError = new Error(`Error fetching user role: ${error.message || JSON.stringify(error)}`)
    enhancedError.stack = error.stack
    throw enhancedError
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
