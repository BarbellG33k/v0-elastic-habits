# Momentum App Setup Guide

This guide will walk you through setting up the Momentum habit tracking application.

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/momentum-app.git
   cd momentum-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL scripts in the `/scripts` folder in the following order:
     1. `create-habits-tables.sql`
     2. `create-user-roles-table.sql`
     3. `create-avatar-storage.sql`

5. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Setting Up Google Authentication

1. Create a Google OAuth client in the Google Cloud Console
2. Add the following redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)
3. Copy the Client ID and Client Secret
4. In your Supabase dashboard, go to Authentication > Providers > Google
5. Enable Google authentication and paste your Client ID and Client Secret

## Creating an Admin User

1. Sign up for an account in the application
2. Get your user ID from the Supabase dashboard (Authentication > Users)
3. Run the `make-user-admin.sql` script, replacing 'USER_ID' with your actual user ID

## Deployment

1. Create a Vercel account if you don't have one
2. Import your GitHub repository
3. Set the environment variables in the Vercel dashboard
4. Deploy the application
