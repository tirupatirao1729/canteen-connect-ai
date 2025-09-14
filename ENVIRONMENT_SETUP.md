# Environment Variables Setup for Vercel Deployment

## Required Environment Variables

To fix the authentication and database issues, you need to set the following environment variables in your Vercel project:

### 1. Supabase Configuration

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
VITE_SUPABASE_URL=https://twwqflvwhauekjvtimho.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3d3FmbHZ3aGF1ZWtqdnRpbWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTQxMzcsImV4cCI6MjA3MjU3MDEzN30.udgL0Y_5pRggBjAu6st8x-xguyACQvcnYTOvcCKLUvQ
```

### 2. Optional: Email Service Configuration

If you want to set up email functionality, you can add:

```
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key
```

Or for Resend:

```
VITE_RESEND_API_KEY=your-resend-api-key
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Make sure to set them for "Production" environment
6. Redeploy your project

## Database Migration

After setting the environment variables, you need to run the database migration to fix the RLS policies:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/20250106000000_fix_profile_creation_rls.sql`

This will fix the Row Level Security policies that are preventing profile creation during registration.




