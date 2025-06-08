-- Fix get_all_user_roles function to use database-based admin checks
-- instead of JWT claims (which are disabled)

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
  -- Check if the current user is an admin via database lookup
  -- instead of JWT claims
  if not exists (
    select 1 from public.user_roles 
    where user_id = auth.uid() and is_admin = true
  ) then
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

-- Also update the is_claims_admin function to use database checks
create or replace function is_claims_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Use database lookup instead of JWT claims
  return exists (
    select 1 from public.user_roles 
    where user_id = auth.uid() and is_admin = true
  );
end;
$$; 