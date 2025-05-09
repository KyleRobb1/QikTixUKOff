const supabase = require('../config/supabaseClient');
const { format } = require('date-fns');

class Order {
  constructor(data) {
    this.order_id = data.order_id;
    this.user_id = data.user_id;
    this.event_id = data.event_id;
    this.ticket_quantity = data.ticket_quantity;
    this.total_price = data.total_price;
    this.status = data.status;
    this.created_at = data.created_at;
    this.event = data.event;
    this.user = data.user;
  }

  // Format order data for display
  formatted() {
    return {
      ...this,
      created_at: this.created_at ? format(new Date(this.created_at), 'PPpp') : null,
      total_price: this.total_price ? `£${parseFloat(this.total_price).toFixed(2)}` : null
    };
  }

  // Get all orders
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          events (*),
          users (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching orders: ${error.message}`);
      }

      return data.map(order => {
        return new Order({
          ...order,
          event: order.events,
          user: order.users
        });
      });
    } catch (err) {
      console.error('Error in getAll:', err);
      throw err;
    }
  }

  // Get orders by user ID
  static async getByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          events (*),
          users (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching user orders: ${error.message}`);
      }

      return data.map(order => {
        return new Order({
          ...order,
          event: order.events,
          user: order.users
        });
      });
    } catch (err) {
      console.error('Error in getByUserId:', err);
      throw err;
    }
  }

  // Get order by ID
  static async getById(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          events (*),
          users (*)
        `)
        .eq('order_id', orderId)
        .single();

      if (error) {
        throw new Error(`Error fetching order: ${error.message}`);
      }

      return new Order({
        ...data,
        event: data.events,
        user: data.users
      });
    } catch (err) {
      console.error('Error in getById:', err);
      throw err;
    }
  }

  // Create a new order
  static async create(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          user_id: orderData.user_id,
          event_id: orderData.event_id,
          ticket_quantity: orderData.ticket_quantity,
          total_price: orderData.total_price,
          status: orderData.status || 'pending'
        }])
        .select();

      if (error) {
        throw new Error(`Error creating order: ${error.message}`);
      }

      return new Order(data[0]);
    } catch (err) {
      console.error('Error in create:', err);
      throw err;
    }
  }

  // Update order
  static async update(orderId, updates) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('order_id', orderId)
        .select();

      if (error) {
        throw new Error(`Error updating order: ${error.message}`);
      }

      return new Order(data[0]);
    } catch (err) {
      console.error('Error in update:', err);
      throw err;
    }
  }

  // Update order status
  static async updateStatus(orderId, status) {
    return Order.update(orderId, { status });
  }

  // Delete order
  static async delete(orderId) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('order_id', orderId);

      if (error) {
        throw new Error(`Error deleting order: ${error.message}`);
      }

      return true;
    } catch (err) {
      console.error('Error in delete:', err);
      throw err;
    }
  }
}

module.exports = Order; 