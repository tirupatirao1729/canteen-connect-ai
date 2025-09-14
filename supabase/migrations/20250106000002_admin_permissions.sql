-- Grant admin permissions for user management
-- This migration ensures admins can manage users and view all data

-- Grant necessary permissions to authenticated users for admin functions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.menu_items TO authenticated;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'Admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to use the admin function
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (public.is_admin());

-- Add admin policies for profiles management
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin());

-- Add admin policies for menu items
CREATE POLICY "Admins can view all menu items" 
ON public.menu_items 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert menu items" 
ON public.menu_items 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update menu items" 
ON public.menu_items 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete menu items" 
ON public.menu_items 
FOR DELETE 
USING (public.is_admin());

-- Grant permissions for storage operations
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
