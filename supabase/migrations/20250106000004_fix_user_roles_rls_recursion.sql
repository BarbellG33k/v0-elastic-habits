-- Fix RLS recursion issue on user_roles table
-- The problem is the admin check policy queries the same table it's protecting

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "user_roles_select_policy" ON user_roles;
DROP POLICY IF EXISTS "user_roles_update_policy" ON user_roles;

-- Create a simple policy that only allows users to see their own role
-- Admin access will be handled by a SECURITY DEFINER function instead
CREATE POLICY "users_can_view_own_role" ON user_roles FOR SELECT
USING ((select auth.uid()) = user_id);

-- Create a simple update policy for users to update their own last_active
CREATE POLICY "users_can_update_own_activity" ON user_roles FOR UPDATE
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- Create a SECURITY DEFINER function to safely check admin status
-- This bypasses RLS and prevents recursion
CREATE OR REPLACE FUNCTION public.is_user_admin(check_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  admin_status boolean DEFAULT false;
BEGIN
  -- Use provided user_id or current user
  target_user_id := COALESCE(check_user_id, auth.uid());
  
  -- Return false if no user
  IF target_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Query admin status without RLS interference
  SELECT is_admin INTO admin_status
  FROM user_roles
  WHERE user_id = target_user_id;
  
  -- Return false if user not found in user_roles
  RETURN COALESCE(admin_status, false);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO anon; 