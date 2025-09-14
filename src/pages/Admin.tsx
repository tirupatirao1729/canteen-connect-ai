import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShieldCheck, 
  Package, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  RefreshCw,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { Order, MENU_ITEMS } from '@/data/mockData';
import { MenuItem } from '@/contexts/CartContext';
import { orderService, Order as OrderType } from '@/services/orderService';
import { userService, UserWithAuth } from '@/services/userService';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Real data from database
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [users, setUsers] = useState<UserWithAuth[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    type: 'Veg' as 'Veg' | 'Non-Veg',
    description: '',
    prepTime: '',
    isSpecial: false
  });

  const [menuPhoto, setMenuPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Check admin access and fetch data
  useEffect(() => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Fetch initial data
    fetchOrders();
    fetchUsers();

    // Set up real-time subscription for orders
    const subscription = orderService.subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, isAdmin, navigate, toast]);

  // Fetch orders from database
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await orderService.getAllOrders();
      if (result.success && result.orders) {
        setOrders(result.orders);
      } else {
        console.error('Failed to fetch orders:', result.error);
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please refresh the page.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from database
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const result = await userService.getAllUsers();
      if (result.success && result.users) {
        setUsers(result.users);
      } else {
        console.error('Failed to fetch users:', result.error);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please refresh the page.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const result = await orderService.updateOrderStatus(orderId, newStatus);
      if (result.success) {
    toast({
      title: "Order Updated",
          description: `Order status changed to ${newStatus}`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update order status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const acceptAllPendingOrders = async () => {
    const pendingOrders = orders.filter(order => order.status === 'pending');
    
    try {
      // Update all pending orders
      const updatePromises = pendingOrders.map(order => 
        orderService.updateOrderStatus(order.id, 'accepted')
      );
      
      await Promise.all(updatePromises);
    
    toast({
      title: "Orders Accepted",
        description: `${pendingOrders.length} pending orders have been accepted.`,
      });
    } catch (error) {
      console.error('Error accepting orders:', error);
      toast({
        title: "Update Failed",
        description: "Failed to accept all orders",
        variant: "destructive",
      });
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setMenuPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadMenuPhoto = async (): Promise<string> => {
    if (!menuPhoto) return '/placeholder.svg';
    
    try {
      const fileExt = menuPhoto.name.split('.').pop();
      const fileName = `menu-${Date.now()}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-photos')
        .upload(filePath, menuPhoto);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Menu photo upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload menu photo. Using placeholder image.",
        variant: "destructive",
      });
      return '/placeholder.svg';
    }
  };

  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Upload photo if selected
    const imageUrl = await uploadMenuPhoto();

    const item: MenuItem = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      price: parseFloat(newItem.price),
      type: newItem.type,
      rating: 0,
      prepTime: newItem.prepTime || '15 min',
      description: newItem.description,
      isSpecial: newItem.isSpecial,
      image: imageUrl
    };

    setMenuItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      category: 'Main Course',
      price: '',
      type: 'Veg',
      description: '',
      prepTime: '',
      isSpecial: false
    });
    setMenuPhoto(null);
    setPhotoPreview('');

    toast({
      title: "Item Added",
      description: "New menu item has been added successfully.",
    });
  };

  const removeMenuItem = (itemId: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Menu item has been removed.",
    });
  };

  // User management functions
  const updateUserRole = async (userId: string, newRole: 'Student' | 'Teacher' | 'Admin') => {
    try {
      const result = await userService.updateUserRole(userId, newRole);
      if (result.success) {
        toast({
          title: "Role Updated",
          description: `User role changed to ${newRole}`,
        });
        fetchUsers(); // Refresh users list
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update user role",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await userService.deleteUser(userId);
      if (result.success) {
        toast({
          title: "User Deleted",
          description: "User has been successfully deleted",
        });
        fetchUsers(); // Refresh users list
      } else {
        toast({
          title: "Delete Failed",
          description: result.error || "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Delete Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 mr-3" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-xl text-primary-foreground/90">
            Manage orders, menu items, and system settings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{loading ? '...' : orders.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">
                    {loading ? '...' : orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{usersLoading ? '...' : users.length}</p>
                </div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : `₹${orders
                      .filter(o => o.status === 'completed')
                      .reduce((sum, o) => sum + Number(o.total_amount), 0)
                    }`}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button 
                    onClick={acceptAllPendingOrders}
                    className="bg-gradient-secondary"
                    disabled={!orders.some(o => o.status === 'pending')}
                  >
                    Accept All Pending
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  orders.map((order) => (
                  <div key={order.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                          <h4 className="font-semibold">Order #{order.order_number}</h4>
                        <p className="text-sm text-muted-foreground">
                            {order.user_id === '00000000-0000-0000-0000-000000000000' ? 'Guest Order' : `User ID: ${order.user_id.slice(0, 8)}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {order.room_number || 'N/A'} • {order.payment_method || 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.placed_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                            {order.payment_status || 'pending'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium">Items:</h5>
                        {(order.items as any[]).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total</span>
                          <span>₹{order.total_amount}</span>
                        </div>
                      </div>

                      {order.special_instructions && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <strong>Special Instructions:</strong> {order.special_instructions}
                    </div>
                      )}

                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                          onClick={() => updateOrderStatus(order.id, 'accepted')}
                          disabled={order.status !== 'pending'}
                        className="bg-success hover:bg-success-hover"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          disabled={order.status !== 'accepted'}
                        className="bg-secondary hover:bg-secondary-hover"
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          disabled={order.status === 'completed'}
                      >
                          Cancel
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Add New Menu Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name *</Label>
                    <Input
                      id="itemName"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="Enter item name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemPrice">Price (₹) *</Label>
                    <Input
                      id="itemPrice"
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      placeholder="Enter price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemCategory">Category</Label>
                    <select
                      id="itemCategory"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemType">Type</Label>
                    <select
                      id="itemType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newItem.type}
                      onChange={(e) => setNewItem({...newItem, type: e.target.value as 'Veg' | 'Non-Veg'})}
                    >
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prepTime">Prep Time</Label>
                    <Input
                      id="prepTime"
                      value={newItem.prepTime}
                      onChange={(e) => setNewItem({...newItem, prepTime: e.target.value})}
                      placeholder="e.g., 15 min"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isSpecial"
                      checked={newItem.isSpecial}
                      onChange={(e) => setNewItem({...newItem, isSpecial: e.target.checked})}
                    />
                    <Label htmlFor="isSpecial">Mark as Special</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemDescription">Description *</Label>
                  <Textarea
                    id="itemDescription"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Enter item description"
                    rows={3}
                  />
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-4">
                  <Label>Menu Item Photo</Label>
                  <div className="flex items-center space-x-4">
                    {/* Photo Preview */}
                    <div className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden">
                      {photoPreview ? (
                        <img 
                          src={photoPreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Upload className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="menuPhoto"
                      />
                      <label
                        htmlFor="menuPhoto"
                        className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {menuPhoto ? 'Change Photo' : 'Upload Photo'}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Maximum file size: 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={addMenuItem} className="w-full bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Current Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4">
                      {/* Item Image */}
                      <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => removeMenuItem(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary">₹{item.price}</span>
                        <div className="flex space-x-1">
                          <Badge variant={item.type === 'Veg' ? 'secondary' : 'outline'}>
                            {item.type}
                          </Badge>
                          {item.isSpecial && (
                            <Badge className="bg-warning text-warning-foreground">Special</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </CardTitle>
                  <Button 
                    onClick={fetchUsers} 
                    disabled={usersLoading}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${usersLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.user_id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                              {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{user.full_name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {user.email}
                                </div>
                                {user.phone && (
                                  <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-1" />
                                    {user.phone}
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(user.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline">
                                  {user.roll_number || 'No Roll Number'}
                                </Badge>
                                <Badge variant="secondary">
                                  {user.branch || 'No Branch'}
                                </Badge>
                                <Badge 
                                  variant={user.role === 'Admin' ? 'default' : user.role === 'Teacher' ? 'secondary' : 'outline'}
                                >
                                  {user.role}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user.user_id, e.target.value as 'Student' | 'Teacher' | 'Admin')}
                              className="text-sm border border-border rounded px-2 py-1"
                            >
                              <option value="Student">Student</option>
                              <option value="Teacher">Teacher</option>
                              <option value="Admin">Admin</option>
                            </select>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteUser(user.user_id)}
                              disabled={user.user_id === user?.id} // Don't allow self-deletion
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;