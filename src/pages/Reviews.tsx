import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  User, 
  MessageSquare, 
  ThumbsUp, 
  Calendar,
  Utensils,
  Plus,
  Send,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Simplified review interface
interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  item_name: string;
  rating: number;
  comment: string;
  likes: number;
  avatar: string;
  created_at: string;
}

// Menu items for review form
const MENU_ITEMS = [
  'Chicken Biryani',
  'Masala Dosa', 
  'Veg Sandwich',
  'Paneer Butter Masala',
  'Samosa',
  'Dal Makhani',
  'Chicken Curry',
  'Veg Biryani'
];

const Reviews = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    itemName: '',
    rating: 0,
    comment: ''
  });

  // Fetch reviews with comprehensive error handling
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting to fetch reviews...');
      
      // First, check if reviews table exists by trying a simple query
      const { data: testData, error: testError } = await supabase
        .from('reviews')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Reviews table test failed:', testError);
        
        // If table doesn't exist, show helpful error message
        if (testError.code === 'PGRST205' || testError.message.includes('Could not find the table')) {
          throw new Error('Reviews table not found. Please run the database migration to create the reviews table.');
        }
        
        throw new Error(`Database error: ${testError.message}`);
      }

      console.log('Reviews table exists, fetching data...');

      // Try to get reviews with user profiles
      const { data: reviewsData, error: reviewsError } = await supabase
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

      if (reviewsError) {
        console.error('Reviews query with profiles failed:', reviewsError);
        
        // Fallback: try without profiles join
        console.log('Trying fallback query without profiles...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          throw new Error(`Failed to load reviews: ${fallbackError.message}`);
        }

        if (fallbackData) {
          console.log('Fallback query successful, transforming data...');
          const fallbackReviews: Review[] = fallbackData.map(review => ({
            id: review.id,
            user_id: review.user_id,
            user_name: 'Anonymous',
            user_role: 'Student',
            item_name: review.item_name,
            rating: review.rating,
            comment: review.comment,
            likes: review.likes || 0,
            avatar: 'A',
            created_at: review.created_at
          }));
          setReviews(fallbackReviews);
          console.log('Reviews loaded successfully via fallback');
          return;
        }
      }

      if (reviewsData) {
        console.log('Primary query successful, transforming data...');
        // Transform the data
        const transformedReviews: Review[] = reviewsData.map(review => ({
          id: review.id,
          user_id: review.user_id,
          user_name: review.profiles?.full_name || 'Anonymous',
          user_role: review.profiles?.role || 'Student',
          item_name: review.item_name,
          rating: review.rating,
          comment: review.comment,
          likes: review.likes || 0,
          avatar: (review.profiles?.full_name || 'Anonymous').split(' ').map(n => n[0]).join('').slice(0, 2),
          created_at: review.created_at
        }));

        setReviews(transformedReviews);
        console.log('Reviews loaded successfully via primary query');
      } else {
        console.log('No reviews data returned');
        setReviews([]);
      }
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews. Please try again.');
      
      // If all else fails, show empty state
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Load reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle review submission with comprehensive error handling
  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to write a review.",
        variant: "destructive",
      });
      return;
    }

    if (!reviewForm.itemName || reviewForm.rating === 0 || !reviewForm.comment.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to submit a review.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting review:', { 
        userId: user.id, 
        itemName: reviewForm.itemName, 
        rating: reviewForm.rating 
      });

      // First, check if user has a profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile check failed:', profileError);
        // Continue anyway, we'll use fallback data
      }

      // Insert the review
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          item_name: reviewForm.itemName,
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Review insertion failed:', error);
        throw new Error(`Failed to submit review: ${error.message}`);
      }

      console.log('Review submitted successfully:', data);

      // Add the new review to the list
      const newReview: Review = {
        id: data.id,
        user_id: data.user_id,
        user_name: user.fullName || 'Anonymous',
        user_role: user.role || 'Student',
        item_name: data.item_name,
        rating: data.rating,
        comment: data.comment,
        likes: data.likes || 0,
        avatar: (user.fullName || 'Anonymous').split(' ').map(n => n[0]).join('').slice(0, 2),
        created_at: data.created_at
      };

    setReviews(prev => [newReview, ...prev]);
      setReviewForm({ itemName: '', rating: 0, comment: '' });
    setShowReviewForm(false);
    
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle like review with error handling
  const handleLikeReview = async (reviewId: string) => {
    try {
      console.log('Liking review:', reviewId);
      
      const { error } = await supabase
        .from('reviews')
        .update({ likes: supabase.raw('likes + 1') })
        .eq('id', reviewId);

      if (error) {
        console.error('Like update failed:', error);
        throw new Error(`Failed to like review: ${error.message}`);
      }

      // Update the review in the list
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, likes: review.likes + 1 }
        : review
    ));

      toast({
        title: "Review Liked",
        description: "Thank you for your feedback!",
      });
    } catch (error: any) {
      console.error('Error liking review:', error);
      toast({
        title: "Failed to Like Review",
        description: error.message || "Unable to like review. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  // Render stars
  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={interactive ? () => onRatingChange?.(index + 1) : undefined}
        className={interactive ? "focus:outline-none hover:scale-110 transition-transform" : "cursor-default"}
        disabled={!interactive}
      >
        <Star
        className={`w-5 h-5 ${
          index < rating 
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  // Calculate average rating
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Read what our community says about our delicious meals and service quality
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Average Rating Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {getAverageRating().toFixed(1)}
                </div>
                <div className="flex justify-center space-x-1 mb-2">
                  {renderStars(Math.round(getAverageRating()))}
                </div>
                <p className="text-muted-foreground">Based on {reviews.length} reviews</p>
              </CardContent>
            </Card>

            {/* Reviews Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  About Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Read what our community says about our delicious meals and service quality.
                </p>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Reviews help you make informed choices</p>
                  <p>• Share your dining experience</p>
                  <p>• Help others discover great meals</p>
                  <p>• Build our community together</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">Recent Reviews</h2>
                <Badge variant="outline">
                  {reviews.length} reviews
                </Badge>
              </div>
              
              {/* Add Review Button */}
              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:bg-primary-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Write a Review
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Menu Item Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Menu Item</Label>
                      <select
                        id="itemName"
                        value={reviewForm.itemName}
                        onChange={(e) => setReviewForm({...reviewForm, itemName: e.target.value})}
                        className="w-full p-2 border border-input rounded-md bg-background"
                        required
                      >
                        <option value="">Select a menu item</option>
                        {MENU_ITEMS.map(item => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                      <Label>Rating *</Label>
                      <div className="flex space-x-1">
                        {renderStars(reviewForm.rating, true, handleRatingChange)}
                      </div>
                      {reviewForm.rating > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {reviewForm.rating} out of 5 stars
                        </p>
                      )}
                      {reviewForm.rating === 0 && (
                        <p className="text-sm text-destructive">
                          Please select a rating
                        </p>
                      )}
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                      <Label htmlFor="comment">Your Review *</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your experience with this dish..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        className="min-h-[100px]"
                        required
                      />
                      {reviewForm.comment.length === 0 && (
                        <p className="text-sm text-destructive">
                          Please write a review
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowReviewForm(false)}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmitReview}
                        disabled={submitting || !reviewForm.itemName || reviewForm.rating === 0 || !reviewForm.comment.trim()}
                        className="bg-gradient-primary hover:bg-primary-hover"
                      >
                        {submitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Send className="w-4 h-4 mr-2" />
                            Submit Review
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Error State */}
            {error && (
              <Card className="border-destructive">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <div className="flex-1">
                      <h3 className="font-semibold">Error Loading Reviews</h3>
                      <p className="text-sm mt-1">{error}</p>
                      
                      {/* Show specific help for table not found error */}
                      {error.includes('Reviews table not found') && (
                        <div className="mt-3 p-3 bg-destructive/10 rounded-md">
                          <p className="text-sm font-medium mb-2">To fix this issue:</p>
                          <ol className="text-sm list-decimal list-inside space-y-1">
                            <li>Go to your Supabase dashboard</li>
                            <li>Navigate to the SQL Editor</li>
                            <li>Run the migration: <code className="bg-background px-1 rounded">supabase/migrations/20250106000007_create_reviews_table_final.sql</code></li>
                            <li>Refresh this page</li>
                          </ol>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={fetchReviews}
                          className="flex items-center"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setError(null)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your experience!
                  </p>
                  <Button 
                    onClick={() => setShowReviewForm(true)}
                    className="bg-gradient-primary hover:bg-primary-hover"
                  >
                    Write the First Review
                  </Button>
                </div>
              ) : (
                reviews.map((review) => (
                <Card key={review.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                        {review.avatar}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                              <h3 className="font-semibold">{review.user_name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">
                                  {review.user_role}
                              </Badge>
                              <span>•</span>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              {renderStars(review.rating)}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              <Utensils className="w-3 h-3 mr-1" />
                                {review.item_name}
                            </Badge>
                          </div>
                        </div>

                        {/* Comment */}
                        <p className="text-foreground leading-relaxed">
                          {review.comment}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center space-x-4 pt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => handleLikeReview(review.id)}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Helpful ({review.likes})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;