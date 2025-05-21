-- Make a user an admin (replace 'USER_ID' with the actual user ID)
UPDATE user_roles
SET is_admin = TRUE
WHERE user_id = 'USER_ID';
