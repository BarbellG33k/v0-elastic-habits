-- This script provides a comprehensive set of fixes for tracking-related issues

-- 1. Fix for habit_tracking table - ensure it has proper indexes
CREATE INDEX IF NOT EXISTS idx_habit_tracking_user_date 
ON habit_tracking(user_id, date);

CREATE INDEX IF NOT EXISTS idx_habit_tracking_habit_date 
ON habit_tracking(habit_id, date);

-- 2. Optimize the trigger function that updates user activity
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

-- 3. Make sure upserts work properly by fixing the uniqueness constraint if needed
DO $$
BEGIN
  -- Check if the constraint exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'habit_tracking_unique_activity_level' 
    AND table_name = 'habit_tracking'
  ) THEN
    -- Add a proper named constraint for upserts
    ALTER TABLE habit_tracking 
    ADD CONSTRAINT habit_tracking_unique_activity_level 
    UNIQUE (habit_id, date, activity_index, level_index, user_id);
  END IF;
END $$;

-- 4. Update the habit_tracking policies to be more efficient
ALTER TABLE habit_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE habit_tracking ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE POLICY "Users can view their own habit tracking"
ON habit_tracking FOR SELECT
USING (auth.uid() = user_id);

CREATE OR REPLACE POLICY "Users can create their own habit tracking"
ON habit_tracking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE POLICY "Users can update their own habit tracking"
ON habit_tracking FOR UPDATE
USING (auth.uid() = user_id);

CREATE OR REPLACE POLICY "Users can delete their own habit tracking"
ON habit_tracking FOR DELETE
USING (auth.uid() = user_id);
