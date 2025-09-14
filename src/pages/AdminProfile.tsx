import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  Settings,
  Save,
  X
} from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
      });
      
      setShowEditDialog(false);
      
      // Refresh the page to update the user context
      window.location.reload();
      
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <Avatar className="w-24 h-24 border-4 border-white/20">
              <AvatarImage src={user.profilePhotoUrl} />
              <AvatarFallback className="text-2xl font-bold bg-white/20 backdrop-blur-sm">
                {user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'A'}
              </AvatarFallback>
            </Avatar>
            
            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-white/90">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  ID: {user.id?.slice(0, 8) || 'N/A'}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {user.phone || 'No phone number'}
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Admin
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="ml-auto">
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Edit Profile
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* User ID (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="userId">User ID</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="userId"
                          value={user.id || ''}
                          disabled
                          className="pl-10 opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">User ID cannot be changed</p>
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={user.email || ''}
                          disabled
                          className="pl-10 opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="pl-10"
                          pattern="[0-9]{10}"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="bg-gradient-primary hover:bg-primary-hover"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-semibold">{user.fullName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-sm">{user.id?.slice(0, 8)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email</span>
                <span className="font-semibold">{user.email}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Phone Number</span>
                <span className="font-semibold">{user.phone || 'Not provided'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="default">Admin</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                As an admin, you have access to:
              </p>
              <ul className="text-sm space-y-2">
                <li>• Manage user accounts and roles</li>
                <li>• Monitor and manage orders in real-time</li>
                <li>• Add and manage menu items</li>
                <li>• View system statistics and analytics</li>
                <li>• Access admin dashboard for full control</li>
              </ul>
              <div className="pt-4">
                <Button 
                  onClick={() => window.location.href = '/admin'}
                  className="w-full bg-gradient-primary hover:bg-primary-hover"
                >
                  Go to Admin Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
