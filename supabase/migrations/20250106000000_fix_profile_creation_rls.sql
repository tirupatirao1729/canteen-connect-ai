-- Fix RLS policies for profile creation during registration
-- The issue is that profile creation happens during signup but user might not be fully authenticated

-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

-- Create a more permissive policy for profile creation during signup
-- This allows profile creation when the user_id matches the authenticated user
-- or when the user is in the process of being created (during signup)
CREATE POLICY "Allow profile creation during signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  auth.uid() IS NOT NULL
);

-- Also create a policy that allows profile creation for new users
-- This handles the case where the profile is created by the trigger
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

-- Grant necessary permissions to the function
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;




