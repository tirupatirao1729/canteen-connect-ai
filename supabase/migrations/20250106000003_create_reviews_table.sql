-- Create reviews table for storing user reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample reviews
INSERT INTO public.reviews (user_id, item_name, rating, comment, likes) VALUES
('00000000-0000-0000-0000-000000000000', 'Chicken Biryani', 5, 'Absolutely delicious! The biryani was perfectly cooked with tender chicken and aromatic rice. Definitely ordering again!', 12),
('00000000-0000-0000-0000-000000000000', 'Masala Dosa', 4, 'Great taste and quick delivery. The dosa was crispy and the chutneys were fresh. Could use a bit more spice in the potato filling.', 8),
('00000000-0000-0000-0000-000000000000', 'Veg Sandwich', 5, 'Perfect for a quick snack between classes. Fresh vegetables and the mint chutney is amazing!', 15),
('00000000-0000-0000-0000-000000000000', 'Paneer Butter Masala', 4, 'Rich and creamy curry. The paneer was soft and well-cooked. Great portion size for the price.', 6);
