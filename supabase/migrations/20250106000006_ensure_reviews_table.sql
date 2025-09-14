-- Ensure reviews table exists and is properly configured
-- This migration is safe to run multiple times

-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_reviews_user_id' 
        AND table_name = 'reviews'
    ) THEN
        ALTER TABLE public.reviews 
        ADD CONSTRAINT fk_reviews_user_id 
        FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- Create policies
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

-- Grant permissions
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

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable real-time for the table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'reviews'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
    END IF;
END $$;

-- Insert some sample reviews if the table is empty
DO $$
DECLARE
    student_user_id UUID;
    teacher_user_id UUID;
    review_count INTEGER;
BEGIN
    -- Check if there are any reviews
    SELECT COUNT(*) INTO review_count FROM public.reviews;
    
    -- Only insert sample data if table is empty
    IF review_count = 0 THEN
        -- Get a student user ID
        SELECT user_id INTO student_user_id 
        FROM public.profiles 
        WHERE role = 'Student' 
        LIMIT 1;
        
        -- Get a teacher user ID
        SELECT user_id INTO teacher_user_id 
        FROM public.profiles 
        WHERE role = 'Teacher' 
        LIMIT 1;
        
        -- Insert sample reviews if users exist
        IF student_user_id IS NOT NULL THEN
            INSERT INTO public.reviews (user_id, item_name, rating, comment, likes) VALUES
            (student_user_id, 'Chicken Biryani', 5, 'Absolutely delicious! The biryani was perfectly cooked with tender chicken and aromatic rice. Definitely ordering again!', 12),
            (student_user_id, 'Veg Sandwich', 5, 'Perfect for a quick snack between classes. Fresh vegetables and the mint chutney is amazing!', 15);
        END IF;
        
        IF teacher_user_id IS NOT NULL THEN
            INSERT INTO public.reviews (user_id, item_name, rating, comment, likes) VALUES
            (teacher_user_id, 'Masala Dosa', 4, 'Great taste and quick delivery. The dosa was crispy and the chutneys were fresh. Could use a bit more spice in the potato filling.', 8),
            (teacher_user_id, 'Paneer Butter Masala', 4, 'Rich and creamy curry. The paneer was soft and well-cooked. Great portion size for the price.', 6);
        END IF;
    END IF;
END $$;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
