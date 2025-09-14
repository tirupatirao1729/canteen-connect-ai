-- Fix reviews table schema and policies
-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- Create proper policies for reviews
-- Allow anyone to view reviews (public access)
CREATE POLICY "Public read access for reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Allow authenticated users to create reviews
CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Grant necessary permissions to anon and authenticated roles
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT ON public.reviews TO authenticated;
GRANT INSERT ON public.reviews TO authenticated;
GRANT UPDATE ON public.reviews TO authenticated;
GRANT DELETE ON public.reviews TO authenticated;

-- Remove the dummy sample data and create proper sample data
DELETE FROM public.reviews WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Create sample reviews with proper user references (if profiles exist)
-- This will only insert if there are actual users in the profiles table
INSERT INTO public.reviews (user_id, item_name, rating, comment, likes)
SELECT 
  p.user_id,
  'Chicken Biryani',
  5,
  'Absolutely delicious! The biryani was perfectly cooked with tender chicken and aromatic rice. Definitely ordering again!',
  12
FROM public.profiles p 
WHERE p.role = 'Student' 
LIMIT 1;

INSERT INTO public.reviews (user_id, item_name, rating, comment, likes)
SELECT 
  p.user_id,
  'Masala Dosa',
  4,
  'Great taste and quick delivery. The dosa was crispy and the chutneys were fresh. Could use a bit more spice in the potato filling.',
  8
FROM public.profiles p 
WHERE p.role = 'Teacher' 
LIMIT 1;

INSERT INTO public.reviews (user_id, item_name, rating, comment, likes)
SELECT 
  p.user_id,
  'Veg Sandwich',
  5,
  'Perfect for a quick snack between classes. Fresh vegetables and the mint chutney is amazing!',
  15
FROM public.profiles p 
WHERE p.role = 'Student' 
LIMIT 1;

INSERT INTO public.reviews (user_id, item_name, rating, comment, likes)
SELECT 
  p.user_id,
  'Paneer Butter Masala',
  4,
  'Rich and creamy curry. The paneer was soft and well-cooked. Great portion size for the price.',
  6
FROM public.profiles p 
WHERE p.role = 'Teacher' 
LIMIT 1;
