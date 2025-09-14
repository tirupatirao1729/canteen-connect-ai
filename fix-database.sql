-- Run this SQL in your Supabase SQL Editor to fix the RLS policies
-- This fixes the "new row violates row-level security policy" error

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

-- Update the trigger function to handle profile creation better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if it doesn't already exist
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




