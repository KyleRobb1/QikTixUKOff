const { Event, User, Ticket } = require('../models');
const { uploadToS3 } = require('../services/aws.service');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { 
      title, description, location, startDate, endDate, 
      category, totalTickets, price, isFeatured 
    } = req.body;
    
    // Get organizer ID from authenticated user
    const organizerId = req.user.id;
    
    // Create event
    const event = await Event.create({
      title,
      description,
      location,
      startDate,
      endDate,
      category,
      organizerId,
      totalTickets,
      availableTickets: totalTickets, // Initially all tickets are available
      price,
      isFeatured: isFeatured || false,
      status: 'published'
    });
    
    // If image was uploaded, save it
    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      event.imageUrl = imageUrl;
      await event.save();
    }
    
    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// Get all events with pagination and filters
exports.getAllEvents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      startDate, 
      endDate, 
      search,
      sort = 'startDate',
      order = 'ASC'
    } = req.query;
    
    // Build filter conditions
    const whereConditions = { status: 'published' };
    
    if (category) {
      whereConditions.category = category;
    }
    
    if (startDate) {
      whereConditions.startDate = { [Op.gte]: new Date(startDate) };
    }
    
    if (endDate) {
      whereConditions.endDate = { [Op.lte]: new Date(endDate) };
    }
    
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get events
    const { count, rows: events } = await Event.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [[sort, order]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      events,
      pagination: {
        totalEvents: count,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Error retrieving event', error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, location, startDate, endDate, 
      category, totalTickets, price, status, isFeatured 
    } = req.body;
    
    // Find event
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer or admin
    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    // Update event fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (location) event.location = location;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (category) event.category = category;
    if (price) event.price = price;
    if (status) event.status = status;
    
    // Handle ticket count changes
    if (totalTickets) {
      // Get current sold tickets count
      const soldTickets = event.totalTickets - event.availableTickets;
      
      // Ensure new total is not less than sold tickets
      if (totalTickets < soldTickets) {
        return res.status(400).json({ 
          message: 'Cannot reduce total tickets below the number of sold tickets',
          soldTickets
        });
      }
      
      event.totalTickets = totalTickets;
      event.availableTickets = totalTickets - soldTickets;
    }
    
    if (typeof isFeatured !== 'undefined') {
      event.isFeatured = isFeatured;
    }
    
    // If image was uploaded, save it
    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      event.imageUrl = imageUrl;
    }
    
    await event.save();
    
    res.status(200).json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find event
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer or admin
    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    // Check if tickets have been sold
    const ticketCount = await Ticket.count({ where: { eventId: id } });
    if (ticketCount > 0) {
      // Instead of deleting, mark as cancelled
      event.status = 'cancelled';
      await event.save();
      
      return res.status(200).json({
        message: 'Event has been cancelled because tickets have been sold',
        event
      });
    }
    
    // If no tickets sold, delete the event
    await event.destroy();
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// Get events by organizer
exports.getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;
    
    const events = await Event.findAll({
      where: { organizerId },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ events });
  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({ message: 'Error retrieving organizer events', error: error.message });
  }
};
