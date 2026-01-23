const express = require('express');
const ctrl = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', ctrl.handleLogin);

// Private routes
router.post('/logout', protect, ctrl.handleLogout);
router.get('/status', protect, ctrl.handleCheckAuthStatus);
router.patch('/change-password', protect, ctrl.changePassword);
router.post('/admin-set-password', [protect, authorize(['admin'])], ctrl.adminSetPassword);


module.exports = router; 