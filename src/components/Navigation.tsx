import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingCart, 
  User, 
  Star, 
  Menu, 
  X,
  LogOut,
  Shield,
  ShoppingBag
} from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, isGuest, logout } = useAuth();
  const { getTotalItems } = useCart();

  const navItems = [
    { path: '/home', label: 'Home', icon: Home, requiresAuth: true },
    // Hide menu, cart, and orders for admin users
    ...(isAdmin ? [] : [
      { path: '/menu', label: 'Menu', icon: UtensilsCrossed, requiresAuth: true },
      { path: '/cart', label: 'Cart', icon: ShoppingCart, requiresAuth: true },
      ...(user || isGuest ? [{ path: '/orders', label: 'Orders', icon: ShoppingBag, requiresAuth: true }] : []),
    ]),
    { path: '/reviews', label: 'Reviews', icon: Star, requiresAuth: true },
    ...(user && !isGuest ? [
      ...(isAdmin ? [{ path: '/admin-profile', label: 'Profile', icon: User, requiresAuth: true }] : [{ path: '/profile', label: 'Profile', icon: User, requiresAuth: true }])
    ] : []),
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: Shield, requiresAuth: true }] : []),
  ].filter(item => !item.requiresAuth || user || isGuest);

  const isActivePath = (path: string) => location.pathname === path;

  // Don't show navigation if user is not authenticated
  if (!user && !isGuest) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                Canteen Connect
              </h1>
              <p className="text-xs text-muted-foreground">Fresh & Fast</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActivePath(path) ? "default" : "ghost"}
                  className={`transition-all duration-200 ${
                    isActivePath(path) 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Cart & Auth */}
          <div className="flex items-center space-x-2">
            {/* Hide cart button for admin users */}
            {!isAdmin && (
              <Link to="/cart">
                <Button variant="outline" size="sm" className="relative hover:bg-accent">
                  <ShoppingCart className="w-4 h-4" />
                  {getTotalItems() > 0 && (
                    <Badge 
                      variant="default" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs"
                    >
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
            
            {user || isGuest ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user ? `Hi, ${user.fullName.split(' ')[0]}` : 'Guest'}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={logout}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-gradient-primary hover:bg-primary-hover">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActivePath(path) ? "default" : "ghost"}
                    className={`w-full justify-start transition-all duration-200 ${
                      isActivePath(path) 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;