import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Star, 
  User, 
  MessageSquare, 
  ThumbsUp, 
  Calendar,
  Utensils,
  Plus
} from 'lucide-react';

const Reviews = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Mock data
  const menuItems = [
    'Masala Dosa', 'Chicken Biryani', 'Veg Sandwich', 'Paneer Butter Masala', 'Samosa'
  ];

  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: "Arjun Kumar",
      userRole: "Student",
      itemName: "Chicken Biryani",
      rating: 5,
      comment: "Absolutely delicious! The biryani was perfectly cooked with tender chicken and aromatic rice. Definitely ordering again!",
      date: "2024-01-15",
      likes: 12,
      avatar: "AK"
    },
    {
      id: 2,
      userName: "Priya Sharma",
      userRole: "Teacher",
      itemName: "Masala Dosa",
      rating: 4,
      comment: "Great taste and quick delivery. The dosa was crispy and the chutneys were fresh. Could use a bit more spice in the potato filling.",
      date: "2024-01-14",
      likes: 8,
      avatar: "PS"
    },
    {
      id: 3,
      userName: "Rahul Singh",
      userRole: "Student",
      itemName: "Veg Sandwich",
      rating: 5,
      comment: "Perfect for a quick snack between classes. Fresh vegetables and the mint chutney is amazing!",
      date: "2024-01-13",
      likes: 15,
      avatar: "RS"
    },
    {
      id: 4,
      userName: "Dr. Meera Patel",
      userRole: "Teacher",
      itemName: "Paneer Butter Masala",
      rating: 4,
      comment: "Rich and creamy curry. The paneer was soft and well-cooked. Great portion size for the price.",
      date: "2024-01-12",
      likes: 6,
      avatar: "MP"
    }
  ]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new review object
    const newReview = {
      id: reviews.length + 1,
      userName: "You", // In a real app, this would come from auth context
      userRole: "Student",
      itemName: selectedItem,
      rating: rating,
      comment: comment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      avatar: "Y"
    };
    
    // Add to reviews array (in real app, this would be saved to database)
    setReviews(prev => [newReview, ...prev]);
    
    // Reset form
    setSelectedItem('');
    setRating(0);
    setComment('');
    setShowReviewForm(false);
    
    // Show success message
    alert('Review submitted successfully! Thank you for your feedback.');
  };

  const handleLikeReview = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating 
            ? 'text-warning fill-current' 
            : 'text-muted-foreground'
        } ${interactive ? 'cursor-pointer hover:text-warning transition-colors' : ''}`}
        onClick={interactive && onStarClick ? () => onStarClick(index + 1) : undefined}
      />
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getAverageRatingString = () => {
    return getAverageRating().toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-xl text-secondary-foreground/90 max-w-2xl mx-auto">
            See what our community says about our delicious meals and share your own experience
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats and Add Review */}
          <div className="space-y-6">
            {/* Overall Rating */}
            <Card className="p-6 text-center">
              <CardHeader className="pb-4">
                <CardTitle>Overall Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-primary">{getAverageRatingString()}</div>
                <div className="flex justify-center space-x-1">
                  {renderStars(Math.round(getAverageRating()))}
                </div>
                <p className="text-muted-foreground">Based on {reviews.length} reviews</p>
                
                {/* Rating Distribution */}
                <div className="space-y-2 mt-6">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center space-x-2 text-sm">
                      <span className="w-4">{star}</span>
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-warning h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${reviews.length > 0 ? (ratingDistribution[star as 1 | 2 | 3 | 4 | 5] / reviews.length) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="w-8 text-right">{ratingDistribution[star as 1 | 2 | 3 | 4 | 5]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add Review Button */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Share Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Help other students and teachers by sharing your experience with our food.
                </p>
                <Button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="w-full bg-gradient-primary hover:bg-primary-hover"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write a Review
                </Button>
              </CardContent>
            </Card>

            {/* Review Form */}
            {showReviewForm && (
              <Card className="p-6 animate-slide-up">
                <CardHeader className="pb-4">
                  <CardTitle>Write Your Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="item">Menu Item</Label>
                      <select
                        id="item"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        required
                      >
                        <option value="">Select an item</option>
                        {menuItems.map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <div className="flex space-x-1">
                        {renderStars(rating, true, setRating)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comment">Comment</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your thoughts about the food, service, or overall experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-primary hover:bg-primary-hover"
                        disabled={!selectedItem || rating === 0 || !comment.trim()}
                      >
                        Submit Review
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Reviews</h2>
              <Badge variant="outline">
                {reviews.length} reviews
              </Badge>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {reviews.map((review) => (
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
                            <h3 className="font-semibold">{review.userName}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">
                                {review.userRole}
                              </Badge>
                              <span>•</span>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(review.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              {renderStars(review.rating)}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              <Utensils className="w-3 h-3 mr-1" />
                              {review.itemName}
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
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-6">
              <Button variant="outline" className="hover:bg-accent">
                Load More Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;