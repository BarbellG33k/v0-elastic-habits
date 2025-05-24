# Fixing Authentication Redirect URLs

When users sign up and receive confirmation emails, the links in those emails should point to your production domain, not localhost. This document explains how to fix this issue.

## The Problem

When a user signs up, the confirmation email contains links that point to `localhost:3000` instead of your production domain (`momentum.factor317.app`). This happens because:

1. The Supabase project's Site URL is set to localhost
2. The redirect URLs list may not include your production domain
3. Email templates might have hardcoded localhost URLs

## Solution

### 1. Update Site URL in Supabase Dashboard

1. Log in to your Supabase dashboard
2. Go to Authentication → Settings → URL Configuration
3. Update the Site URL to `https://momentum.factor317.app`
4. Add `https://momentum.factor317.app/auth/callback` to the Redirect URLs list
5. Save changes

### 2. Run the SQL Script

Execute the provided SQL script `fix-auth-redirect-urls.sql` in the Supabase SQL editor. This script:
- Updates the site_url in auth.config
- Adds your production domain to the redirect URLs list
- Removes any duplicate redirect URLs

### 3. Update Email Templates

1. In the Supabase dashboard, go to Authentication → Email Templates
2. Check each template (Confirmation, Invite, Magic Link, Recovery) for any hardcoded URLs
3. Replace any instances of `localhost:3000` with `momentum.factor317.app`
4. Save each template after making changes

### 4. Test the Fix

1. Create a test user account
2. Check the confirmation email received
3. Verify that all links point to your production domain
4. Complete the signup process to ensure it works end-to-end

## Additional Considerations

### Environment Variables

If your application uses environment variables for the site URL, make sure they're correctly set in your production environment:

\`\`\`
NEXT_PUBLIC_APP_URL=https://momentum.factor317.app
\`\`\`

### OAuth Providers

If you're using OAuth providers (like Google), make sure their redirect URLs are also updated in both:
1. The provider's developer console
2. Your Supabase OAuth provider settings

### Custom Email Server

If you're using a custom SMTP server for sending emails, verify that the email templates there are also updated.
