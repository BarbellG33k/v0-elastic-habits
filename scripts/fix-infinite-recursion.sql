-- This script fixes the infinite recursion error in user_roles policies

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can see all user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON user_roles;

-- Now create non-recursive policies that use a different approach
-- For admin read access:
CREATE POLICY "Admins can see all user roles" 
ON user_roles FOR SELECT 
USING (
  (SELECT is_admin FROM user_roles WHERE user_id = auth.uid())
);

-- For admin update access:
CREATE POLICY "Only admins can update user roles" 
ON user_roles FOR UPDATE 
USING (
  (SELECT is_admin FROM user_roles WHERE user_id = auth.uid())
);

-- Fix the update_last_active function to avoid infinite recursion
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  -- Use direct SQL update to avoid triggering RLS
  UPDATE user_roles 
  SET last_active = NOW(), updated_at = NOW()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure our update_user_last_active trigger is properly set
DROP TRIGGER IF EXISTS update_user_last_active ON habit_tracking;
CREATE TRIGGER update_user_last_active
AFTER INSERT ON habit_tracking
FOR EACH ROW
EXECUTE FUNCTION update_last_active();
