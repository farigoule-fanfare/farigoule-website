const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// POST /route/auth/login
router.post('/login', authController.handleLogin);

// POST /route/auth/logout
// Protected: only an authenticated user should be able to log out their own session.
router.post('/logout', protect, authController.handleLogout);

// GET /route/auth/status 
// Protected: to check if the current user (based on cookie) is authenticated.
router.get('/status', protect, authController.handleCheckAuthStatus);

// No public registration route as per requirements.
// If admin-triggered fanfaron creation is needed later,
// it would be a separate, admin-protected route, likely not in authRoutes.

module.exports = router; 