-- This function acts as the Custom Access Token Hook. It is called by Supabase Auth
-- every time a new JWT is created.
-- It must accept a jsonb object (the JWT claims) and return a jsonb object
-- which will be merged into the token's `app_metadata`.

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable -- Denotes the function is read-only and safe.
security definer -- Allows the function to bypass RLS to read the user_roles table.
as $$
declare
  user_id_val uuid;
  is_admin_status boolean;
  claims jsonb;
begin
  -- The user's ID is in the 'sub' (subject) field of the JWT claims.
  -- We must safely extract and cast it to a UUID.
  begin
    user_id_val := (event->>'sub')::uuid;
  exception
    -- If the 'sub' claim is missing or not a valid UUID, we cannot determine
    -- the user's role. We must return a default non-admin claim.
    when others then
      return jsonb_build_object(
        'app_metadata', jsonb_build_object(
          'custom_is_admin', false
        )
      );
  end;

  -- If the UUID is null after casting, it's also an invalid state.
  if user_id_val is null then
    return jsonb_build_object(
      'app_metadata', jsonb_build_object(
        'custom_is_admin', false
      )
    );
  end if;

  -- Now that we have a valid user ID, check the user_roles table.
  select is_admin into is_admin_status
  from public.user_roles
  where user_id = user_id_val;

  -- Build the custom claims. `coalesce` handles the case where the user
  -- might not have an entry in user_roles, defaulting their status to false.
  -- For auth hooks, we need to return the claims in app_metadata format
  claims := jsonb_build_object(
    'app_metadata', jsonb_build_object(
      'custom_is_admin', coalesce(is_admin_status, false)
    )
  );

  return claims;

-- A final, top-level exception handler to ensure that no matter what fails
-- inside this function, it will never crash the user's login.
exception
  when others then
    return jsonb_build_object(
      'app_metadata', jsonb_build_object(
        'custom_is_admin', false
      )
    );
end;
$$;

-- Grant execution rights to the 'supabase_auth_admin' role, which is the special
-- internal role that Supabase uses to execute auth hooks.
grant execute on function public.custom_access_token_hook to supabase_auth_admin;