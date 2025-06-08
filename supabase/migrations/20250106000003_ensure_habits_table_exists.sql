-- Ensure habits table exists with proper structure and policies

-- Create habits table if it doesn't exist
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activities JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habit_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS habit_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activity_index INTEGER NOT NULL,
  level_index INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, date, activity_index, level_index)
);

-- Enable RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_tracking ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
DROP POLICY IF EXISTS "Users can create their own habits" ON habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON habits;

DROP POLICY IF EXISTS "Users can view their own habit tracking" ON habit_tracking;
DROP POLICY IF EXISTS "Users can create their own habit tracking" ON habit_tracking;
DROP POLICY IF EXISTS "Users can insert their own habit tracking" ON habit_tracking;
DROP POLICY IF EXISTS "Users can update their own habit tracking" ON habit_tracking;
DROP POLICY IF EXISTS "Users can delete their own habit tracking" ON habit_tracking;

-- The optimized policies should already be created by the previous migration
-- But let's ensure they exist for habits and habit_tracking tables

-- Habits policies (if not already created by previous migration)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'habits' 
    AND policyname = 'habits_select_policy'
  ) THEN
    CREATE POLICY "habits_select_policy" ON habits FOR SELECT
    USING ((select auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'habits' 
    AND policyname = 'habits_insert_policy'
  ) THEN
    CREATE POLICY "habits_insert_policy" ON habits FOR INSERT  
    WITH CHECK ((select auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'habits' 
    AND policyname = 'habits_update_policy'
  ) THEN
    CREATE POLICY "habits_update_policy" ON habits FOR UPDATE
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'habits' 
    AND policyname = 'habits_delete_policy'
  ) THEN
    CREATE POLICY "habits_delete_policy" ON habits FOR DELETE
    USING ((select auth.uid()) = user_id);
  END IF;
END$$; 