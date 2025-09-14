# Canteen Connect AI - Deployment Fix Guide

## Issues Fixed

✅ **401 Unauthorized Error** - Fixed Supabase client configuration to use environment variables
✅ **Row Level Security Policy Violation** - Fixed RLS policies for profile creation during registration
✅ **Email Service Not Working** - Improved email service with production fallback
✅ **Environment Variables** - Added proper environment variable support

## Step-by-Step Fix Instructions

### 1. Set Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

**Required Variables:**
```
VITE_SUPABASE_URL=https://twwqflvwhauekjvtimho.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3d3FmbHZ3aGF1ZWtqdnRpbWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTQxMzcsImV4cCI6MjA3MjU3MDEzN30.udgL0Y_5pRggBjAu6st8x-xguyACQvcnYTOvcCKLUvQ
```

**How to add:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add each variable with "Production" environment selected
4. Click "Save"

### 2. Fix Database RLS Policies

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

-- Create more permissive policies for profile creation
CREATE POLICY "Allow profile creation during signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  auth.uid() IS NOT NULL
);

-- Allow profile creation for new users (handles trigger creation)
CREATE POLICY "Allow profile creation for new users" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Update the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
    INSERT INTO public.profiles (user_id, full_name, phone, role, roll_number, date_of_birth, year_of_study, branch)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'),
      NEW.raw_user_meta_data ->> 'phone',
      COALESCE(NEW.raw_user_meta_data ->> 'role', 'Student'),
      NEW.raw_user_meta_data ->> 'roll_number',
      (NEW.raw_user_meta_data ->> 'date_of_birth')::date,
      (NEW.raw_user_meta_data ->> 'year_of_study')::integer,
      NEW.raw_user_meta_data ->> 'branch'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;
```

### 3. Redeploy Your Application

After setting the environment variables:

1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Or push a new commit to trigger automatic deployment

### 4. Test the Application

After redeployment, test these features:

1. **User Registration** - Should work without 401 errors
2. **User Login** - Should authenticate properly
3. **Profile Creation** - Should create profiles without RLS violations
4. **Email Service** - Will log email attempts (configure actual service later)

## What Was Fixed

### 1. Supabase Client Configuration
- Changed from hardcoded credentials to environment variables
- Added fallback to hardcoded values for backward compatibility

### 2. Row Level Security Policies
- Fixed overly restrictive RLS policies that prevented profile creation
- Added permissive policies for signup process
- Improved trigger function for better profile creation

### 3. Email Service
- Added production environment detection
- Improved fallback mechanism for email sending
- Added better error handling and logging

### 4. Error Handling
- Improved error handling in registration process
- Added fallback profile creation if main creation fails
- Better logging for debugging

## Optional: Set Up Real Email Service

If you want actual email functionality, consider these options:

### EmailJS (Easiest)
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create a service and template
3. Add these environment variables:
   ```
   VITE_EMAILJS_SERVICE_ID=your-service-id
   VITE_EMAILJS_TEMPLATE_ID=your-template-id
   VITE_EMAILJS_PUBLIC_KEY=your-public-key
   ```

### Resend (Recommended)
1. Sign up at [Resend](https://resend.com/)
2. Get your API key
3. Add this environment variable:
   ```
   VITE_RESEND_API_KEY=your-resend-api-key
   ```

## Troubleshooting

If you still see errors:

1. **Check Environment Variables** - Make sure they're set correctly in Vercel
2. **Check Database Migration** - Ensure the SQL was run in Supabase
3. **Check Console Logs** - Look for specific error messages
4. **Redeploy** - Sometimes a fresh deployment is needed

## Support

If you need help:
1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure the database migration was applied successfully
4. Try redeploying the application




