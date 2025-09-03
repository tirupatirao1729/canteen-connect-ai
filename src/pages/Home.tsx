import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  Star, 
  Utensils, 
  Users,
  Sparkles,
  Leaf,
  Zap
} from 'lucide-react';

// Import food images
import heroFoodSpread from '@/assets/hero-food-spread.jpg';
import chickenBiryani from '@/assets/chicken-biryani.jpg';
import masalaDosa from '@/assets/masala-dosa.jpg';

const Home = () => {
  // Mock data for special items
  const specialItems = [
    {
      id: 1,
      name: "Masala Dosa",
      price: 45,
      image: masalaDosa,
      rating: 4.8,
      isVeg: true,
      preparationTime: "15 min"
    },
    {
      id: 2,
      name: "Chicken Biryani",
      price: 120,
      image: chickenBiryani, 
      rating: 4.9,
      isVeg: false,
      preparationTime: "20 min"
    },
    {
      id: 3,
      name: "Veg Sandwich",
      price: 35,
      image: "/placeholder.svg",
      rating: 4.6,
      isVeg: true,
      preparationTime: "10 min"
    }
  ];

  const stats = [
    { icon: Users, label: "Happy Students", value: "2,500+" },
    { icon: Utensils, label: "Menu Items", value: "150+" },
    { icon: Clock, label: "Avg Prep Time", value: "12 min" },
    { icon: Star, label: "Avg Rating", value: "4.8" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroFoodSpread} 
            alt="Delicious college canteen food spread" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-glow to-secondary opacity-90" />
        </div>
        <div className="relative">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="flex justify-center mb-6">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Welcome to Canteen Connect
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                Fresh Food,<br />
                <span className="bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
                  Fast Delivery
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto animate-slide-up">
                Order your favorite meals from our college canteen with just a few clicks. 
                Fresh ingredients, authentic flavors, delivered right to your room.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                <Link to="/menu">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 group">
                    Browse Menu
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    Sign Up Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-gentle" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce-gentle delay-1000" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, label, value }) => (
              <Card key={label} className="text-center p-6 card-hover">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-1">{value}</h3>
                  <p className="text-muted-foreground text-sm">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Items Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Today's Specials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Most Popular Items
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These are our students' favorite dishes, prepared fresh daily with love and authentic flavors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {specialItems.map((item) => (
              <Card key={item.id} className="menu-card group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-subtle rounded-t-xl mb-4 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      {item.isVeg && (
                        <Badge variant="outline" className="text-success border-success">
                          <Leaf className="w-3 h-3 mr-1" />
                          Veg
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-warning">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{item.preparationTime}</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-primary">₹{item.price}</span>
                    </div>
                    
                    <Button className="w-full bg-gradient-primary hover:bg-primary-hover btn-bounce">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/menu">
              <Button size="lg" variant="outline" className="group">
                View Full Menu
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of satisfied students who trust Canteen Connect for their daily meals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" variant="secondary" className="shadow-lg">
                Start Ordering Now
              </Button>
            </Link>
            <Link to="/reviews">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Read Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;