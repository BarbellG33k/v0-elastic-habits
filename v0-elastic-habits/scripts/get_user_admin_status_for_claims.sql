-- File: v0-elastic-habits/scripts/get_user_admin_status_for_claims.sql
-- Purpose: PostgreSQL function to retrieve a user's admin status.
-- This will be called by a Supabase Edge Function (Token Hook).

CREATE OR REPLACE FUNCTION public.get_user_admin_status(user_id_to_check uuid)
RETURNS boolean AS $$
DECLARE
  is_admin_status boolean;
BEGIN
  -- Fetches the is_admin flag from the user_roles table.
  -- Ensure this function has the necessary permissions or is called by a role that does.
  -- Using SECURITY DEFINER allows it to run with the permissions of the function owner.
  SELECT COALESCE(is_admin, false) INTO is_admin_status
  FROM public.user_roles -- Assuming your user_roles table is in the public schema
  WHERE user_id = user_id_to_check;

  RETURN is_admin_status; -- Returns true if admin, false otherwise (including if no record found)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Optional: Grant execute permission if your Edge Function is not using the service_role key
-- or if there are specific security configurations. Generally, with service_role and SECURITY DEFINER,
-- this might not be strictly necessary, but good to be aware of.
-- GRANT EXECUTE ON FUNCTION public.get_user_admin_status(uuid) TO supabase_auth_admin; -- Or relevant role
-- GRANT EXECUTE ON FUNCTION public.get_user_admin_status(uuid) TO authenticated; 