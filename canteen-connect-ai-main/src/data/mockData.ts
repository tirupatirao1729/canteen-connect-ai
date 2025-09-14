import { MenuItem } from '@/contexts/CartContext';

export const MENU_ITEMS: MenuItem[] = [
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
    image: "/src/assets/masala-dosa.jpg"
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
    image: "/src/assets/chicken-biryani.jpg"
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
  },
  {
    id: 7,
    name: "Mutton Curry",
    category: "Main Course",
    price: 150,
    type: "Non-Veg",
    rating: 4.7,
    prepTime: "30 min",
    description: "Tender mutton cooked in aromatic spices",
    isSpecial: true,
    image: "/placeholder.svg"
  },
  {
    id: 8,
    name: "Idli Sambar",
    category: "Breakfast",
    price: 40,
    type: "Veg",
    rating: 4.6,
    prepTime: "12 min",
    description: "Steamed rice cakes with lentil curry and coconut chutney",
    isSpecial: false,
    image: "/placeholder.svg"
  }
];

export const CATEGORIES = ['All', 'Breakfast', 'Main Course', 'Snacks', 'Beverages', 'Desserts'];
export const TYPES = ['All', 'Veg', 'Non-Veg'];

export interface Order {
  id: string;
  userId?: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Rejected';
  totalAmount: number;
  roomNumber: string;
  contactNumber: string;
  paymentMethod: string;
  createdAt: Date;
  isGuestOrder: boolean;
}

export interface Review {
  id: string;
  userId?: string;
  userName: string;
  itemId: number;
  itemName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Student',
    itemId: 1,
    itemName: 'Masala Dosa',
    rating: 5,
    comment: 'Absolutely delicious! The best dosa I\'ve had in the canteen.',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Teacher',
    itemId: 2,
    itemName: 'Chicken Biryani',
    rating: 4,
    comment: 'Good flavor, but could use a bit more spice.',
    createdAt: new Date('2024-01-14')
  },
  {
    id: '3',
    userName: 'Anonymous Guest',
    itemId: 3,
    itemName: 'Veg Sandwich',
    rating: 4,
    comment: 'Fresh ingredients and quick service!',
    createdAt: new Date('2024-01-13')
  }
];