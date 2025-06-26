const express = require('express');
const ctrl = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', ctrl.handleLogin);

// Private routes
router.post('/logout', protect, ctrl.handleLogout);
router.get('/status', protect, ctrl.handleCheckAuthStatus);
router.put('/change-password', protect, ctrl.changePassword);
router.post('/:id/setPassword', [protect, authorize(['admin'])],  ctrl.setPassword);

module.exports = router; 