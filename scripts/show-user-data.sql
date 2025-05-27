-- Script to show all data related to a specific user
-- Replace 'gsalast@gmail.com' with the actual email of the user you want to view
-- IMPORTANT: After running, check the "Messages" or "Notices" tab in your SQL editor for output from this script.

DO $$
DECLARE
    target_user_id UUID;
    target_email TEXT := 'gsalast@gmail.com'; -- <<< VERY IMPORTANT: REPLACE THIS WITH THE USER'S ACTUAL EMAIL
    user_record RECORD; -- Generic record for looping
    habit_count INT;
    tracking_count INT;
    session_count INT;
    identity_count INT;
    storage_count INT;
    storage_schema_exists BOOLEAN; -- Renamed for clarity
    loop_item_counter INT; -- To count items within loops for display
BEGIN
    RAISE NOTICE '==========================================================================';
    RAISE NOTICE 'SCRIPT EXECUTION STARTED.';
    RAISE NOTICE 'Target email set to: %', target_email;
    RAISE NOTICE 'Please ensure you are looking in the "Messages" or "Notices" tab for detailed output.';
    RAISE NOTICE '==========================================================================';

    -- Step 1: Get the user ID from auth.users
    RAISE NOTICE E'\nAttempting to find user ID for email: % ...', target_email;
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE NOTICE 'RESULT: User with email "%" NOT FOUND in auth.users table.', target_email;
        RAISE NOTICE 'SCRIPT HALTED. Please verify the email address is correct and exists in auth.users.';
        RAISE EXCEPTION 'User with email "%" not found. Script cannot proceed.', target_email; -- This should definitely show up
        RETURN; -- Explicitly exit, though EXCEPTION should halt it
    END IF;
    
    RAISE NOTICE 'SUCCESS: User ID found: % for email: %', target_user_id, target_email;
    RAISE NOTICE '==========================================================================';
    
    -- Step 2: Display user details from auth.users
    RAISE NOTICE E'\n======= USER INFORMATION (from auth.users) =======';
    FOR user_record IN SELECT * FROM auth.users WHERE id = target_user_id LOOP
        RAISE NOTICE '  User ID: %', user_record.id;
        RAISE NOTICE '  Email: %', user_record.email;
        RAISE NOTICE '  Created At: %', user_record.created_at;
        RAISE NOTICE '  Updated At: %', user_record.updated_at;
        RAISE NOTICE '  Last Sign In At: %', user_record.last_sign_in_at;
        RAISE NOTICE '  Phone: %', user_record.phone;
        RAISE NOTICE '  Role: %', user_record.role;
        RAISE NOTICE '  Email Confirmed At: %', user_record.email_confirmed_at;
        RAISE NOTICE '  Phone Confirmed At: %', user_record.phone_confirmed_at;
        RAISE NOTICE '  Raw User Meta Data: %', user_record.raw_user_meta_data; -- Often contains custom claims or profile info
        RAISE NOTICE '  Raw App Meta Data: %', user_record.raw_app_meta_data;   -- Often contains provider info, roles
    END LOOP;
    RAISE NOTICE '--------------------------------------------------------------------------';
    
    -- Step 3: Display user role information from public.user_roles
    -- IMPORTANT: If your 'user_roles' table is not in the 'public' schema, change 'public.user_roles' below.
    RAISE NOTICE E'\n======= USER ROLE (from public.user_roles) =======';
    loop_item_counter := 0;
    FOR user_record IN (
        SELECT * FROM public.user_roles WHERE user_id = target_user_id
    ) LOOP
        loop_item_counter := loop_item_counter + 1;
        RAISE NOTICE '  Role Record %:', loop_item_counter;
        RAISE NOTICE '    Is admin: %', user_record.is_admin;
        RAISE NOTICE '    Is enabled: %', user_record.is_enabled;
        RAISE NOTICE '    Last active: %', user_record.last_active;
        RAISE NOTICE '    Created at: %', user_record.created_at;
        RAISE NOTICE '    Updated at: %', user_record.updated_at;
        -- Add any other relevant columns from your user_roles table
    END LOOP;
    IF loop_item_counter = 0 THEN
        RAISE NOTICE '  No records found in public.user_roles for this user.';
        RAISE NOTICE '  (If you expect data, check if the table name "public.user_roles" and column "user_id" are correct).';
    END IF;
    RAISE NOTICE '--------------------------------------------------------------------------';
    
    -- Step 4: Count and list habits from public.habits
    -- IMPORTANT: If your 'habits' table is not in the 'public' schema, change 'public.habits' below.
    SELECT COUNT(*) INTO habit_count FROM public.habits WHERE user_id = target_user_id;
    RAISE NOTICE E'\n======= HABITS (from public.habits) - Total Found: % =======', habit_count;
    loop_item_counter := 0;
    FOR user_record IN (
        SELECT * FROM public.habits WHERE user_id = target_user_id ORDER BY created_at DESC
    ) LOOP
        loop_item_counter := loop_item_counter + 1;
        RAISE NOTICE '  Habit Record %:', loop_item_counter;
        RAISE NOTICE '    Habit ID: %', user_record.id;
        RAISE NOTICE '    Name: %', user_record.name;
        RAISE NOTICE '    Activities (JSONB): %', user_record.activities::text; -- Cast JSONB to text for display
        RAISE NOTICE '    Created at: %', user_record.created_at;
        RAISE NOTICE '    ------------------------';
    END LOOP;
    IF loop_item_counter = 0 AND habit_count = 0 THEN
        RAISE NOTICE '  No records found in public.habits for this user.';
        RAISE NOTICE '  (If you expect data, check if table name "public.habits" and column "user_id" are correct).';
    END IF;
    RAISE NOTICE '--------------------------------------------------------------------------';
    
    -- Step 5: Count and list habit tracking entries from public.habit_tracking
    -- IMPORTANT: If your 'habit_tracking' table is not in the 'public' schema, change 'public.habit_tracking' below.
    SELECT COUNT(*) INTO tracking_count FROM public.habit_tracking WHERE user_id = target_user_id;
    RAISE NOTICE E'\n======= HABIT TRACKING (from public.habit_tracking) - Total Found: % (Showing up to 20 recent) =======', tracking_count;
    loop_item_counter := 0;
    FOR user_record IN (
        SELECT 
            ht.id,
            h.name as habit_name, -- From joined habits table
            ht.date,
            ht.activity_index,
            ht.level_index,
            ht.timestamp
        FROM public.habit_tracking ht
        JOIN public.habits h ON ht.habit_id = h.id -- Assumes habit_id in habit_tracking links to id in habits
        WHERE ht.user_id = target_user_id
        ORDER BY ht.date DESC, ht.timestamp DESC
        LIMIT 20 
    ) LOOP
        loop_item_counter := loop_item_counter + 1;
        RAISE NOTICE '  Tracking Record %:', loop_item_counter;
        RAISE NOTICE '    Tracking ID: %', user_record.id;
        RAISE NOTICE '    Habit Name: %', user_record.habit_name;
        RAISE NOTICE '    Date: %', user_record.date;
        RAISE NOTICE '    Activity Index: %', user_record.activity_index;
        RAISE NOTICE '    Level Index: %', user_record.level_index;
        RAISE NOTICE '    Timestamp: %', user_record.timestamp;
        RAISE NOTICE '    ------------------------';
    END LOOP;
    
    IF loop_item_counter = 0 AND tracking_count = 0 THEN
        RAISE NOTICE '  No records found in public.habit_tracking for this user.';
        RAISE NOTICE '  (If you expect data, check table names, join condition, and "user_id" column).';
    ELSIF tracking_count > 20 THEN
        RAISE NOTICE '  ... and % more tracking entries (not shown).', tracking_count - 20;
    END IF;
    RAISE NOTICE '--------------------------------------------------------------------------';
    
    -- Step 6: Count and list auth sessions
    SELECT COUNT(*) INTO session_count FROM auth.sessions WHERE user_id = target_user_id;
    RAISE NOTICE E'\n======= AUTH SESSIONS (from auth.sessions) - Total Found: % =======', session_count;
    loop_item_counter := 0;
    FOR user_record IN (
        SELECT * FROM auth.sessions WHERE user_id = target_user_id ORDER BY created_at DESC
    ) LOOP
        loop_item_counter := loop_item_counter + 1;
        RAISE NOTICE '  Session Record %:', loop_item_counter;
        RAISE NOTICE '    Session ID: %', user_record.id;
        RAISE NOTICE '    Created at: %', user_record.created_at;
        RAISE NOTICE '    Updated at: %', user_record.updated_at;
        RAISE NOTICE '    Factor ID: %', user_record.factor_id;
        RAISE NOTICE '    AAL: %', user_record.aal;
        RAISE NOTICE '    Not After: %', user_record.not_after;
        RAISE NOTICE '    ------------------------';
    END LOOP;
    IF loop_item_counter = 0 AND session_count = 0 THEN
        RAISE NOTICE '  No records found in auth.sessions for this user.';
    END IF;
    RAISE NOTICE '--------------------------------------------------------------------------';
    
    -- Step 7: Count and list identities (OAuth connections)
    SELECT COUNT(*) INTO identity_count FROM auth.identities WHERE user_id = target_user_id;
    RAISE NOTICE E'\n======= AUTH IDENTITIES (from auth.identities) - Total Found: % =======', identity_count;
    loop_item_counter := 0;
    FOR user_record IN (
        SELECT * FROM auth.identities WHERE user_id = target_user_id
    ) LOOP
        loop_item_counter := loop_item_counter + 1;
        RAISE NOTICE '  Identity Record %:', loop_item_counter;
        RAISE NOTICE '    Provider: %', user_record.provider;
        RAISE NOTICE '    Identity ID (provider specific): %', user_record.id; -- This is the provider's ID for the user, not Supabase user_id
        RAISE NOTICE '    Identity Data (JSONB): %', user_record.identity_data::text; -- Cast JSONB to text
        RAISE NOTICE '    Created at: %', user_record.created_at;
        RAISE NOTICE '    Last Sign In At: %', user_record.last_sign_in_at;
        RAISE NOTICE '    ------------------------';
    END LOOP;
    IF loop_item_counter = 0 AND identity_count = 0 THEN
        RAISE NOTICE '  No records found in auth.identities for this user.';
    END IF;
    RAISE NOTICE '--------------------------------------------------------------------------';
    
    -- Step 8: Check and list storage objects
    RAISE NOTICE E'\n======= STORAGE OBJECTS (from storage.objects, bucket "user-avatars") =======';
    BEGIN
        SELECT EXISTS (
            SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage'
        ) INTO storage_schema_exists;
        
        IF storage_schema_exists THEN
            SELECT COUNT(*) INTO storage_count 
            FROM storage.objects
            WHERE bucket_id = 'user-avatars' AND name LIKE target_user_id::text || '%'; -- Ensure user_id is cast for LIKE
            
            RAISE NOTICE '  Total objects in bucket "user-avatars" matching user ID prefix: %', storage_count;
            loop_item_counter := 0;
            FOR user_record IN (
                SELECT * FROM storage.objects
                WHERE bucket_id = 'user-avatars' AND name LIKE target_user_id::text || '%'
                ORDER BY created_at DESC
            ) LOOP
                loop_item_counter := loop_item_counter + 1;
                RAISE NOTICE '  Storage Object %:', loop_item_counter;
                RAISE NOTICE '    Object Name: %', user_record.name;
                RAISE NOTICE '    Bucket ID: %', user_record.bucket_id;
                RAISE NOTICE '    Owner (User ID): %', user_record.owner;
                RAISE NOTICE '    Metadata (JSONB): %', user_record.metadata::text; -- Cast JSONB to text
                RAISE NOTICE '    Path Tokens: %', user_record.path_tokens;
                RAISE NOTICE '    Created at: %', user_record.created_at;
                RAISE NOTICE '    Updated at: %', user_record.updated_at;
                RAISE NOTICE '    ------------------------';
            END LOOP;
            IF loop_item_counter = 0 AND storage_count = 0 THEN
                RAISE NOTICE '  No objects found in storage.objects for this user in bucket "user-avatars".';
            END IF;
        ELSE
            RAISE NOTICE '  Storage schema ("storage") not found or not accessible.';
        END IF;
    EXCEPTION 
        WHEN insufficient_privilege THEN
            RAISE WARNING '  Error accessing storage.objects: Insufficient privilege. You might need to run this as a superuser or adjust permissions.';
        WHEN undefined_table THEN
            RAISE WARNING '  Error accessing storage.objects: Table not found. Ensure storage is enabled and the table exists.';
        WHEN OTHERS THEN
            RAISE WARNING '  Error accessing storage.objects: %', SQLERRM;
    END;
    RAISE NOTICE '--------------------------------------------------------------------------';
    
    RAISE NOTICE E'\n==========================================================================';
    RAISE NOTICE 'SCRIPT EXECUTION FINISHED.';
    RAISE NOTICE 'Checked data for user with email: % (ID: %)', target_email, target_user_id;
    RAISE NOTICE 'If you saw "User with email ... NOT FOUND", please verify the email address and try again.';
    RAISE NOTICE 'Otherwise, review the notices above for data from each table.';
    RAISE NOTICE '==========================================================================';

END $$;