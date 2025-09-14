import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Reviews from "./pages/Reviews";
import Profile from "./pages/Profile";
<<<<<<< HEAD
import AdminProfile from "./pages/AdminProfile";
=======
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import OrderHistory from "./pages/OrderHistory";

const queryClient = new QueryClient();

// Component to handle authentication-based routing
const AppRoutes = () => {
<<<<<<< HEAD
  const { user, isGuest, loading } = useAuth();
=======
  const { user, loading } = useAuth();
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // If user is not authenticated (not logged in and not guest), show login
  if (!user && !isGuest) {
=======
  // If user is not authenticated, show login
  if (!user) {
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

<<<<<<< HEAD
  // If user is authenticated (logged in or guest), show full app
=======
  // If user is authenticated, show full app
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<<<<<<< HEAD
        <Route path="/admin-profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
=======
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
