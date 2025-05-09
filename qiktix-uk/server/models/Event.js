const supabase = require('../config/supabaseClient');
const { format, parseISO } = require('date-fns');
const { isValidUUID } = require('../utils/helpers');

class Event {
  constructor(data) {
    this.event_id = data.event_id;
    this.name = data.name;
    this.description = data.description;
    this.location = data.location;
    this.date = data.date;
    this.time = data.time;
    this.price = data.price;
    this.ticket_limit = data.ticket_limit;
    this.creator_id = data.creator_id;
    this.image_url = data.image_url;
    this.created_at = data.created_at;
    this.creator = data.creator;
    this.available_tickets = data.available_tickets;
  }

  // Format event data for display
  formatted() {
    return {
      ...this,
      date: this.date ? format(parseISO(this.date), 'EEE do MMM yyyy') : null,
      price: this.price ? `£${parseFloat(this.price).toFixed(2)}` : null,
      created_at: this.created_at ? format(new Date(this.created_at), 'PPpp') : null
    };
  }

  // Get all events
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users!events_creator_id_fkey (*)
        `)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Error fetching events: ${error.message}`);
      }

      const eventsWithCreator = data.map(event => {
        return {
          ...event,
          creator: event.users
        };
      });

      // Calculate available tickets for each event
      const events = await Promise.all(eventsWithCreator.map(async (event) => {
        const availableTickets = await Event.getAvailableTickets(event.event_id);
        return new Event({
          ...event,
          available_tickets: availableTickets
        });
      }));

      return events;
    } catch (err) {
      console.error('Error in getAll:', err);
      throw err;
    }
  }

  // Get upcoming events
  static async getUpcoming() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users!events_creator_id_fkey (*)
        `)
        .gte('date', today)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Error fetching upcoming events: ${error.message}`);
      }

      const eventsWithCreator = data.map(event => {
        return {
          ...event,
          creator: event.users
        };
      });

      // Calculate available tickets for each event
      const events = await Promise.all(eventsWithCreator.map(async (event) => {
        const availableTickets = await Event.getAvailableTickets(event.event_id);
        return new Event({
          ...event,
          available_tickets: availableTickets
        });
      }));

      return events;
    } catch (err) {
      console.error('Error in getUpcoming:', err);
      throw err;
    }
  }

  // Get events by creator ID
  static async getByCreatorId(creatorId) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users!events_creator_id_fkey (*)
        `)
        .eq('creator_id', creatorId)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Error fetching creator events: ${error.message}`);
      }

      const eventsWithCreator = data.map(event => {
        return {
          ...event,
          creator: event.users
        };
      });

      // Calculate available tickets for each event
      const events = await Promise.all(eventsWithCreator.map(async (event) => {
        const availableTickets = await Event.getAvailableTickets(event.event_id);
        return new Event({
          ...event,
          available_tickets: availableTickets
        });
      }));

      return events;
    } catch (err) {
      console.error('Error in getByCreatorId:', err);
      throw err;
    }
  }

  // Calculate available tickets for an event
  static async getAvailableTickets(eventId) {
    try {
      // Get the event to get the ticket limit
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('ticket_limit')
        .eq('event_id', eventId)
        .single();

      if (eventError) {
        throw new Error(`Error fetching event ticket limit: ${eventError.message}`);
      }

      // Get total tickets sold
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('ticket_quantity')
        .eq('event_id', eventId)
        .in('status', ['completed', 'pending']);

      if (ordersError) {
        throw new Error(`Error fetching orders: ${ordersError.message}`);
      }

      const ticketsSold = ordersData.reduce((total, order) => {
        return total + order.ticket_quantity;
      }, 0);

      return eventData.ticket_limit - ticketsSold;
    } catch (err) {
      console.error('Error in getAvailableTickets:', err);
      return 0; // In case of error, assume no tickets available
    }
  }

  // Get event by ID
  static async getById(eventId) {
    try {
      if (!isValidUUID(eventId)) {
        throw new Error('Invalid event ID format');
      }

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users!events_creator_id_fkey (*)
        `)
        .eq('event_id', eventId)
        .single();

      if (error) {
        throw new Error(`Error fetching event: ${error.message}`);
      }

      const availableTickets = await Event.getAvailableTickets(eventId);

      return new Event({
        ...data,
        creator: data.users,
        available_tickets: availableTickets
      });
    } catch (err) {
      console.error('Error in getById:', err);
      throw err;
    }
  }

  // Create a new event
  static async create(eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          name: eventData.name,
          description: eventData.description,
          location: eventData.location,
          date: eventData.date,
          time: eventData.time,
          price: eventData.price,
          ticket_limit: eventData.ticket_limit,
          creator_id: eventData.creator_id,
          image_url: eventData.image_url
        }])
        .select();

      if (error) {
        throw new Error(`Error creating event: ${error.message}`);
      }

      return new Event({
        ...data[0],
        available_tickets: data[0].ticket_limit
      });
    } catch (err) {
      console.error('Error in create:', err);
      throw err;
    }
  }

  // Update event
  static async update(eventId, updates) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('event_id', eventId)
        .select();

      if (error) {
        throw new Error(`Error updating event: ${error.message}`);
      }

      const availableTickets = await Event.getAvailableTickets(eventId);

      return new Event({
        ...data[0],
        available_tickets: availableTickets
      });
    } catch (err) {
      console.error('Error in update:', err);
      throw err;
    }
  }

  // Delete event
  static async delete(eventId) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('event_id', eventId);

      if (error) {
        throw new Error(`Error deleting event: ${error.message}`);
      }

      return true;
    } catch (err) {
      console.error('Error in delete:', err);
      throw err;
    }
  }

  // Search events
  static async search(query) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users!events_creator_id_fkey (*)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Error searching events: ${error.message}`);
      }

      const eventsWithCreator = data.map(event => {
        return {
          ...event,
          creator: event.users
        };
      });

      // Calculate available tickets for each event
      const events = await Promise.all(eventsWithCreator.map(async (event) => {
        const availableTickets = await Event.getAvailableTickets(event.event_id);
        return new Event({
          ...event,
          available_tickets: availableTickets
        });
      }));

      return events;
    } catch (err) {
      console.error('Error in search:', err);
      throw err;
    }
  }
}

module.exports = Event; 