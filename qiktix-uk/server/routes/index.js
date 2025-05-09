const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Home page route
router.get('/', indexController.getHomePage);

// Events page route
router.get('/events', indexController.getEventsPage);

// Event submission routes
router.get('/events/submit', indexController.getSubmitEventPage);
router.post('/events/submit', indexController.submitEvent);

// User Account page route (requires authentication)
router.get('/account', indexController.getUserAccount);

// Ticket PDF route
router.get('/tickets/:ticketId/pdf', indexController.getTicketPDF);

// Apple Wallet pass route
router.get('/tickets/:ticketId/wallet', indexController.getAppleWalletPass);

// Help, Careers, Press, and Create Event pages
router.get('/help', indexController.getHelpPage);
router.get('/careers', indexController.getCareersPage);
router.get('/press', indexController.getPressPage);
router.get('/events/create', indexController.getCreateEventPage);

// Add other routes (e.g., auth) here later

module.exports = router; 