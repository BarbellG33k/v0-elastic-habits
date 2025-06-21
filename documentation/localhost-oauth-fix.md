# Fixing Localhost OAuth Redirect Issue

If Google authentication redirects to your production URL instead of localhost when testing locally, follow these steps to fix it.

## The Problem

When you click "Sign in with Google" from `http://localhost:3000`, the authentication flow redirects you to your production URL instead of staying on localhost. This prevents you from testing local changes.

## Root Cause

This happens because:
1. Your Google OAuth configuration has the wrong redirect URIs
2. Supabase might be configured to use production URLs
3. The OAuth flow is not properly detecting the localhost environment

## Solution

### Step 1: Fix Google Cloud Console Configuration

1. **Go to Google Cloud Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Navigate to OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID and click on it
3. **Update Authorized Redirect URIs**:
   
   **Remove any production URLs temporarily** and add only:
   ```
   http://localhost:3000/auth/callback
   ```
   
   **Important**: Make sure there are no trailing slashes and the protocol is exactly `http://` (not `https://`)

4. **Save the changes**

### Step 2: Verify Supabase Configuration

1. **Go to Supabase Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Navigate to Authentication Settings**:
   - Go to "Authentication" > "URL Configuration"
   - Check the "Site URL" field
3. **Update Site URL for Development**:
   - Set it to: `http://localhost:3000`
   - Save the changes

### Step 3: Test the Fix

1. **Clear your browser cache and cookies** for localhost
2. **Restart your development server**:
   ```bash
   npm run dev
   ```
3. **Test the Google sign-in flow**:
   - Go to `http://localhost:3000/auth/sign-in`
   - Click "Sign in with Google"
   - Complete the OAuth flow
   - Verify you're redirected back to `http://localhost:3000`

### Step 4: Restore Production Configuration (When Ready)

Once localhost is working, you can add back your production redirect URI:

1. **In Google Cloud Console**, add your production redirect URI:
   ```
   https://your-production-domain.com/auth/callback
   ```
   
   Now you should have both:
   ```
   http://localhost:3000/auth/callback
   https://your-production-domain.com/auth/callback
   ```

2. **In Supabase**, update the Site URL to your production domain:
   ```
   https://your-production-domain.com
   ```

## Alternative Solutions

### Option 1: Use Environment-Specific Configuration

Create different OAuth clients for development and production:

1. **Development OAuth Client**:
   - Only has `http://localhost:3000/auth/callback`
   - Use this for local development

2. **Production OAuth Client**:
   - Only has `https://your-domain.com/auth/callback`
   - Use this for production

### Option 2: Use Supabase Environment Variables

You can configure different redirect URLs based on environment:

```typescript
const redirectUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/auth/callback'
  : 'https://your-domain.com/auth/callback'
```

## Debugging Steps

If the issue persists:

1. **Check Browser Network Tab**:
   - Open Developer Tools > Network
   - Look for the OAuth redirect request
   - Check what URL it's trying to redirect to

2. **Check Supabase Logs**:
   - Go to Supabase Dashboard > Logs > Auth
   - Look for authentication events
   - Check if there are any errors

3. **Verify OAuth Configuration**:
   - Double-check that `http://localhost:3000/auth/callback` is in your Google OAuth redirect URIs
   - Make sure there are no extra spaces or characters

4. **Test with Different Browser**:
   - Try testing in an incognito/private window
   - Try a different browser to rule out cache issues

## Common Mistakes

1. **Wrong Protocol**: Using `https://` instead of `http://` for localhost
2. **Trailing Slash**: Having `/auth/callback/` instead of `/auth/callback`
3. **Wrong Port**: Using port 3001 or 8080 instead of 3000
4. **Cached Configuration**: Browser or Supabase caching old settings

## Verification Checklist

- [ ] Google OAuth has `http://localhost:3000/auth/callback` in redirect URIs
- [ ] Supabase Site URL is set to `http://localhost:3000`
- [ ] Browser cache and cookies cleared
- [ ] Development server restarted
- [ ] Testing in incognito/private window
- [ ] No trailing slashes in URLs
- [ ] Correct protocol (http for localhost, https for production)

## If Still Not Working

1. **Check your Supabase project URL** in the dashboard
2. **Verify your environment variables** are correct
3. **Try creating a new OAuth client** specifically for development
4. **Contact Supabase support** if the issue persists

## Production Deployment

When deploying to production:

1. **Update Google OAuth** to include your production domain
2. **Update Supabase Site URL** to your production domain
3. **Set environment variables** in your hosting platform
4. **Test the complete flow** in production

Remember: Always test OAuth flows in both development and production environments before releasing to users. 