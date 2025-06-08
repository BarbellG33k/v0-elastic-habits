-- Verify admin user exists and has proper permissions
-- Replace 'your-admin-user-id' with your actual user ID

-- Check if user exists in user_roles table
SELECT 'Current user_roles entries:' as status;
SELECT user_id, is_admin, is_enabled, created_at 
FROM user_roles 
ORDER BY created_at DESC;

-- Check if specific admin user exists
SELECT 'Admin user status:' as status;
SELECT user_id, is_admin, is_enabled 
FROM user_roles 
WHERE user_id = '81c3d70c-7467-43f2-8f7d-5ee0a8d528bc';

-- If user doesn't exist, create entry
INSERT INTO user_roles (user_id, is_admin, is_enabled)
VALUES ('81c3d70c-7467-43f2-8f7d-5ee0a8d528bc', true, true)
ON CONFLICT (user_id) 
DO UPDATE SET 
    is_admin = true,
    is_enabled = true,
    updated_at = NOW();

-- Verify the update
SELECT 'Updated admin user status:' as status;
SELECT user_id, is_admin, is_enabled, updated_at 
FROM user_roles 
WHERE user_id = '81c3d70c-7467-43f2-8f7d-5ee0a8d528bc'; 