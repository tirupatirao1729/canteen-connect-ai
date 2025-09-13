import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { emailService } from '@/services/emailService';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  rollNumber?: string;
  role: 'Student' | 'Teacher' | 'Admin';
  profilePhotoUrl?: string;
  dateOfBirth?: string;
  yearOfStudy?: number;
  branch?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  login: (identifier: string, password: string, adminCode?: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

interface RegisterData {
  fullName: string;
  email: string;
  rollNumber: string;
  phone: string;
  dateOfBirth: string;
  yearOfStudy: number;
  branch: string;
  password: string;
  role: 'Student' | 'Teacher' | 'Admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'Admin';

  // Set up auth state listener and check for existing session
  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          try {
            // Get user profile data
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('user_id, full_name, phone, role, roll_number, profile_photo_url, date_of_birth, year_of_study, branch')
              .eq('user_id', session.user.id)
              .maybeSingle();
              
            if (error) {
              console.error('Error fetching profile:', error);
            }
            
            if (profile) {
              setUser({
                id: profile.user_id,
                fullName: profile.full_name || 'User',
                email: session.user.email || '',
                phone: profile.phone || '',
                rollNumber: profile.roll_number || '',
                role: (profile.role as 'Student' | 'Teacher' | 'Admin') || 'Student',
                profilePhotoUrl: profile.profile_photo_url || '',
                dateOfBirth: profile.date_of_birth || '',
                yearOfStudy: profile.year_of_study || 1,
                branch: profile.branch || ''
              });
            } else {
              // Create a basic user profile if none exists
              setUser({
                id: session.user.id,
                fullName: session.user.user_metadata?.full_name || 'User',
                email: session.user.email || '',
                phone: session.user.user_metadata?.phone || '',
                rollNumber: session.user.user_metadata?.roll_number || '',
                role: (session.user.user_metadata?.role as 'Student' | 'Teacher' | 'Admin') || 'Student',
                profilePhotoUrl: session.user.user_metadata?.profile_photo_url || '',
                dateOfBirth: session.user.user_metadata?.date_of_birth || '',
                yearOfStudy: session.user.user_metadata?.year_of_study || 1,
                branch: session.user.user_metadata?.branch || ''
              });
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session) {
        setSession(session);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (identifier: string, password: string, adminCode?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      // Check if identifier is email or roll number
      const isEmail = identifier.includes('@');
      let email = identifier;
      
      if (!isEmail) {
        // For roll number login, we'll use a different approach
        // First try to find if there's a user with this roll number
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('roll_number', identifier.toUpperCase())
          .limit(1);
          
        if (profileError || !profiles || profiles.length === 0) {
          return { success: false, error: "Roll number not found. Please use your email to login or contact admin." };
        }
        
        // For now, we'll ask users to login with email if they use roll number
        return { success: false, error: "Please login using your email address. Roll number login will be available soon." };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Verify admin code if provided
      if (adminCode) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
          
        if (profile?.role !== 'Admin') {
          await supabase.auth.signOut(); // Sign out if not admin
          return { success: false, error: "Invalid admin credentials" };
        }
      }

      localStorage.removeItem('canteen_guest');
      
      return { success: true };
    } catch (error: any) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }> => {
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/login?confirmed=true`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.fullName,
            phone: userData.phone,
            roll_number: userData.rollNumber,
            role: userData.role,
            date_of_birth: userData.dateOfBirth,
            year_of_study: userData.yearOfStudy,
            branch: userData.branch
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required
      const needsEmailConfirmation = data.user && !data.user.email_confirmed_at;

      // If user was created successfully, create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            full_name: userData.fullName,
            phone: userData.phone,
            roll_number: userData.rollNumber,
            role: userData.role,
            date_of_birth: userData.dateOfBirth,
            year_of_study: userData.yearOfStudy,
            branch: userData.branch
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't fail registration if profile creation fails
        }

        // Send welcome email (this will work even if Supabase email is not configured)
        try {
          await emailService.sendWelcomeEmail({
            email: userData.email,
            fullName: userData.fullName,
            role: userData.role,
            rollNumber: userData.rollNumber
          });
        } catch (emailError) {
          console.error('Welcome email failed:', emailError);
          // Don't fail registration if email fails
        }
      }

      return { 
        success: true, 
        needsEmailConfirmation: needsEmailConfirmation || false 
      };
    } catch (error: any) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      login,
      register,
      logout,
      resetPassword,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};