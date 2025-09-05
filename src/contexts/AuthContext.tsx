import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  isGuest: boolean;
  login: (identifier: string, password: string, adminCode?: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
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
  role: 'Student' | 'Teacher';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'Admin';

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id, full_name, phone, role, roll_number, profile_photo_url, date_of_birth, year_of_study, branch')
            .eq('user_id', session.user.id)
            .maybeSingle();
            
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
          }
        } else {
          setUser(null);
        }
        setIsGuest(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      }
    });

    // Check if user is in guest mode
    const savedGuest = localStorage.getItem('canteen_guest');
    if (savedGuest && !session) {
      setIsGuest(true);
    }

    return () => subscription.unsubscribe();
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

      setIsGuest(false);
      localStorage.removeItem('canteen_guest');
      
      return { success: true };
    } catch (error: any) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
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

      return { success: true };
    } catch (error: any) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.setItem('canteen_guest', 'true');
    localStorage.removeItem('canteen_user');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsGuest(false);
    localStorage.removeItem('canteen_guest');
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
      isGuest,
      login,
      register,
      loginAsGuest,
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