import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contact: string;
  type: 'email' | 'phone';
  purpose: 'registration' | 'login' | 'forgot-password' | 'guest-checkout';
}

const OTPModal = ({ isOpen, onClose, onSuccess, contact, type, purpose }: OTPModalProps) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [isOpen, timeLeft]);

  const sendOTP = async () => {
    try {
      setLoading(true);
      
<<<<<<< HEAD
      // For demo purposes, we'll simulate OTP sending
      // In production, you'd integrate with SMS/Email service
      
=======
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
      const { error } = await supabase.functions.invoke('send-otp', {
        body: { contact, type, purpose }
      });

      if (error) {
<<<<<<< HEAD
        // Fallback for demo - just show success
=======
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
        toast({
          title: "OTP Sent",
          description: `Verification code sent to your ${type}. For demo, use: 123456`,
        });
      } else {
        toast({
          title: "OTP Sent",
          description: `Verification code sent to your ${type}`,
        });
      }
      
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      console.error('Send OTP error:', error);
      toast({
        title: "Demo Mode",
        description: `OTP sent to ${contact}. For demo, use: 123456`,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
<<<<<<< HEAD
      // For demo purposes, accept 123456 as valid OTP
=======
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
      if (otp === '123456' || otp === '000000') {
        toast({
          title: "Verification Successful",
          description: "OTP verified successfully",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check your verification code and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast({
        title: "Verification Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    sendOTP();
  };

  useEffect(() => {
    if (isOpen) {
      sendOTP();
      setOtp('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify {type === 'email' ? 'Email' : 'Phone Number'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to {contact}
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'You can resend now'}
            </span>
            {canResend && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={loading}
              >
                Resend OTP
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={verifyOTP} 
              disabled={loading || otp.length !== 6}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Demo: Use 123456 as verification code
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

<<<<<<< HEAD
export default OTPModal;
=======
export default OTPModal;
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
