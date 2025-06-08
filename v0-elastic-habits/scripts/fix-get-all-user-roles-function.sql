-- Update get_all_user_roles function to use the new is_user_admin function
-- and fix data type mismatches
DROP FUNCTION IF EXISTS get_all_user_roles();
CREATE OR REPLACE FUNCTION get_all_user_roles()
RETURNS TABLE (
    user_id uuid,
    email varchar(255),  -- Changed from text to varchar(255) to match auth.users
    full_name text,
    is_admin boolean,
    is_enabled boolean,
    created_at timestamptz,
    updated_at timestamptz,
    last_sign_in_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER -- This is crucial for bypassing RLS
SET search_path = public
AS $$
BEGIN
  -- Check if the current user is an admin using our new function
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'access denied: user is not an admin';
  END IF;

  RETURN QUERY
  SELECT
      u.id as user_id,
      u.email,
      COALESCE(u.raw_user_meta_data->>'full_name', '') as full_name,
      COALESCE(ur.is_admin, false) as is_admin,
      COALESCE(ur.is_enabled, true) as is_enabled,
      u.created_at,
      ur.updated_at,
      u.last_sign_in_at
  FROM
      auth.users u
  LEFT JOIN
      public.user_roles ur ON u.id = ur.user_id
  ORDER BY 
      u.created_at DESC;
END;
$$; 