import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Order = Tables<'orders'>;
export type OrderInsert = TablesInsert<'orders'>;
export type OrderUpdate = TablesUpdate<'orders'>;

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  type?: 'Veg' | 'Non-Veg';
}

export interface CreateOrderData {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  roomNumber: string;
  contactNumber: string;
  paymentMethod: string;
  specialInstructions?: string;
<<<<<<< HEAD
  isGuestOrder?: boolean;
=======
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
}

export const orderService = {
  // Create a new order
  async createOrder(orderData: CreateOrderData): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const orderNumber = `ORD${Date.now()}`;
      
      const normalizedPaymentMethod = orderData.paymentMethod === 'cash' ? 'cash' : orderData.paymentMethod === 'card' ? 'card' : 'upi';
      const orderInsert: OrderInsert = {
        user_id: orderData.userId,
        order_number: orderNumber,
        items: orderData.items,
        total_amount: orderData.totalAmount,
        room_number: orderData.roomNumber,
        payment_method: normalizedPaymentMethod,
        special_instructions: orderData.specialInstructions,
        status: 'pending',
        payment_status: 'pending',
        placed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        return { success: false, error: error.message };
      }

      return { success: true, orderId: data.id };
    } catch (error: any) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }
  },

  // Get orders for a user
  async getUserOrders(userId: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('placed_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return { success: false, error: error.message };
      }

      return { success: true, orders: data || [] };
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all orders (for admin)
  async getAllOrders(): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('placed_at', { ascending: false });

      if (error) {
        console.error('Error fetching all orders:', error);
        return { success: false, error: error.message };
      }

      return { success: true, orders: data || [] };
    } catch (error: any) {
      console.error('Error fetching all orders:', error);
      return { success: false, error: error.message };
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete an order
  async deleteOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting order:', error);
      return { success: false, error: error.message };
    }
<<<<<<< HEAD
  },

  // Subscribe to real-time order updates
  subscribeToOrders(callback: (orders: Order[]) => void) {
    const subscription = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        async () => {
          // Fetch updated orders when any change occurs
          const result = await orderService.getAllOrders();
          if (result.success && result.orders) {
            callback(result.orders);
          }
        }
      )
      .subscribe();

    return subscription;
  },

  // Get order statistics
  async getOrderStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_amount, placed_at');

      if (error) {
        console.error('Error fetching order stats:', error);
        return { success: false, error: error.message };
      }

      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        accepted: orders.filter(o => o.status === 'accepted').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + Number(o.total_amount), 0),
        todayOrders: orders.filter(o => {
          const orderDate = new Date(o.placed_at);
          const today = new Date();
          return orderDate.toDateString() === today.toDateString();
        }).length
      };

      return { success: true, stats };
    } catch (error: any) {
      console.error('Error fetching order stats:', error);
      return { success: false, error: error.message };
    }
=======
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
  }
};



