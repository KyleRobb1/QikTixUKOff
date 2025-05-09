const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// --- Authentication Routes ---

// GET Signup page
router.get('/signup', authController.getSignup);

// POST Signup form
router.post('/signup', authController.postSignup);

// GET Login page
router.get('/login', authController.getLogin);

// POST Login form
router.post('/login', authController.postLogin);

// POST Logout
router.post('/logout', authController.postLogout);

// --- Maybe add routes for password reset later ---

module.exports = router; 