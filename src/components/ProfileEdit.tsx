import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Upload,
  Save,
  X
} from 'lucide-react';

interface ProfileEditProps {
  onClose: () => void;
}

const ProfileEdit = ({ onClose }: ProfileEditProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    yearOfStudy: user?.yearOfStudy?.toString() || '1',
    branch: user?.branch || '',
    rollNumber: user?.rollNumber || ''
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhotoUrl || '');

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
      
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!profilePhoto || !user) return null;
    
    setUploading(true);
    
    try {
      const fileExt = profilePhoto.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, profilePhoto);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      let profilePhotoUrl = user.profilePhotoUrl;
      
      // Upload new photo if selected
      if (profilePhoto) {
        const newPhotoUrl = await uploadPhoto();
        if (newPhotoUrl) {
          profilePhotoUrl = newPhotoUrl;
        } else {
          setLoading(false);
          return; // Upload failed, don't continue
        }
      }

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          year_of_study: parseInt(formData.yearOfStudy),
          branch: formData.branch,
          roll_number: formData.rollNumber.toUpperCase(),
          profile_photo_url: profilePhotoUrl
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
      });
      
      onClose();
      
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Edit Profile
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Profile Photo Section */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24">
                <AvatarImage src={photoPreview} />
                <AvatarFallback className="text-xl">
                  {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary-hover transition-colors">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Click the upload icon to change your profile photo
              <br />
              Maximum file size: 5MB
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                value={formData.rollNumber}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value.toUpperCase()})}
                placeholder="Enter roll number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="pl-10 opacity-50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearOfStudy">Year of Study</Label>
              <select
                id="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={(e) => setFormData({...formData, yearOfStudy: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch/Department</Label>
            <Input
              id="branch"
              value={formData.branch}
              onChange={(e) => setFormData({...formData, branch: e.target.value})}
              placeholder="e.g., Computer Science, Electrical Engineering"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading || uploading}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEdit;