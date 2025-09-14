// Email testing component for debugging email issues
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/services/emailService';

interface EmailTestProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailTest: React.FC<EmailTestProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testWelcomeEmail = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await emailService.sendWelcomeEmail({
        email: email,
        fullName: 'Test User',
        role: 'Student',
        rollNumber: 'TEST123'
      });

      if (result.success) {
        toast({
          title: "Test Email Sent",
          description: `Welcome email sent to ${email}. Check your inbox and spam folder.`,
        });
      } else {
        toast({
          title: "Email Failed",
          description: result.error || "Failed to send email",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      toast({
        title: "Email Test Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testConfirmationEmail = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await emailService.sendEmailConfirmation({
        email: email,
        fullName: 'Test User',
        confirmationUrl: `${window.location.origin}/login?confirmed=true&token=test123`
      });

      if (result.success) {
        toast({
          title: "Test Email Sent",
          description: `Confirmation email sent to ${email}. Check your inbox and spam folder.`,
        });
      } else {
        toast({
          title: "Email Failed",
          description: result.error || "Failed to send email",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      toast({
        title: "Email Test Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Testing</CardTitle>
          <CardDescription>
            Test email functionality to debug registration issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Test Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={testWelcomeEmail} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Test Welcome Email'}
            </Button>
            
            <Button 
              onClick={testConfirmationEmail} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Sending...' : 'Test Confirmation Email'}
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Note:</strong> This will test the email service configuration.</p>
            <p>Check your email inbox and spam folder for the test emails.</p>
          </div>

          <Button onClick={onClose} variant="secondary" className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTest;
