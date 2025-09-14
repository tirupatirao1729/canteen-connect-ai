-- Fix reviews table cache error and ensure proper table creation
-- Drop and recreate the reviews table to fix cache issues

-- First, drop the existing table and all related objects
DROP TABLE IF EXISTS public.reviews CASCADE;

-- Create the reviews table from scratch
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

-- Add foreign key constraint to profiles table
ALTER TABLE public.reviews 
ADD CONSTRAINT fk_reviews_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

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

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample reviews with proper user references
-- Only insert if there are actual users in the profiles table
DO $$
DECLARE
    student_user_id UUID;
    teacher_user_id UUID;
BEGIN
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
END $$;

-- Enable real-time for the reviews table
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
