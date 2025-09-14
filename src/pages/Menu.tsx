import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { MENU_ITEMS, CATEGORIES, TYPES } from '@/data/mockData';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Plus, 
  Minus, 
  Leaf, 
  Utensils,
  ShoppingCart,
  ChevronDown,
  ImageIcon
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Menu = () => {
  const { addToCart, removeFromCart, getItemQuantity, getTotalItems } = useCart();
<<<<<<< HEAD
  const { user, isGuest, isAdmin } = useAuth();
=======
  const { user } = useAuth();
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Filter menu items
  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleAddToCart = (item: typeof MENU_ITEMS[0]) => {
    addToCart(item);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromCart = (itemId: number) => {
    const item = MENU_ITEMS.find(i => i.id === itemId);
    removeFromCart(itemId);
    if (item) {
      toast({
        title: "Removed from Cart",
        description: `${item.name} quantity decreased.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
<<<<<<< HEAD
            {isAdmin 
              ? "View and manage menu items - Add to cart functionality is disabled for admin users"
              : "Discover delicious meals prepared fresh daily with authentic flavors and quality ingredients"
            }
          </p>
          {isAdmin && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm">
              <Utensils className="w-4 h-4 mr-2" />
              Admin View - Read Only
            </div>
          )}
=======
            Discover delicious meals prepared fresh daily with authentic flavors and quality ingredients
          </p>
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-background rounded-2xl p-6 shadow-lg border border-border mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for dishes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Category:</span>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Type:</span>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredItems.length} of {MENU_ITEMS.length} items
          </p>
          
<<<<<<< HEAD
          {/* Cart Summary - Hidden for Admin */}
          {!isAdmin && getTotalItems() > 0 && (
=======
          {/* Cart Summary */}
          {getTotalItems() > 0 && (
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
            <Badge variant="default" className="bg-primary text-primary-foreground px-4 py-2">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {getTotalItems()} items in cart
            </Badge>
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="menu-card group relative overflow-hidden">
              {item.isSpecial && (
                <Badge className="absolute top-4 left-4 z-10 bg-warning text-warning-foreground">
                  Special
                </Badge>
              )}
              
              <CardContent className="p-0">
                {/* Image */}
                <div className="aspect-video bg-gradient-subtle rounded-t-xl flex items-center justify-center overflow-hidden">
                  {item.image && item.image !== '/placeholder.svg' ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    {item.type === 'Veg' && (
                      <Badge variant="outline" className="text-success border-success ml-2 flex-shrink-0">
                        <Leaf className="w-3 h-3 mr-1" />
                        Veg
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center text-warning">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{item.prepTime}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₹{item.price}
                    </span>
                    
<<<<<<< HEAD
                    {/* Cart Controls - Hidden for Admin */}
                    {!isAdmin && (
                      <div className="flex items-center space-x-2">
                        {getItemQuantity(item.id) > 0 ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium w-8 text-center">
                              {getItemQuantity(item.id)}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className="h-8 w-8 p-0 bg-primary hover:bg-primary-hover"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            className="bg-gradient-primary hover:bg-primary-hover btn-bounce"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        )}
                      </div>
                    )}
=======
                    <div className="flex items-center space-x-2">
                      {getItemQuantity(item.id) > 0 ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">
                            {getItemQuantity(item.id)}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            className="h-8 w-8 p-0 bg-primary hover:bg-primary-hover"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="bg-gradient-primary hover:bg-primary-hover btn-bounce"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      )}
                    </div>
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedType('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

<<<<<<< HEAD
        {/* Fixed Cart Button - Hidden for Admin */}
        {!isAdmin && getTotalItems() > 0 && (
=======
        {/* Fixed Cart Button */}
        {getTotalItems() > 0 && (
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
          <div className="fixed bottom-6 right-6 z-50">
            <Link to="/cart">
              <Button 
                size="lg" 
                className="rounded-full bg-gradient-primary hover:bg-primary-hover shadow-lg animate-bounce-gentle"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Cart ({getTotalItems()})
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;