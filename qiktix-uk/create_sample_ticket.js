// Sample ticket creation script
const supabase = require('./server/config/supabaseClient');
const Ticket = require('./server/models/Ticket');

async function createSampleTicket() {
  try {
    console.log('Creating sample ticket...');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      throw new Error('Failed to get user: ' + userError.message);
    }
    
    if (!user) {
      throw new Error('No user found. Please log in first.');
    }
    
    console.log('Creating sample ticket for user:', user.email);
    
    // Check if events table exists and has data
    let eventId;
    
    try {
      // Get first event from database
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('event_id')
        .limit(1);
        
      if (eventsError) {
        throw eventsError;
      }
      
      if (events && events.length > 0) {
        eventId = events[0].event_id;
        console.log('Using existing event:', eventId);
      } else {
        // Create a sample event
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + 30);
        
        const { data: newEvent, error: newEventError } = await supabase
          .from('events')
          .insert([{
            name: 'Hamilton',
            date: eventDate.toISOString(),
            location: 'Victoria Palace Theatre, London',
            description: 'The story of America then, told by America now',
            price: 125.00,
            ticket_limit: 100,
            creator_id: user.id
          }])
          .select();
          
        if (newEventError) {
          throw newEventError;
        }
        
        eventId = newEvent[0].event_id;
        console.log('Created new event:', eventId);
      }
      
      // Create ticket using our model
      const ticket = await Ticket.createTicket(
        user.id,
        eventId,
        'VIP',
        125.00
      );
      
      console.log('Sample ticket created successfully!', ticket.ticket_id);
      console.log('You can now view this ticket in the My Account page.');
      
    } catch (err) {
      console.error('Database error:', err.message);
      console.log('You may need to create the tables in Supabase first.');
      console.log('Use the SQL from setup_supabase.sql file in the SQL Editor of your Supabase project.');
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

createSampleTicket(); 