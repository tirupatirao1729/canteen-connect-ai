import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Plus, 
  Minus, 
  Leaf, 
  Utensils,
  ShoppingCart
} from 'lucide-react';

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [cart, setCart] = useState<{[key: number]: number}>({});

  // Mock menu data
  const categories = ['All', 'Breakfast', 'Main Course', 'Snacks', 'Beverages', 'Desserts'];
  const types = ['All', 'Veg', 'Non-Veg'];

  const menuItems = [
    {
      id: 1,
      name: "Masala Dosa",
      category: "Breakfast",
      price: 45,
      type: "Veg",
      rating: 4.8,
      prepTime: "15 min",
      description: "Crispy dosa with spiced potato filling and chutneys",
      isSpecial: true,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Chicken Biryani",
      category: "Main Course",
      price: 120,
      type: "Non-Veg",
      rating: 4.9,
      prepTime: "25 min",
      description: "Aromatic basmati rice with tender chicken and spices",
      isSpecial: true,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Veg Sandwich",
      category: "Snacks",
      price: 35,
      type: "Veg",
      rating: 4.6,
      prepTime: "8 min",
      description: "Fresh vegetables with mint chutney in toasted bread",
      isSpecial: false,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Masala Chai",
      category: "Beverages",
      price: 15,
      type: "Veg",
      rating: 4.7,
      prepTime: "5 min",
      description: "Traditional Indian tea with aromatic spices",
      isSpecial: false,
      image: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Paneer Butter Masala",
      category: "Main Course",
      price: 95,
      type: "Veg",
      rating: 4.8,
      prepTime: "20 min",
      description: "Rich and creamy paneer curry with butter naan",
      isSpecial: false,
      image: "/placeholder.svg"
    },
    {
      id: 6,
      name: "Samosa",
      category: "Snacks",
      price: 20,
      type: "Veg",
      rating: 4.5,
      prepTime: "5 min",
      description: "Crispy pastry filled with spiced potatoes",
      isSpecial: false,
      image: "/placeholder.svg"
    }
  ];

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }));
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Discover delicious meals prepared fresh daily with authentic flavors and quality ingredients
          </p>
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
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`category-pill ${
                      selectedCategory === category 
                        ? 'bg-primary text-primary-foreground' 
                        : ''
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Type:</span>
              <div className="flex gap-2">
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`category-pill ${
                      selectedType === type 
                        ? 'bg-secondary text-secondary-foreground' 
                        : ''
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredItems.length} of {menuItems.length} items
          </p>
          
          {/* Cart Summary */}
          {getTotalItems() > 0 && (
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
                <div className="aspect-video bg-gradient-subtle rounded-t-xl flex items-center justify-center">
                  <Utensils className="w-12 h-12 text-muted-foreground group-hover:scale-110 transition-transform duration-200" />
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
                    
                    <div className="flex items-center space-x-2">
                      {cart[item.id] > 0 ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">
                            {cart[item.id]}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(item.id)}
                            className="h-8 w-8 p-0 bg-primary hover:bg-primary-hover"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => addToCart(item.id)}
                          className="bg-gradient-primary hover:bg-primary-hover btn-bounce"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      )}
                    </div>
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

        {/* Fixed Cart Button */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button 
              size="lg" 
              className="rounded-full bg-gradient-primary hover:bg-primary-hover shadow-lg animate-bounce-gentle"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart ({getTotalItems()})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;