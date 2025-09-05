import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileEdit from '@/components/ProfileEdit';
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
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  
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

  // Mock order history
  const orderHistory = [
    {
      id: "ORD001",
      date: "2024-01-15",
      items: ["Chicken Biryani", "Masala Chai"],
      total: 135,
      status: "Completed",
      roomNumber: "H-204",
      paymentMethod: "UPI"
    },
    {
      id: "ORD002", 
      date: "2024-01-14",
      items: ["Veg Sandwich", "Cold Coffee"],
      total: 85,
      status: "Completed",
      roomNumber: "H-204",
      paymentMethod: "Cash"
    },
    {
      id: "ORD003",
      date: "2024-01-13",
      items: ["Masala Dosa", "Filter Coffee"],
      total: 65,
      status: "Completed", 
      roomNumber: "H-204",
      paymentMethod: "UPI"
    },
    {
      id: "ORD004",
      date: "2024-01-12",
      items: ["Paneer Butter Masala", "Butter Naan", "Lassi"],
      total: 145,
      status: "Cancelled",
      roomNumber: "H-204",
      paymentMethod: "UPI"
    }
  ];

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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Reorder Favorites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Update Room Number
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Rate Recent Orders
                </Button>
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
                            {order.items.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
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
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {order.status === 'Completed' && (
                            <Button size="sm" className="bg-gradient-primary hover:bg-primary-hover">
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
    </div>
  );
};

export default Profile;