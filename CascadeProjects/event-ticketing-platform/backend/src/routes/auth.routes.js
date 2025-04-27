const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout,
  getProfile, 
  updateProfile, 
  requestPasswordReset, 
  resetPassword 
} = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { 
  validateRegistration, 
  validateLogin, 
  validatePasswordReset, 
  validateResetRequest 
} = require('../middleware/validation.middleware');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/forgot-password', validateResetRequest, requestPasswordReset);
router.post('/reset-password', validatePasswordReset, resetPassword);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
