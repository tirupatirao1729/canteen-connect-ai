import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Wallet,
  Smartphone,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, addToCart, updateQuantity, clearCart, getTotalPrice } = useCart();
<<<<<<< HEAD
  const { user, isGuest } = useAuth();
=======
  const { user } = useAuth();
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
  const { toast } = useToast();
  
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment' | 'confirmation'>('cart');
  const [orderDetails, setOrderDetails] = useState({
    roomNumber: '',
    contactNumber: user?.phone || '',
    paymentMethod: 'Cash'
  });

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    updateQuantity(itemId, 0);
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };

  const validateOrderDetails = () => {
    if (!orderDetails.roomNumber.trim()) {
      toast({
        title: "Room Number Required",
        description: "Please enter your room or office number.",
        variant: "destructive",
      });
      return false;
    }

    if (!orderDetails.contactNumber.trim() || !/^\d{10}$/.test(orderDetails.contactNumber)) {
      toast({
        title: "Invalid Contact Number",
        description: "Please enter a valid 10-digit contact number.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    if (validateOrderDetails()) {
      setCheckoutStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
<<<<<<< HEAD
        userId: user?.id || 'guest',
=======
        userId: user?.id,
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          type: item.type
        })),
        totalAmount: getTotalPrice(),
        roomNumber: orderDetails.roomNumber,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        specialInstructions: '',
<<<<<<< HEAD
        isGuestOrder: isGuest
=======
        isGuestOrder: false
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
      };

      const result = await orderService.createOrder(orderData);

      if (result.success) {
        // Clear cart and show confirmation
        clearCart();
        setCheckoutStep('confirmation');
        
        toast({
          title: "Order Placed Successfully!",
          description: `Your order has been placed and is being prepared.`,
        });

        // Auto redirect after 3 seconds
        setTimeout(() => {
          navigate(user ? '/profile' : '/menu');
        }, 3000);
      } else {
        toast({
          title: "Order Failed",
          description: result.error || "Failed to place order. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (checkoutStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been placed successfully. You'll be redirected shortly.
            </p>
            <Button onClick={() => navigate(user ? '/profile' : '/menu')} className="w-full">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {checkoutStep === 'cart' ? 'Your Cart' : 
               checkoutStep === 'details' ? 'Order Details' : 'Payment'}
            </h1>
            <p className="text-xl text-primary-foreground/90">
              {checkoutStep === 'cart' ? 'Review your items before checkout' :
               checkoutStep === 'details' ? 'Enter your delivery information' :
               'Choose your payment method'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 && checkoutStep === 'cart' ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some delicious items from our menu
            </p>
            <Button onClick={() => navigate('/menu')} className="bg-gradient-primary">
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items / Order Details Form */}
            <div className="lg:col-span-2">
              {checkoutStep === 'cart' && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Cart Items ({items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                        <div className="w-16 h-16 bg-gradient-subtle rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={item.type === 'Veg' ? 'secondary' : 'outline'}>
                              {item.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{item.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          
                          <Button
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">₹{item.price * item.quantity}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {checkoutStep === 'details' && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Delivery Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomNumber">Room/Office Number *</Label>
                      <Input
                        id="roomNumber"
                        placeholder="e.g., Room 204, CS Department"
                        value={orderDetails.roomNumber}
                        onChange={(e) => setOrderDetails({
                          ...orderDetails,
                          roomNumber: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number *</Label>
                      <Input
                        id="contactNumber"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={orderDetails.contactNumber}
                        onChange={(e) => setOrderDetails({
                          ...orderDetails,
                          contactNumber: e.target.value
                        })}
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>

<<<<<<< HEAD
                    {isGuest && (
                      <Alert>
                        <AlertDescription>
                          As a guest, your order details will not be saved for future use.
                        </AlertDescription>
                      </Alert>
                    )}
=======
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
                  </CardContent>
                </Card>
              )}

              {checkoutStep === 'payment' && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      {['Cash', 'UPI', 'Card'].map((method) => (
                        <label key={method} className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={orderDetails.paymentMethod === method}
                            onChange={(e) => setOrderDetails({
                              ...orderDetails,
                              paymentMethod: e.target.value
                            })}
                            className="w-4 h-4"
                          />
                          <div className="flex items-center space-x-3">
                            {method === 'Cash' && <Wallet className="w-5 h-5" />}
                            {method === 'UPI' && <Smartphone className="w-5 h-5" />}  
                            {method === 'Card' && <CreditCard className="w-5 h-5" />}
                            <span className="font-medium">{method} Payment</span>
                          </div>
                        </label>
                      ))}
                    </div>

                    <Alert>
                      <AlertDescription>
                        {orderDetails.paymentMethod === 'Cash' && 'Please keep exact change ready for delivery.'}
                        {orderDetails.paymentMethod === 'UPI' && 'UPI payment link will be sent to your mobile number.'}
                        {orderDetails.paymentMethod === 'Card' && 'Card payment will be processed on delivery.'}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="text-success">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                  </div>

                  {checkoutStep === 'details' && (
                    <div className="space-y-2 text-sm">
                      <p><strong>Room:</strong> {orderDetails.roomNumber || 'Not specified'}</p>
                      <p><strong>Contact:</strong> {orderDetails.contactNumber || 'Not specified'}</p>
                    </div>
                  )}

                  {checkoutStep === 'payment' && (
                    <div className="space-y-2 text-sm">
                      <p><strong>Room:</strong> {orderDetails.roomNumber}</p>
                      <p><strong>Contact:</strong> {orderDetails.contactNumber}</p>
                      <p><strong>Payment:</strong> {orderDetails.paymentMethod}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {checkoutStep === 'cart' && (
                      <Button 
                        onClick={() => setCheckoutStep('details')} 
                        className="w-full bg-gradient-primary"
                        disabled={items.length === 0}
                      >
                        Proceed to Checkout
                      </Button>
                    )}
                    
                    {checkoutStep === 'details' && (
                      <>
                        <Button 
                          onClick={handleProceedToPayment}
                          className="w-full bg-gradient-primary"
                        >
                          Continue to Payment
                        </Button>
                        <Button 
                          onClick={() => setCheckoutStep('cart')}
                          variant="outline" 
                          className="w-full"
                        >
                          Back to Cart
                        </Button>
                      </>
                    )}
                    
                    {checkoutStep === 'payment' && (
                      <>
                        <Button 
                          onClick={handlePlaceOrder}
                          className="w-full bg-gradient-primary"
                        >
                          Place Order
                        </Button>
                        <Button 
                          onClick={() => setCheckoutStep('details')}
                          variant="outline" 
                          className="w-full"
                        >
                          Back to Details
                        </Button>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing this order, you agree to our terms and conditions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;