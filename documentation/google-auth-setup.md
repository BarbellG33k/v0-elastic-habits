# Google Authentication Setup Guide

This guide will walk you through enabling Google authentication for your Momentum app using Supabase.

## Prerequisites

- A Supabase project with authentication enabled
- A Google Cloud Console account
- Your Momentum app environment variables configured

## Step 1: Set Up Google OAuth Credentials

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure billing is enabled (required for OAuth)

### 1.2 Enable Required APIs

1. Go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Google+ API** (if available)
   - **Google Identity** (if available)
   - **Google OAuth2 API**

### 1.3 Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: "Momentum App" (or your preferred name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Add test users if needed (for external apps in testing)

### 1.4 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Set the application name (e.g., "Momentum App")
5. Add these **Authorized redirect URIs**:
   ```
   https://exlennioiytnhmbhigvo.supabase.co/auth/v1/callback
   https://momentum.factor317.app/auth/callback
   http://localhost:3000/auth/callback
   ```
   
   **Important**: Replace the placeholders:
   - `your-supabase-project`: Your actual Supabase project URL (found in your Supabase dashboard)
   - `your-domain.com`: Your production domain (if you have one)

6. Click "Create"
7. **Save the Client ID and Client Secret** - you'll need these for the next step

## Step 2: Configure Supabase Authentication

### 2.1 Enable Google Provider in Supabase

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Authentication" > "Providers"
4. Find "Google" in the list and click on it
5. Toggle the "Enable" switch to turn it on

### 2.2 Add Google Credentials to Supabase

1. In the Google provider settings:
   - Paste your **Google Client ID** in the "Client ID" field
   - Paste your **Google Client Secret** in the "Client Secret" field
2. The "Redirect URL" should automatically be set to:
   ```
   https://your-supabase-project.supabase.co/auth/v1/callback
   ```
3. Click "Save" to apply the changes

## Step 3: Environment Variables

Make sure your `.env.local` file (or environment variables) contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase dashboard under "Settings" > "API".

## Step 4: Test the Integration

### 4.1 Test in Development

1. Start your development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Go to `http://localhost:3000/auth/sign-in`
3. Click the "Sign in with Google" button
4. Complete the Google OAuth flow
5. Verify you're redirected back to your app and signed in

### 4.2 Test in Production

1. Deploy your app to production
2. Test the complete Google sign-in flow
3. Verify redirects work correctly

## Step 5: Handle User Data (Optional)

### 5.1 Access Google Profile Data

After a user signs in with Google, you can access additional profile information:

```typescript
const { user } = useAuth()

// Google provides additional metadata
const googleProfile = user?.user_metadata
const fullName = googleProfile?.full_name
const avatarUrl = googleProfile?.avatar_url
const email = user?.email
```

### 5.2 Auto-Update User Profile

You can automatically update the user's profile with Google data:

```typescript
const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
  const { error } = await supabase.auth.updateUser({
    data,
  })
}
```

## Troubleshooting

### Common Issues

1. **"Redirect URI mismatch" error**
   - Ensure the redirect URIs in Google Console exactly match your Supabase configuration
   - Check for trailing slashes and protocol (http vs https)
   - Make sure you're using the correct Supabase project URL

2. **"Invalid client" error**
   - Verify your Google Client ID and Client Secret are correct
   - Make sure you copied them from the right OAuth 2.0 client

3. **"Access blocked" error**
   - Check if your app is still in testing mode
   - Add your email as a test user if using external OAuth consent screen
   - Verify your domain is properly configured

4. **CORS issues**
   - Ensure your domain is added to authorized domains in Google Console
   - Add both development and production domains

### Debug Steps

1. **Check browser console** for any JavaScript errors
2. **Check network tab** to see if OAuth requests are being made
3. **Verify Supabase logs** in the dashboard under "Logs" > "Auth"
4. **Test with a different browser** to rule out cache issues

### Environment-Specific Issues

#### Development
- Make sure `http://localhost:3000/auth/callback` is in your Google redirect URIs
- Verify your `.env.local` file has the correct Supabase credentials

#### Production
- Ensure your production domain is added to Google Console
- Verify your production environment variables are set correctly
- Check that your domain is verified in Google Console

## Security Best Practices

1. **Never expose Client Secret**
   - The Google Client Secret should only be used in Supabase configuration
   - Never include it in client-side code

2. **Use HTTPS in production**
   - Always use HTTPS for production redirects
   - Google requires HTTPS for production OAuth flows

3. **Regular credential rotation**
   - Periodically rotate your Google OAuth credentials
   - Update Supabase configuration when you do

4. **Monitor usage**
   - Keep an eye on your Google Cloud Console for unusual activity
   - Monitor Supabase auth logs for any suspicious sign-ins

## Next Steps

Once Google authentication is working:

1. **Test the complete user flow** from sign-up to sign-in
2. **Verify user data persistence** across sessions
3. **Test the sign-out functionality**
4. **Consider adding additional providers** (GitHub, Discord, etc.) if needed
5. **Implement user profile management** to handle Google profile data

## Support

If you encounter issues:

1. Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
2. Review [Google OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2)
3. Check the [Supabase community forums](https://github.com/supabase/supabase/discussions)
4. Review your browser's developer tools for specific error messages 