-- Create storage bucket for menu photos
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-photos', 'menu-photos', true);

-- Create storage policies for menu photos
CREATE POLICY "Anyone can view menu photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'menu-photos');

CREATE POLICY "Admins can upload menu photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'menu-photos' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'Admin'
  )
);

CREATE POLICY "Admins can update menu photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'menu-photos' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'Admin'
  )
);

CREATE POLICY "Admins can delete menu photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'menu-photos' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'Admin'
  )
);

-- Create menu_items table for storing menu data
CREATE TABLE IF NOT EXISTS public.menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Main Course',
  price DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL DEFAULT 'Veg' CHECK (type IN ('Veg', 'Non-Veg')),
  description TEXT,
  prep_time TEXT DEFAULT '15 min',
  is_special BOOLEAN DEFAULT false,
  image_url TEXT DEFAULT '/placeholder.svg',
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on menu_items table
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_items
CREATE POLICY "Anyone can view menu items" 
ON public.menu_items 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert menu items" 
ON public.menu_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'Admin'
  )
);

CREATE POLICY "Admins can update menu items" 
ON public.menu_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'Admin'
  )
);

CREATE POLICY "Admins can delete menu items" 
ON public.menu_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'Admin'
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
