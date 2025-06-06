export type UserRole = {
  user_id: string
  email: string | null
  full_name: string | null
  is_admin: boolean
  is_enabled: boolean
  created_at: string
  updated_at: string | null
  last_sign_in_at: string | null
} 