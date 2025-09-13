import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
<<<<<<< HEAD
  const { user, isGuest, loading } = useAuth();
=======
  const { user, loading } = useAuth();
>>>>>>> 4cc023ed9c05ebda692af206c2e4fb0ab464d2f2

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

<<<<<<< HEAD
  // Only allow registered users (not guests) for protected routes
=======
>>>>>>> 4cc023ed9c05ebda692af206c2e4fb0ab464d2f2
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;