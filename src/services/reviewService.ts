import { supabase } from '@/integrations/supabase/client';

export interface Review {
<<<<<<< HEAD
  id: string;
  user_id: string;
=======
  id: number;
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
  user_name: string;
  user_role: string;
  item_name: string;
  rating: number;
  comment: string;
<<<<<<< HEAD
  likes: number;
  avatar: string;
  created_at: string;
=======
  date: string;
  likes: number;
  avatar: string;
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
}

export interface CreateReviewData {
  userId: string;
  userName: string;
  userRole: string;
  itemName: string;
  rating: number;
  comment: string;
}

export const reviewService = {
<<<<<<< HEAD
  // Get all reviews with user information
  async getReviews(): Promise<{ success: boolean; reviews?: Review[]; error?: string }> {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          item_name,
          rating,
          comment,
          likes,
          created_at,
          profiles!left(
            full_name,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return { success: false, error: error.message };
      }

      // Handle case where no reviews exist
      if (!reviews || reviews.length === 0) {
        return { success: true, reviews: [] };
      }

      // Transform the data to match our interface
      const transformedReviews: Review[] = reviews.map(review => ({
        id: review.id,
        user_id: review.user_id,
        user_name: review.profiles?.full_name || 'Anonymous',
        user_role: review.profiles?.role || 'Student',
        item_name: review.item_name,
        rating: review.rating,
        comment: review.comment,
        likes: review.likes,
        avatar: review.profiles?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'A',
        created_at: review.created_at
      }));

      return { success: true, reviews: transformedReviews };
=======
  // Get all reviews
  async getReviews(): Promise<{ success: boolean; reviews?: Review[]; error?: string }> {
    try {
      // For now, return mock data since we don't have a reviews table
      // In a real app, you would query the reviews table here
      const mockReviews: Review[] = [
        {
          id: 1,
          user_name: "Arjun Kumar",
          user_role: "Student",
          item_name: "Chicken Biryani",
          rating: 5,
          comment: "Absolutely delicious! The biryani was perfectly cooked with tender chicken and aromatic rice. Definitely ordering again!",
          date: "2024-01-15",
          likes: 12,
          avatar: "AK"
        },
        {
          id: 2,
          user_name: "Priya Sharma",
          user_role: "Teacher",
          item_name: "Masala Dosa",
          rating: 4,
          comment: "Great taste and quick delivery. The dosa was crispy and the chutneys were fresh. Could use a bit more spice in the potato filling.",
          date: "2024-01-14",
          likes: 8,
          avatar: "PS"
        },
        {
          id: 3,
          user_name: "Rahul Singh",
          user_role: "Student",
          item_name: "Veg Sandwich",
          rating: 5,
          comment: "Perfect for a quick snack between classes. Fresh vegetables and the mint chutney is amazing!",
          date: "2024-01-13",
          likes: 15,
          avatar: "RS"
        },
        {
          id: 4,
          user_name: "Dr. Meera Patel",
          user_role: "Teacher",
          item_name: "Paneer Butter Masala",
          rating: 4,
          comment: "Rich and creamy curry. The paneer was soft and well-cooked. Great portion size for the price.",
          date: "2024-01-12",
          likes: 6,
          avatar: "MP"
        }
      ];

      return { success: true, reviews: mockReviews };
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a new review
<<<<<<< HEAD
  async createReview(reviewData: CreateReviewData): Promise<{ success: boolean; review?: Review; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: reviewData.userId,
          item_name: reviewData.itemName,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
        .select(`
          id,
          user_id,
          item_name,
          rating,
          comment,
          likes,
          created_at,
          profiles!left(
            full_name,
            role
          )
        `)
        .single();

      if (error) {
        console.error('Error creating review:', error);
        return { success: false, error: error.message };
      }

      const transformedReview: Review = {
        id: data.id,
        user_id: data.user_id,
        user_name: data.profiles?.full_name || reviewData.userName || 'Anonymous',
        user_role: data.profiles?.role || reviewData.userRole || 'Student',
        item_name: data.item_name,
        rating: data.rating,
        comment: data.comment,
        likes: data.likes,
        avatar: (data.profiles?.full_name || reviewData.userName)?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'A',
        created_at: data.created_at
      };

      return { success: true, review: transformedReview };
=======
  async createReview(reviewData: CreateReviewData): Promise<{ success: boolean; reviewId?: number; error?: string }> {
    try {
      // For now, return mock success since we don't have a reviews table
      // In a real app, you would insert into the reviews table here
      const reviewId = Date.now();
      
      return { success: true, reviewId };
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
    } catch (error: any) {
      console.error('Error creating review:', error);
      return { success: false, error: error.message };
    }
  },

  // Like a review
<<<<<<< HEAD
  async likeReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ likes: supabase.raw('likes + 1') })
        .eq('id', reviewId);

      if (error) {
        console.error('Error liking review:', error);
        return { success: false, error: error.message };
      }

=======
  async likeReview(reviewId: number): Promise<{ success: boolean; error?: string }> {
    try {
      // For now, return mock success since we don't have a reviews table
      // In a real app, you would update the likes count in the reviews table
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
      return { success: true };
    } catch (error: any) {
      console.error('Error liking review:', error);
      return { success: false, error: error.message };
    }
<<<<<<< HEAD
  },

  // Subscribe to real-time review updates
  subscribeToReviews(callback: (reviews: Review[]) => void) {
    const subscription = supabase
      .channel('reviews_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        async (payload) => {
          console.log('Real-time review update:', payload);
          // Fetch updated reviews when changes occur
          const result = await reviewService.getReviews();
          if (result.success && result.reviews) {
            callback(result.reviews);
          }
        }
      )
      .subscribe((status) => {
        console.log('Reviews subscription status:', status);
      });

    return subscription;
  },

  // Subscribe to real-time like updates
  subscribeToLikes(callback: (reviewId: string, newLikes: number) => void) {
    const subscription = supabase
      .channel('review_likes_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reviews',
          filter: 'likes=neq.0'
        },
        (payload) => {
          console.log('Real-time like update:', payload);
          if (payload.new && payload.new.id) {
            callback(payload.new.id, payload.new.likes || 0);
          }
        }
      )
      .subscribe((status) => {
        console.log('Likes subscription status:', status);
      });

    return subscription;
  },

  // Get reviews with retry mechanism for cache issues
  async getReviewsWithRetry(maxRetries: number = 3): Promise<{ success: boolean; reviews?: Review[]; error?: string }> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.getReviews();
        if (result.success) {
          return result;
        }
        
        if (attempt < maxRetries) {
          console.log(`Attempt ${attempt} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } catch (error: any) {
        console.error(`Attempt ${attempt} error:`, error);
        if (attempt === maxRetries) {
          return { success: false, error: error.message };
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    return { success: false, error: 'Max retries exceeded' };
  }
};
=======
  }
};



>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
