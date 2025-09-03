import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'Student' | 'Teacher' | 'Admin';
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isGuest: boolean;
  login: (email: string, password: string, adminCode?: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'Student' | 'Teacher';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for testing
const MOCK_USERS: User[] = [
  {
    id: '1',
    fullName: 'John Student',
    email: 'student@college.edu',
    phone: '9876543210',
    role: 'Student'
  },
  {
    id: '2',
    fullName: 'Jane Teacher',
    email: 'teacher@college.edu',
    phone: '9876543211', 
    role: 'Teacher'
  },
  {
    id: 'admin',
    fullName: 'Admin User',
    email: 'admin@college.edu',
    phone: '9876543212',
    role: 'Admin'
  }
];

const ADMIN_CODE = 'ADMIN123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'Admin';

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('canteen_user');
    const savedGuest = localStorage.getItem('canteen_guest');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (savedGuest) {
      setIsGuest(true);
    }
  }, []);

  const login = async (email: string, password: string, adminCode?: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Mock authentication logic
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }

      // Mock password validation (in real app, this would be handled by backend)
      const validPasswords = {
        'student@college.edu': 'student123',
        'teacher@college.edu': 'teacher123',
        'admin@college.edu': 'admin123'
      };

      if (validPasswords[email as keyof typeof validPasswords] !== password) {
        throw new Error('Invalid password');
      }

      // Check admin code if user is admin
      if (foundUser.role === 'Admin' && adminCode !== ADMIN_CODE) {
        throw new Error('Invalid admin code');
      }

      setUser(foundUser);
      setIsGuest(false);
      localStorage.setItem('canteen_user', JSON.stringify(foundUser));
      localStorage.removeItem('canteen_guest');
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        ...userData
      };

      // In real app, this would be sent to backend
      MOCK_USERS.push(newUser);
      
      setUser(newUser);
      setIsGuest(false);
      localStorage.setItem('canteen_user', JSON.stringify(newUser));
      localStorage.removeItem('canteen_guest');
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
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

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('canteen_user');
    localStorage.removeItem('canteen_guest');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isGuest,
      login,
      register,
      loginAsGuest,
      logout,
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