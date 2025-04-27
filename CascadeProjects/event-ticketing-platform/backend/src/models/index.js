const User = require('./user.model');
const Event = require('./event.model');
const Ticket = require('./ticket.model');
const Order = require('./order.model');

// Define relationships
// User - Event (organizer)
User.hasMany(Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

// User - Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Ticket
User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Event - Ticket
Event.hasMany(Ticket, { foreignKey: 'eventId', as: 'tickets' });
Ticket.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Order - Ticket
Order.hasMany(Ticket, { foreignKey: 'orderId', as: 'tickets' });
Ticket.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

module.exports = {
  User,
  Event,
  Ticket,
  Order
};
