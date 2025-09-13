import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: number;
  user_name: string;
  user_role: string;
  item_name: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  avatar: string;
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
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a new review
  async createReview(reviewData: CreateReviewData): Promise<{ success: boolean; reviewId?: number; error?: string }> {
    try {
      // For now, return mock success since we don't have a reviews table
      // In a real app, you would insert into the reviews table here
      const reviewId = Date.now();
      
      return { success: true, reviewId };
    } catch (error: any) {
      console.error('Error creating review:', error);
      return { success: false, error: error.message };
    }
  },

  // Like a review
  async likeReview(reviewId: number): Promise<{ success: boolean; error?: string }> {
    try {
      // For now, return mock success since we don't have a reviews table
      // In a real app, you would update the likes count in the reviews table
      return { success: true };
    } catch (error: any) {
      console.error('Error liking review:', error);
      return { success: false, error: error.message };
    }
  }
};



