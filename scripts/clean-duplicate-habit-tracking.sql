-- Script to clean up duplicate habit tracking entries
-- This script keeps only the highest level tracked for each activity on a given day

-- First, create a temporary table to identify duplicates
CREATE TEMP TABLE duplicate_tracking AS
WITH duplicates AS (
    SELECT 
        id,
        habit_id,
        user_id,
        date,
        activity_index,
        level_index,
        ROW_NUMBER() OVER (
            PARTITION BY habit_id, user_id, date, activity_index 
            ORDER BY level_index DESC
        ) as row_num
    FROM habit_tracking
)
SELECT id
FROM duplicates
WHERE row_num > 1;

-- Output the number of duplicates found
DO $$
DECLARE
    duplicate_count INT;
BEGIN
    SELECT COUNT(*) INTO duplicate_count FROM duplicate_tracking;
    RAISE NOTICE 'Found % duplicate tracking entries to remove', duplicate_count;
END $$;

-- Delete the duplicates
DELETE FROM habit_tracking
WHERE id IN (SELECT id FROM duplicate_tracking);

-- Drop the temporary table
DROP TABLE duplicate_tracking;

-- Verify the cleanup
DO $$
DECLARE
    remaining_duplicates INT;
BEGIN
    WITH duplicates AS (
        SELECT 
            habit_id,
            user_id,
            date,
            activity_index,
            COUNT(*) as entry_count
        FROM habit_tracking
        GROUP BY habit_id, user_id, date, activity_index
    )
    SELECT COUNT(*) INTO remaining_duplicates
    FROM duplicates
    WHERE entry_count > 1;
    
    IF remaining_duplicates > 0 THEN
        RAISE WARNING 'There are still % cases where multiple levels are tracked for the same activity on the same day', remaining_duplicates;
    ELSE
        RAISE NOTICE 'Successfully cleaned up all duplicate tracking entries';
    END IF;
END $$;
