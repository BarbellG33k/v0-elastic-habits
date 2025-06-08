-- Fix RLS Performance Issues and Duplicate Policies
-- Based on Supabase Advisor recommendations

-- First, drop all existing policies to clean up duplicates
DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON habits;

DROP POLICY IF EXISTS "Users can view their own habit tracking" ON habit_tracking;
DROP POLICY IF EXISTS "Users can create their own habit tracking" ON habit_tracking;
DROP POLICY IF EXISTS "Users can insert their own habit tracking" ON habit_tracking;
DROP POLICY IF EXISTS "Users can update their own habit tracking" ON habit_tracking;
DROP POLICY IF EXISTS "Users can delete their own habit tracking" ON habit_tracking;

DROP POLICY IF EXISTS "Admins can see all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can see their own role" ON user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can update their own last_active" ON user_roles;

-- Create optimized policies for habits table
CREATE POLICY "habits_select_policy" ON habits FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "habits_insert_policy" ON habits FOR INSERT  
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "habits_update_policy" ON habits FOR UPDATE
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "habits_delete_policy" ON habits FOR DELETE
USING ((select auth.uid()) = user_id);

-- Create optimized policies for habit_tracking table (consolidate duplicates)
CREATE POLICY "habit_tracking_select_policy" ON habit_tracking FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "habit_tracking_insert_policy" ON habit_tracking FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "habit_tracking_update_policy" ON habit_tracking FOR UPDATE
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "habit_tracking_delete_policy" ON habit_tracking FOR DELETE
USING ((select auth.uid()) = user_id);

-- Create optimized policies for user_roles table (consolidate multiple policies)
CREATE POLICY "user_roles_select_policy" ON user_roles FOR SELECT
USING (
  (select auth.uid()) = user_id OR 
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = (select auth.uid()) AND is_admin = TRUE
  )
);

CREATE POLICY "user_roles_update_policy" ON user_roles FOR UPDATE
USING (
  (select auth.uid()) = user_id OR 
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = (select auth.uid()) AND is_admin = TRUE
  )
)
WITH CHECK (
  (select auth.uid()) = user_id OR 
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = (select auth.uid()) AND is_admin = TRUE
  )
); 