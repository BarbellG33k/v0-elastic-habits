-- Script to update Supabase authentication redirect URLs
-- Replace 'momentum.factor317.app' with your actual domain if different

-- Update the auth.identities table to use the correct site URL
UPDATE auth.config
SET site_url = 'https://momentum.factor317.app'
WHERE site_url = 'http://localhost:3000' OR site_url IS NULL;

-- Update redirect URLs in the auth settings
UPDATE auth.config
SET additional_redirect_urls = array_append(
  CASE 
    WHEN additional_redirect_urls IS NULL THEN ARRAY[]::text[] 
    ELSE additional_redirect_urls 
  END,
  'https://momentum.factor317.app/auth/callback'
);

-- Make sure the redirect URL doesn't have duplicates
UPDATE auth.config
SET additional_redirect_urls = ARRAY(
  SELECT DISTINCT unnest(additional_redirect_urls)
);

-- Update the email templates to use the correct URL
-- This is a more advanced operation that requires updating the email templates
-- You may need to do this through the Supabase dashboard
