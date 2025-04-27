const { body, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Password validation rules
const passwordValidationRules = {
  notEmpty: () => body('password')
    .notEmpty().withMessage('Password is required'),
  strength: () => body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
};

// Validate user registration
exports.validateRegistration = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('role')
    .optional()
    .isIn(['user', 'organizer']).withMessage('Role must be either user or organizer'),
  handleValidationErrors
];

// Validate user login
exports.validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  passwordValidationRules.notEmpty(),
  handleValidationErrors
];

// Validate password reset request
exports.validateResetRequest = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  handleValidationErrors
];

// Validate password reset
exports.validatePasswordReset = [
  body('token')
    .notEmpty().withMessage('Reset token is required'),
  passwordValidationRules.notEmpty(),
  passwordValidationRules.strength(),
  body('confirmPassword')
    .notEmpty().withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  handleValidationErrors
];

// Validate event creation
exports.validateEventCreation = [
  body('title')
    .notEmpty().withMessage('Event title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .notEmpty().withMessage('Event description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('location')
    .notEmpty().withMessage('Event location is required'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('category')
    .notEmpty().withMessage('Event category is required'),
  body('totalTickets')
    .notEmpty().withMessage('Total tickets is required')
    .isInt({ min: 1 }).withMessage('Total tickets must be at least 1'),
  body('price')
    .notEmpty().withMessage('Ticket price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  handleValidationErrors
];

// Validate ticket purchase
exports.validateTicketPurchase = [
  body('eventId')
    .notEmpty().withMessage('Event ID is required')
    .isUUID(4).withMessage('Must be a valid event ID'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  handleValidationErrors
];

// Validate payment
exports.validatePayment = [
  body('orderId')
    .notEmpty().withMessage('Order ID is required')
    .isUUID(4).withMessage('Must be a valid order ID'),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['paypal']).withMessage('Payment method must be paypal'),
  body('paymentId')
    .notEmpty().withMessage('Payment ID is required'),
  handleValidationErrors
];
