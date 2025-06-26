const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/current-president', ctrl.getCurrentPresident);

// Protected routes (authenticated users)
router.put('/profile', protect, ctrl.updateProfile);

// Private routes(admin only)
router.post('/:id/addAdminRole', [protect, authorize(['admin'])], ctrl.addAdminRole);
router.post('/:id/removeAdminRole', [protect, authorize(['admin'])], ctrl.removeAdminRole);

module.exports = router; 