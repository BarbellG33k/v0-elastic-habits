-- Script to completely remove all data related to a specific user
-- Replace 'user_email@example.com' with the actual email of the user you want to remove

-- First, find the user ID
DO $$
DECLARE
    target_user_id UUID;
    target_email TEXT := 'user_email@example.com'; -- REPLACE THIS WITH THE USER'S EMAIL
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', target_email;
    END IF;
    
    -- Output the user ID for confirmation
    RAISE NOTICE 'Removing data for user ID: %', target_user_id;
    
    -- Delete habit tracking data
    DELETE FROM habit_tracking
    WHERE user_id = target_user_id;
    
    -- Delete habits
    DELETE FROM habits
    WHERE user_id = target_user_id;
    
    -- Delete user role
    DELETE FROM user_roles
    WHERE user_id = target_user_id;
    
    -- Delete any storage objects (like avatars)
    -- This requires storage admin privileges
    DELETE FROM storage.objects
    WHERE bucket_id = 'user-avatars' AND path LIKE target_user_id || '%';
    
    -- Delete auth.identities (for OAuth connections)
    DELETE FROM auth.identities
    WHERE user_id = target_user_id;
    
    -- Delete auth.sessions
    DELETE FROM auth.sessions
    WHERE user_id = target_user_id;
    
    -- Delete auth.refresh_tokens
    DELETE FROM auth.refresh_tokens
    WHERE user_id = target_user_id;
    
    -- Finally, delete the user from auth.users
    -- Uncomment this if you want to completely remove the user
    -- DELETE FROM auth.users
    -- WHERE id = target_user_id;
    
    RAISE NOTICE 'Successfully removed all data for user with email: %', target_email;
END $$;
