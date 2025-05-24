import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://momentum.factor317.app"

// Create a single supabase client for the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use the app URL for redirects
    redirectTo: `${appUrl}/auth/callback`,
  },
})
