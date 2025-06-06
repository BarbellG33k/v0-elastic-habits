-- supabase/migrations/$(date +%Y%m%d%H%M%S)_create_get_all_user_roles_function.sql

-- This function is owned by the postgres user, and we grant execute to the service_role.
-- This means it will run with the permissions of the 'service_role' and bypass RLS,
-- which is necessary to get a list of all users.
--
-- We explicitly define the columns to be returned, joining auth.users and public.user_roles.
-- This keeps the data structure consistent and avoids exposing sensitive fields.
--
-- SECURITY: We add a check `is_claims_admin()` at the beginning. This ensures that only
-- a user who has been identified as an admin via their JWT claims can execute this function.
-- This is a critical security layer. `is_claims_admin()` is a function we need to create.

create or replace function get_all_user_roles()
returns table (
    user_id uuid,
    email text,
    full_name text,
    is_admin boolean,
    is_enabled boolean,
    created_at timestamptz,
    updated_at timestamptz,
    last_sign_in_at timestamptz
)
language plpgsql
security definer -- This is crucial for bypassing RLS
set search_path = public
as $$
begin
  -- First, ensure the caller is an admin by checking their JWT claims.
  -- This is a robust security check.
  if not is_claims_admin() then
    raise exception 'access denied: user is not an admin';
  end if;

  return query
  select
      u.id as user_id,
      u.email,
      u.raw_user_meta_data->>'full_name' as full_name,
      coalesce(ur.is_admin, false) as is_admin,
      coalesce(ur.is_enabled, true) as is_enabled,
      u.created_at,
      ur.updated_at,
      u.last_sign_in_at
  from
      auth.users u
  left join
      public.user_roles ur on u.id = ur.user_id
  order by 
      u.created_at desc;
end;
$$;

-- Grant execution rights to the 'service_role' so it can be called from our app
grant execute on function public.get_all_user_roles() to service_role;

-- We also need the helper function that checks the JWT claim.
-- This should also be a SECURITY DEFINER function to access the claims.
create or replace function is_claims_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  is_admin_claim boolean;
begin
  -- It's good practice to default to false
  is_admin_claim := coalesce((auth.jwt() -> 'app_metadata' ->> 'custom_is_admin')::boolean, false);
  return is_admin_claim;
end;
$$;

-- Grant usage to authenticated users so they can call this helper inside other functions.
grant execute on function public.is_claims_admin() to authenticated; 