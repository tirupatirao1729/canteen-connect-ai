import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, User, Mail, Phone, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import OTPModal from './OTPModal';
import { supabase } from '@/integrations/supabase/client';

interface GuestCheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GuestCheckoutForm = ({ isOpen, onClose, onSuccess }: GuestCheckoutFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    roomNumber: '',
    specialInstructions: ''
  });
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [requireOTP, setRequireOTP] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { items, total, clearCart } = useCart();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.contact.trim()) {
      toast({
        title: "Contact Required",
        description: "Please enter your email or phone number",
        variant: "destructive"
      });
      return false;
    }

    if (contactType === 'email' && !formData.contact.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    if (contactType === 'phone' && !/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (requireOTP) {
      setShowOTP(true);
      return;
    }

    await processOrder();
  };

  const processOrder = async () => {
    setLoading(true);

    try {
      // Create order in database
      const orderData = {
        user_id: '00000000-0000-0000-0000-000000000000', // Guest user ID
        items: JSON.parse(JSON.stringify(items)), // Convert to JSON
        total_amount: total,
        room_number: formData.roomNumber || null,
        special_instructions: formData.specialInstructions || null,
        status: 'pending',
        payment_status: paymentMethod === 'cash' ? 'cash_on_delivery' : 'pending',
        payment_method: paymentMethod,
        order_number: `GUEST-${Date.now()}`
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderData);

      if (error) {
        console.error('Order creation error:', error);
        toast({
          title: "Order Failed",
          description: "Failed to place order. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Order for ${formData.name} has been placed. Total: ₹${total}`,
      });

      clearCart();
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        contact: '',
        roomNumber: '',
        specialInstructions: ''
      });
    } catch (error) {
      console.error('Order processing error:', error);
      toast({
        title: "Order Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    processOrder();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Guest Checkout
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Contact Method *</Label>
              <RadioGroup
                value={contactType}
                onValueChange={(value) => setContactType(value as 'email' | 'phone')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">
                {contactType === 'email' ? 'Email Address' : 'Phone Number'} *
              </Label>
              <div className="relative">
                {contactType === 'email' ? (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                ) : (
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                )}
                <Input
                  id="contact"
                  name="contact"
                  type={contactType === 'email' ? 'email' : 'tel'}
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder={contactType === 'email' ? 'Enter your email' : 'Enter your phone number'}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number (Optional)</Label>
              <Input
                id="roomNumber"
                name="roomNumber"
                type="text"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g., H-204, Room 305"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="Any special requests for your order..."
                className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md text-sm resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label>Payment Method *</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'cash' | 'online')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    Cash on Delivery
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Online Payment
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireOTP"
                checked={requireOTP}
                onCheckedChange={(checked) => setRequireOTP(checked === true)}
              />
              <Label htmlFor="requireOTP" className="text-sm">
                Verify my {contactType} with OTP for security
              </Label>
            </div>

            {/* Order Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Order Summary</h4>
              <div className="text-sm space-y-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Payment</span>
                    <span>{paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Processing...' : requireOTP ? 'Verify & Place Order' : 'Place Order'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onSuccess={handleOTPSuccess}
        contact={formData.contact}
        type={contactType}
        purpose="guest-checkout"
      />
    </>
  );
};

export default GuestCheckoutForm;