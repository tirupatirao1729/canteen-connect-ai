-- Create reviews table - Final version
-- This migration will create the reviews table if it doesn't exist

-- First, check if the table exists and drop it if it does (to ensure clean creation)
DROP TABLE IF EXISTS public.reviews CASCADE;

-- Create the reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint to profiles table (if it exists)
DO $$
BEGIN
    -- Check if profiles table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Add foreign key constraint
        ALTER TABLE public.reviews 
        ADD CONSTRAINT fk_reviews_user_id 
        FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- Create policies for reviews
CREATE POLICY "Public read access for reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT ON public.reviews TO authenticated;
GRANT INSERT ON public.reviews TO authenticated;
GRANT UPDATE ON public.reviews TO authenticated;
GRANT DELETE ON public.reviews TO authenticated;

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamps
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable real-time for the table
DO $$
BEGIN
    -- Check if real-time publication exists
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Add table to real-time publication
        ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
    END IF;
END $$;

-- Insert some sample reviews
INSERT INTO public.reviews (user_id, item_name, rating, comment, likes) VALUES
-- Sample reviews with dummy user IDs (these will work even if profiles table doesn't exist)
('00000000-0000-0000-0000-000000000001', 'Chicken Biryani', 5, 'Absolutely delicious! The biryani was perfectly cooked with tender chicken and aromatic rice. Definitely ordering again!', 12),
('00000000-0000-0000-0000-000000000002', 'Masala Dosa', 4, 'Great taste and quick delivery. The dosa was crispy and the chutneys were fresh. Could use a bit more spice in the potato filling.', 8),
('00000000-0000-0000-0000-000000000003', 'Veg Sandwich', 5, 'Perfect for a quick snack between classes. Fresh vegetables and the mint chutney is amazing!', 15),
('00000000-0000-0000-0000-000000000004', 'Paneer Butter Masala', 4, 'Rich and creamy curry. The paneer was soft and well-cooked. Great portion size for the price.', 6),
('00000000-0000-0000-0000-000000000005', 'Samosa', 5, 'Crispy and flavorful! Perfect as a snack. The potato filling is well-spiced and the chutney is excellent.', 9);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the table was created successfully
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews' AND table_schema = 'public') THEN
        RAISE NOTICE 'Reviews table created successfully!';
    ELSE
        RAISE EXCEPTION 'Failed to create reviews table!';
    END IF;
END $$;
