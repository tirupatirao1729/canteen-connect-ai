import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProfileEdit from '@/components/ProfileEdit';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { orderService, Order } from '@/services/orderService';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  Clock, 
  Star,
  MapPin,
  CreditCard,
  Settings,
  GraduationCap,
  BookOpen,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user: authUser } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!authUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const result = await orderService.getUserOrders(authUser.id);
        if (result.success && result.orders) {
          setOrders(result.orders);
        } else {
          console.error('Failed to fetch orders:', result.error);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authUser?.id]);
  
  const user = {
    name: authUser?.fullName || "User",
    email: authUser?.email || "—",
    phone: authUser?.phone || "—",
    rollNumber: authUser?.rollNumber || "—",
    role: authUser?.role || "Student",
    dateOfBirth: authUser?.dateOfBirth || "—",
    yearOfStudy: authUser?.yearOfStudy || "—",
    branch: authUser?.branch || "—",
    joinDate: new Date().toISOString(),
    avatar: authUser?.fullName
      ? authUser.fullName.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()
      : "U",
    profilePhotoUrl: authUser?.profilePhotoUrl
  };

  // Transform orders for display
  const orderHistory = orders.map(order => ({
    id: order.order_number,
    date: order.placed_at.split('T')[0],
    items: (order.items as any[]).map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    total: order.total_amount,
    status: order.status,
    roomNumber: order.room_number || 'N/A',
    paymentMethod: order.payment_method || 'N/A',
    orderTime: new Date(order.placed_at).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    deliveryTime: order.estimated_delivery_time ? 
      new Date(order.estimated_delivery_time).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) : null
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Pending':
        return 'status-pending';
      case 'Cancelled':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const getTotalSpent = () => {
    return orderHistory
      .filter(order => order.status === 'Completed')
      .reduce((sum, order) => sum + order.total, 0);
  };

  const getCompletedOrders = () => {
    return orderHistory.filter(order => order.status === 'Completed').length;
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleReorder = (order: any) => {
    // Add all items from the order to cart
    order.items.forEach((item: any) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          id: Math.random(), // Generate temporary ID
          name: item.name,
          price: item.price,
          category: 'Main Course', // Default category
          type: 'Veg' as 'Veg' | 'Non-Veg',
          rating: 4.5,
          prepTime: '15 min',
          description: `Reordered from ${order.id}`,
          isSpecial: false,
          image: '/placeholder.svg'
        });
      }
    });

    toast({
      title: "Items Added to Cart",
      description: `All items from order ${order.id} have been added to your cart.`,
    });

    // Navigate to cart
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-warm text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <Avatar className="w-24 h-24 border-4 border-white/20">
              <AvatarImage src={user.profilePhotoUrl} />
              <AvatarFallback className="text-2xl font-bold bg-white/20 backdrop-blur-sm">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            
            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-white/90">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  ID: {authUser?.id?.slice(0, 8) || 'N/A'}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {user.phone}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {user.rollNumber}
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {user.role}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="ml-auto">
              <Button 
                variant="secondary" 
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                onClick={() => setShowEditProfile(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Account Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Member Since</span>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Roll Number</span>
                  <div className="flex items-center font-semibold text-primary">
                    <User className="w-4 h-4 mr-2" />
                    {user.rollNumber}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Year of Study</span>
                  <div className="flex items-center font-semibold text-secondary">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {user.yearOfStudy !== "—" ? `${user.yearOfStudy}${user.yearOfStudy === "1" ? "st" : user.yearOfStudy === "2" ? "nd" : user.yearOfStudy === "3" ? "rd" : "th"} Year` : "—"}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Branch</span>
                  <div className="flex items-center font-semibold text-accent-foreground">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {user.branch}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Orders</span>
                  <div className="flex items-center font-semibold text-primary">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {orderHistory.length}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed Orders</span>
                  <div className="flex items-center font-semibold text-success">
                    <Star className="w-4 h-4 mr-2" />
                    {getCompletedOrders()}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Spent</span>
                  <div className="flex items-center font-semibold text-primary">
                    <CreditCard className="w-4 h-4 mr-2" />
                    ₹{getTotalSpent()}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Order History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order History</h2>
              <Badge variant="outline">
                {orderHistory.length} orders
              </Badge>
            </div>

            {/* Orders */}
            <div className="space-y-4">
              {orderHistory.map((order) => (
                <Card key={order.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      {/* Order Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {order.roomNumber}
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-1" />
                            {order.paymentMethod}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium">Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item: any, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Order Total & Actions */}
                      <div className="text-right space-y-3">
                        <div className="text-2xl font-bold text-primary">
                          ₹{order.total}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {order.status === 'Completed' && (
                            <Button 
                              size="sm" 
                              className="bg-gradient-primary hover:bg-primary-hover"
                              onClick={() => handleReorder(order)}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reorder
                            </Button>
                          )}
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
                Load More Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Edit Modal */}
      {showEditProfile && (
        <ProfileEdit onClose={() => setShowEditProfile(false)} />
      )}

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Order Details - {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Time</p>
                  <p className="font-medium">{selectedOrder.orderTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room Number</p>
                  <p className="font-medium">{selectedOrder.roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                {selectedOrder.deliveryTime && (
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Time</p>
                    <p className="font-medium">{selectedOrder.deliveryTime}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.price}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            Total: ₹{item.price * item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{selectedOrder.total}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                  Close
                </Button>
                {selectedOrder.status === 'Completed' && (
                  <Button 
                    className="bg-gradient-primary hover:bg-primary-hover"
                    onClick={() => {
                      handleReorder(selectedOrder);
                      setShowOrderDetails(false);
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reorder Items
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;