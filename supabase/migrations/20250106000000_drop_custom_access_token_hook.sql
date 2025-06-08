-- Drop the problematic custom_access_token_hook function
-- This function was causing JWT token generation failures

drop function if exists public.custom_access_token_hook(jsonb); 