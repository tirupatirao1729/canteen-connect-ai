import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, GraduationCap, BookOpen, Shield, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import OTPModal from '@/components/OTPModal';
import AdminSignup from '@/components/AdminSignup';

const Login = () => {
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
    adminCode: ''
  });
  
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    phone: '',
    dateOfBirth: '',
    yearOfStudy: 1,
    branch: '',
    password: '',
    confirmPassword: '',
    role: 'Student' as 'Student' | 'Teacher'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showAdminSignup, setShowAdminSignup] = useState(false);
  const [otpData, setOtpData] = useState({ contact: '', type: 'email' as 'email' | 'phone', purpose: 'login' as any });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
<<<<<<< HEAD
  const { login, register, resetPassword, loginAsGuest } = useAuth();
=======
  const { login, register, resetPassword } = useAuth();
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(loginData.identifier, loginData.password, loginData.adminCode);
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate('/home');
      } else {
        toast({
          title: "Login Failed", 
          description: result.error || "Please check your credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  const handleForgotPassword = async () => {
    if (!loginData.identifier || !loginData.identifier.includes('@')) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(loginData.identifier);
      if (result.success) {
        setOtpData({ contact: loginData.identifier, type: 'email', purpose: 'forgot-password' });
        setShowOTP(true);
      } else {
        toast({
          title: "Reset Failed",
          description: result.error || "Failed to send reset email",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Reset Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await register(registerData);
      
      if (result.success) {
        if (result.needsEmailConfirmation) {
          toast({
            title: "Registration Successful!",
            description: "Please check your email and click the confirmation link to activate your account. You can also check your spam folder.",
          });
        } else {
          toast({
            title: "Registration Successful!",
            description: "Your account has been created successfully. You can now login.",
          });
        }
        
        // Reset form
        setRegisterData({
          fullName: '',
          email: '',
          rollNumber: '',
          phone: '',
          dateOfBirth: '',
          yearOfStudy: 1,
          branch: '',
          password: '',
          confirmPassword: '',
          role: 'Student'
        });
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Canteen Connect</h1>
          <p className="text-muted-foreground">Welcome to your campus food experience</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Access Your Account</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">Email or Roll Number</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="identifier"
                        placeholder="Enter email or roll number"
                        className="pl-10"
                        value={loginData.identifier}
                        onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Only show admin code field if user enters admin-related credentials */}
                  {(loginData.identifier.toLowerCase().includes('admin') || loginData.adminCode) && (
                    <div className="space-y-2">
                      <Label htmlFor="adminCode">Developer Access Code</Label>
                      <Input
                        id="adminCode"
                        type="password"
                        placeholder="Enter developer access code: codeSTD798143"
                        value={loginData.adminCode}
                        onChange={(e) => setLoginData({...loginData, adminCode: e.target.value})}
                      />
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  <div className="space-y-2 mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full text-xs"
                      onClick={handleForgotPassword}
                      disabled={loading}
                    >
                      Forgot Password?
                    </Button>
<<<<<<< HEAD
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        loginAsGuest();
                        navigate('/home');
                        toast({
                          title: "Guest Access",
                          description: "You're now browsing as a guest. Some features may be limited.",
                        });
                      }}
                      disabled={loading}
                    >
                      Continue as Guest
                    </Button>
=======
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="rollNumber"
                        placeholder="Enter your roll number"
                        className="pl-10"
                        value={registerData.rollNumber}
                        onChange={(e) => setRegisterData({...registerData, rollNumber: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                        required
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
                        className="pl-10"
                        value={registerData.dateOfBirth}
                        onChange={(e) => setRegisterData({...registerData, dateOfBirth: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy">Year of Study</Label>
                      <Select 
                        value={registerData.yearOfStudy.toString()} 
                        onValueChange={(value) => setRegisterData({...registerData, yearOfStudy: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={registerData.role} 
                        onValueChange={(value) => setRegisterData({...registerData, role: value as 'Student' | 'Teacher'})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Teacher">Teacher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch/Department</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="branch"
                        placeholder="e.g., Computer Science"
                        className="pl-10"
                        value={registerData.branch}
                        onChange={(e) => setRegisterData({...registerData, branch: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setShowAdminSignup(true)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register as Admin
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onSuccess={() => {
          setShowOTP(false);
          if (otpData.purpose === 'registration') {
            toast({
              title: "Email Verified",
              description: "You can now login with your credentials",
            });
          } else if (otpData.purpose === 'forgot-password') {
            toast({
              title: "Password Reset",
              description: "Please check your email for reset instructions",
            });
          }
        }}
        contact={otpData.contact}
        type={otpData.type}
        purpose={otpData.purpose}
      />

      <AdminSignup
        isOpen={showAdminSignup}
        onClose={() => setShowAdminSignup(false)}
        onSuccess={() => {
          toast({
            title: "Admin Account Created",
            description: "Please verify your email to complete setup",
          });
        }}
      />
    </div>
  );
};

export default Login;