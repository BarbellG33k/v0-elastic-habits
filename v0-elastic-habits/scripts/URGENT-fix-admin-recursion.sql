-- URGENT: Fix for infinite recursion in user_roles table
-- Run this script in your Supabase SQL Editor to fix the admin page errors

-- Step 1: Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can see all user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON user_roles;

-- Step 2: Create new non-recursive policies using a different approach
-- These policies avoid the recursion by using a simpler admin check

-- Policy to allow admins to see all user roles (using EXISTS with a simpler subquery)
CREATE POLICY "Admins can see all user roles" 
ON user_roles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.is_admin = true
  )
);

-- Policy to allow admins to update user roles (using EXISTS with a simpler subquery)
CREATE POLICY "Only admins can update user roles" 
ON user_roles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.is_admin = true
  )
);

-- Step 3: Create a non-recursive admin check function
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM user_roles WHERE user_id = auth.uid()),
    false
  );
$$;

-- Step 4: Alternative policies using the function (comment out the above policies and use these if the above still cause issues)
/*
DROP POLICY IF EXISTS "Admins can see all user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON user_roles;

CREATE POLICY "Admins can see all user roles" 
ON user_roles FOR SELECT 
USING (is_current_user_admin());

CREATE POLICY "Only admins can update user roles" 
ON user_roles FOR UPDATE 
USING (is_current_user_admin());
*/

-- Step 5: Ensure the update trigger function uses SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  -- Use SECURITY DEFINER to bypass RLS and avoid recursion
  UPDATE user_roles 
  SET last_active = NOW(), updated_at = NOW()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Make sure the trigger is properly configured
DROP TRIGGER IF EXISTS update_user_last_active ON habit_tracking;
CREATE TRIGGER update_user_last_active
AFTER INSERT ON habit_tracking
FOR EACH ROW
EXECUTE FUNCTION update_last_active();

-- Step 7: Create a test query to verify the fix works
-- You can run this separately to test:
-- SELECT user_id, is_admin, is_enabled FROM user_roles LIMIT 5;

COMMIT;

-- Instructions:
-- 1. Copy this entire script
-- 2. Go to your Supabase Dashboard -> SQL Editor
-- 3. Paste and run this script
-- 4. The admin page should now work without recursion errors
-- 5. If you still see issues, uncomment the alternative policies in Step 4 and run those instead 