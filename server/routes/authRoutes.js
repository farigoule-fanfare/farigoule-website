const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// Public routes
router.post('/login', authController.handleLogin);

// Private routes
router.post('/logout', protect, authController.handleLogout);
router.get('/status', protect, authController.handleCheckAuthStatus);

module.exports = router; 