-- Script to show all data related to a specific user
-- Replace 'user_email@example.com' with the actual email of the user you want to view

DO $$
DECLARE
    target_user_id UUID;
    target_email TEXT := 'user_email@example.com'; -- REPLACE THIS WITH THE USER'S EMAIL
    user_record RECORD;
    habit_count INT;
    tracking_count INT;
    session_count INT;
    identity_count INT;
    storage_count INT;
    storage_exists BOOLEAN;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', target_email;
    END IF;
    
    -- Output the user ID for reference
    RAISE NOTICE '======= USER INFORMATION =======';
    RAISE NOTICE 'User ID: %', target_user_id;
    RAISE NOTICE 'Email: %', target_email;
    
    -- Get and display user details
    SELECT * INTO user_record FROM auth.users WHERE id = target_user_id;
    RAISE NOTICE 'Created at: %', user_record.created_at;
    RAISE NOTICE 'Last sign in: %', user_record.last_sign_in_at;
    RAISE NOTICE 'User metadata: %', user_record.raw_user_meta_data;
    
    -- Get and display user role information
    RAISE NOTICE '';
    RAISE NOTICE '======= USER ROLE =======';
    FOR user_record IN (
        SELECT * FROM user_roles WHERE user_id = target_user_id
    ) LOOP
        RAISE NOTICE 'Is admin: %', user_record.is_admin;
        RAISE NOTICE 'Is enabled: %', user_record.is_enabled;
        RAISE NOTICE 'Last active: %', user_record.last_active;
        RAISE NOTICE 'Created at: %', user_record.created_at;
        RAISE NOTICE 'Updated at: %', user_record.updated_at;
    END LOOP;
    
    -- Count and list habits
    SELECT COUNT(*) INTO habit_count FROM habits WHERE user_id = target_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '======= HABITS (%): =======', habit_count;
    
    FOR user_record IN (
        SELECT * FROM habits WHERE user_id = target_user_id ORDER BY created_at DESC
    ) LOOP
        RAISE NOTICE 'Habit ID: %', user_record.id;
        RAISE NOTICE 'Name: %', user_record.name;
        RAISE NOTICE 'Activities: %', user_record.activities;
        RAISE NOTICE 'Created at: %', user_record.created_at;
        RAISE NOTICE '------------------------';
    END LOOP;
    
    -- Count and list habit tracking entries
    SELECT COUNT(*) INTO tracking_count FROM habit_tracking WHERE user_id = target_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '======= HABIT TRACKING (%): =======', tracking_count;
    
    FOR user_record IN (
        SELECT 
            ht.id,
            h.name as habit_name,
            ht.date,
            ht.activity_index,
            ht.level_index,
            ht.timestamp
        FROM habit_tracking ht
        JOIN habits h ON ht.habit_id = h.id
        WHERE ht.user_id = target_user_id
        ORDER BY ht.date DESC, ht.timestamp DESC
        LIMIT 20 -- Limit to the 20 most recent entries to avoid excessive output
    ) LOOP
        RAISE NOTICE 'Tracking ID: %', user_record.id;
        RAISE NOTICE 'Habit: %', user_record.habit_name;
        RAISE NOTICE 'Date: %', user_record.date;
        RAISE NOTICE 'Activity Index: %', user_record.activity_index;
        RAISE NOTICE 'Level Index: %', user_record.level_index;
        RAISE NOTICE 'Timestamp: %', user_record.timestamp;
        RAISE NOTICE '------------------------';
    END LOOP;
    
    IF tracking_count > 20 THEN
        RAISE NOTICE '... and % more tracking entries (showing only the 20 most recent)', tracking_count - 20;
    END IF;
    
    -- Count and list auth sessions
    SELECT COUNT(*) INTO session_count FROM auth.sessions WHERE user_id = target_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '======= AUTH SESSIONS (%): =======', session_count;
    
    FOR user_record IN (
        SELECT * FROM auth.sessions WHERE user_id = target_user_id ORDER BY created_at DESC
    ) LOOP
        RAISE NOTICE 'Session ID: %', user_record.id;
        RAISE NOTICE 'Created at: %', user_record.created_at;
        RAISE NOTICE 'Updated at: %', user_record.updated_at;
        RAISE NOTICE 'Factor ID: %', user_record.factor_id;
        RAISE NOTICE '------------------------';
    END LOOP;
    
    -- Count and list identities (OAuth connections)
    SELECT COUNT(*) INTO identity_count FROM auth.identities WHERE user_id = target_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '======= AUTH IDENTITIES (%): =======', identity_count;
    
    FOR user_record IN (
        SELECT * FROM auth.identities WHERE user_id = target_user_id
    ) LOOP
        RAISE NOTICE 'Provider: %', user_record.provider;
        RAISE NOTICE 'Identity ID: %', user_record.id;
        RAISE NOTICE 'Created at: %', user_record.created_at;
        RAISE NOTICE 'Updated at: %', user_record.updated_at;
        RAISE NOTICE '------------------------';
    END LOOP;
    
    -- Check if storage.objects table exists and has the expected structure
    BEGIN
        -- First check if the storage schema exists
        SELECT EXISTS (
            SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage'
        ) INTO storage_exists;
        
        IF storage_exists THEN
            -- Check for storage objects (like avatars)
            -- Using "name" column instead of "path"
            SELECT COUNT(*) INTO storage_count 
            FROM storage.objects
            WHERE bucket_id = 'user-avatars' AND name LIKE target_user_id || '%';
            
            RAISE NOTICE '';
            RAISE NOTICE '======= STORAGE OBJECTS (%): =======', storage_count;
            
            FOR user_record IN (
                SELECT * FROM storage.objects
                WHERE bucket_id = 'user-avatars' AND name LIKE target_user_id || '%'
            ) LOOP
                RAISE NOTICE 'Name: %', user_record.name;
                RAISE NOTICE 'Size: % bytes', user_record.metadata->>'size';
                RAISE NOTICE 'Content Type: %', user_record.metadata->>'mimetype';
                RAISE NOTICE 'Created at: %', user_record.created_at;
                RAISE NOTICE 'Updated at: %', user_record.updated_at;
                RAISE NOTICE '------------------------';
            END LOOP;
        ELSE
            RAISE NOTICE '';
            RAISE NOTICE '======= STORAGE OBJECTS: =======';
            RAISE NOTICE 'Storage schema not found or not accessible';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '';
        RAISE NOTICE '======= STORAGE OBJECTS: =======';
        RAISE NOTICE 'Error accessing storage objects: %', SQLERRM;
    END;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Successfully displayed all data for user with email: %', target_email;
END $$;
