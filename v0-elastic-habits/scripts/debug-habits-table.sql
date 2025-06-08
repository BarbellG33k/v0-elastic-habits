-- Debug script to check habits table and policies

-- Check if habits table exists
SELECT 'Habits table exists:' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'habits';

-- Check habits table structure
SELECT 'Habits table structure:' as status;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'habits'
ORDER BY ordinal_position;

-- Check RLS policies on habits table
SELECT 'Habits table policies:' as status;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'habits';

-- Check if table has RLS enabled
SELECT 'RLS status:' as status;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'habits';

-- Test basic query as current user
SELECT 'Sample habits data:' as status;
SELECT id, name, user_id, created_at 
FROM habits 
LIMIT 5; 