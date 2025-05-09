const supabase = require('../config/supabaseClient');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

// Controller for the main index routes

exports.getHomePage = (req, res, next) => {
    res.render('home', { 
        title: 'Home' // Pass title variable to the view
    });
};

// Controller for the events page
exports.getEventsPage = async (req, res, next) => {
    try {
        // Fetch events from the 'events' table in Supabase
        const { data: events, error } = await supabase
            .from('events')
            .select('*') // Select all columns
            // Add ordering or filtering later if needed
            // .order('date', { ascending: true });

        if (error) {
            throw error; // Throw error to be caught by the catch block
        }

        res.render('events', { 
            title: 'Events',
            events: events || [] // Pass fetched events or an empty array
        });
    } catch (err) {
        console.error("Error fetching events from Supabase:", err);
        // Pass error to the Express error handler
        next(err); 
    }
};

// Controller for the user account page
exports.getUserAccount = async (req, res, next) => {
    // If user is not logged in, redirect to login
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    try {
        // Check if we need to create a sample event and ticket for testing
        await createSampleTicketIfNeeded(res.locals.user.id);

        // Fetch user's tickets with event details
        const tickets = await Ticket.getUserTickets(res.locals.user.id);
        
        // Fetch events created by this user
        const userEvents = await Event.getByCreatorId(res.locals.user.id);
        
        // Render account page with user, tickets, and events
        res.render('account', { 
            title: 'My Account',
            user: res.locals.user,
            tickets: tickets || [], // Ensure tickets is always an array
            userEvents: userEvents || [] // Ensure userEvents is always an array
        });
    } catch (err) {
        console.error("Error fetching account data:", err);
        // If there's an error, still render the page but with empty data
        res.render('account', {
            title: 'My Account',
            user: res.locals.user,
            tickets: [], // Empty array when error occurs
            userEvents: [] // Empty array when error occurs
        });
    }
};

// Helper function to create a sample event and ticket for testing
async function createSampleTicketIfNeeded(userId) {
    try {
        // Check if tables exist first
        try {
            const { count, error: tableCheckError } = await supabase
                .from('events')
                .select('*', { count: 'exact', head: true });
                
            if (tableCheckError) {
                console.error('Error checking events table, it might not exist:', tableCheckError.message);
                return; // Exit early if table doesn't exist
            }
        } catch (tableErr) {
            console.error('Table check failed, Supabase tables might not be set up:', tableErr.message);
            return; // Exit early
        }
        
        // Check if user already has tickets
        const { data: existingTickets, error: ticketError } = await supabase
            .from('tickets')
            .select('*')
            .eq('user_id', userId)
            .limit(1);
            
        if (ticketError) {
            console.error('Error checking existing tickets:', ticketError.message);
            return; // Exit if tickets table has issues
        }
        
        // If user already has tickets, no need to create a sample
        if (existingTickets && existingTickets.length > 0) {
            return;
        }
        
        // Check if we have a sample event, create one if not
        let eventId;
        const { data: existingEvents, error: eventError } = await supabase
            .from('events')
            .select('id')
            .eq('name', 'Sample Concert')
            .limit(1);
            
        if (eventError) throw eventError;
        
        if (existingEvents && existingEvents.length > 0) {
            // Use existing sample event
            eventId = existingEvents[0].id;
        } else {
            // Create a sample event
            const eventDate = new Date();
            eventDate.setDate(eventDate.getDate() + 30); // 30 days from now
            
            const { data: newEvent, error: createEventError } = await supabase
                .from('events')
                .insert([
                    {
                        name: 'Sample Concert',
                        date: eventDate.toISOString(),
                        location: 'O2 Arena, London',
                        description: 'This is a sample event for testing purposes.',
                        price: 49.99
                    }
                ])
                .select();
                
            if (createEventError) throw createEventError;
            eventId = newEvent[0].id;
        }
        
        // Create a sample ticket for the user
        await Ticket.createTicket(
            userId,
            eventId,
            'VIP',
            49.99
        );
        
        console.log('Created sample ticket for user:', userId);
    } catch (err) {
        console.error('Error creating sample ticket:', err);
        // Don't throw - this is just a convenience function
    }
}

// Generate PDF ticket
exports.getTicketPDF = async (req, res, next) => {
    // If user is not logged in, redirect to login
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    const ticketId = req.params.ticketId;

    try {
        // Fetch the ticket details
        const { data: tickets, error } = await supabase
            .from('tickets')
            .select(`
                *,
                events:event_id (*)
            `)
            .eq('ticket_id', ticketId)
            .eq('user_id', res.locals.user.id); // Security: ensure the ticket belongs to this user
            
        if (error) throw error;
        
        if (!tickets || tickets.length === 0) {
            return res.status(404).send('Ticket not found');
        }
        
        const ticket = tickets[0];
        const event = ticket.events;
        
        // Generate or get the PDF
        const pdfPath = await Ticket.generateTicketPDF(ticket, event);
        
        // Redirect to the PDF file
        res.redirect(pdfPath);
    } catch (err) {
        console.error("Error generating ticket PDF:", err);
        next(err);
    }
};

// Generate Apple Wallet pass
exports.getAppleWalletPass = async (req, res, next) => {
    // If user is not logged in, redirect to login
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    const ticketId = req.params.ticketId;

    try {
        // Fetch the ticket details
        const { data: tickets, error } = await supabase
            .from('tickets')
            .select(`
                *,
                events:event_id (*)
            `)
            .eq('ticket_id', ticketId)
            .eq('user_id', res.locals.user.id); // Security: ensure the ticket belongs to this user
            
        if (error) throw error;
        
        if (!tickets || tickets.length === 0) {
            return res.status(404).send('Ticket not found');
        }
        
        const ticket = tickets[0];
        const event = ticket.events;
        
        // In a real implementation, this would generate a .pkpass file
        // For now, just redirect to a placeholder page
        res.render('wallet-pass', {
            title: 'Apple Wallet Pass',
            ticket: ticket,
            event: event
        });
    } catch (err) {
        console.error("Error generating Apple Wallet pass:", err);
        next(err);
    }
};

// Display the event submission form
exports.getSubmitEventPage = (req, res, next) => {
    // If user is not logged in, redirect to login
    if (!res.locals.user) {
        return res.redirect('/login');
    }
    
    res.render('submit-event', { 
        title: 'Submit Event',
        error: null,
        success: null
    });
};

// Handle event submission
exports.submitEvent = async (req, res, next) => {
    // If user is not logged in, redirect to login
    if (!res.locals.user) {
        return res.redirect('/login');
    }
    
    try {
        // Extract event data from request body
        const { 
            name, date, time, location, description, price, 
            ticket_limit, image_url 
        } = req.body;
        
        // Validate required fields
        if (!name || !date || !time || !location || !description || !price) {
            return res.render('submit-event', {
                title: 'Submit Event',
                error: 'All required fields must be filled out',
                success: null
            });
        }
        
        // Combine date and time for database
        const eventDateTime = `${date}T${time}:00`;
        
        // Create event data object
        const eventData = {
            name,
            date: eventDateTime,
            location,
            description,
            price: parseFloat(price),
            ticket_limit: parseInt(ticket_limit, 10) || 100,
            creator_id: res.locals.user.id,
            image_url: image_url || null
        };
        
        // Create the event using the Event model
        const newEvent = await Event.create(eventData);
        
        // Redirect to the event detail page or show success message
        return res.render('submit-event', {
            title: 'Submit Event',
            error: null,
            success: 'Event submitted successfully! It will be available soon.'
        });
        
    } catch (err) {
        console.error('Error submitting event:', err);
        return res.render('submit-event', {
            title: 'Submit Event',
            error: 'There was an error submitting your event. Please try again.',
            success: null
        });
    }
};

// Help page
exports.getHelpPage = (req, res) => {
    res.render('help', { title: 'Help' });
};

// Careers page
exports.getCareersPage = (req, res) => {
    res.render('careers', { title: 'Careers' });
};

// Press page
exports.getPressPage = (req, res) => {
    res.render('press', { title: 'Press' });
};

// Create Event page
exports.getCreateEventPage = (req, res) => {
    res.render('events/create', { title: 'Create Event' });
};

// Add other controller functions as needed 