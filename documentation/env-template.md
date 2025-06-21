# Environment Variables Template

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase dashboard under Settings > API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Service Role Key (for admin operations)
# Only use this in server-side code, never expose to client
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Example values (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0NzI5MCwiZXhwIjoxOTUyMTIzMjkwfQ.example_signature
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM2NTQ3MjkwLCJleHAiOjE5NTIxMjMyOTB9.example_service_signature
```

## How to find these values:

1. **Supabase URL**: Found in your Supabase dashboard under "Settings" > "API" > "Project URL"
2. **Anon Key**: Found in your Supabase dashboard under "Settings" > "API" > "Project API keys" > "anon public"
3. **Service Role Key**: Found in your Supabase dashboard under "Settings" > "API" > "Project API keys" > "service_role secret"

## Important Notes:

- The `.env.local` file should be in your project root (same level as `package.json`)
- Never commit this file to version control (it should be in `.gitignore`)
- For production, set these environment variables in your hosting platform (Vercel, Netlify, etc.)
- The `NEXT_PUBLIC_` prefix makes variables available to the client-side code
- The service role key should only be used in server-side code and API routes 