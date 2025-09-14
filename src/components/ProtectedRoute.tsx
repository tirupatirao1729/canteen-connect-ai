import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only allow registered users (not guests) for protected routes
<<<<<<< HEAD
  if (!user) {
=======
  if (!user || isGuest) {
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

<<<<<<< HEAD
export default ProtectedRoute;
=======
export default ProtectedRoute;
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
