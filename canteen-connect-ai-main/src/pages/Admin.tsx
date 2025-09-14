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
  Eye
} from 'lucide-react';
import { Order, MENU_ITEMS } from '@/data/mockData';
import { MenuItem } from '@/contexts/CartContext';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Mock data for testing
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      userId: '1',
      items: [
        { id: 1, name: 'Masala Dosa', price: 45, quantity: 2 },
        { id: 4, name: 'Masala Chai', price: 15, quantity: 1 }
      ],
      status: 'Pending',
      totalAmount: 105,
      roomNumber: 'Room 204',
      contactNumber: '9876543210',
      paymentMethod: 'UPI',
      createdAt: new Date(),
      isGuestOrder: false
    },
    {
      id: 'ORD002',
      items: [
        { id: 2, name: 'Chicken Biryani', price: 120, quantity: 1 }
      ],
      status: 'Accepted',
      totalAmount: 120,
      roomNumber: 'Faculty Room 101',
      contactNumber: '9876543211',
      paymentMethod: 'Cash',
      createdAt: new Date(),
      isGuestOrder: true
    }
  ]);

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

  // Check admin access
  useEffect(() => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, isAdmin, navigate, toast]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const acceptAllPendingOrders = () => {
    const pendingCount = orders.filter(order => order.status === 'Pending').length;
    
    setOrders(prev => prev.map(order => 
      order.status === 'Pending' ? { ...order, status: 'Accepted' } : order
    ));
    
    toast({
      title: "Orders Accepted",
      description: `${pendingCount} pending orders have been accepted.`,
    });
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price || !newItem.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

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
      image: '/placeholder.svg'
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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Accepted': return <CheckCircle className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Accepted': return 'status-accepted';
      case 'Completed': return 'status-completed';
      case 'Rejected': return 'status-rejected';
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
                  <p className="text-2xl font-bold">{orders.length}</p>
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
                    {orders.filter(o => o.status === 'Pending').length}
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
                  <p className="text-sm text-muted-foreground">Menu Items</p>
                  <p className="text-2xl font-bold">{menuItems.length}</p>
                </div>
                <Package className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">₹{orders.reduce((sum, o) => sum + o.totalAmount, 0)}</p>
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
                    disabled={!orders.some(o => o.status === 'Pending')}
                  >
                    Accept All Pending
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">Order #{order.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.isGuestOrder ? 'Guest Order' : `User ID: ${order.userId}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.roomNumber} • {order.contactNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium">Items:</h5>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total</span>
                        <span>₹{order.totalAmount}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Accepted')}
                        disabled={order.status !== 'Pending'}
                        className="bg-success hover:bg-success-hover"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                        disabled={order.status !== 'Accepted'}
                        className="bg-secondary hover:bg-secondary-hover"
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateOrderStatus(order.id, 'Rejected')}
                        disabled={order.status === 'Completed'}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
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
                      
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      
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
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    User management features will be available once connected to Supabase.
                    This will include user registration approval, role management, and account settings.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;