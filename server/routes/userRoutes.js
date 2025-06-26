const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/current-president', ctrl.getCurrentPresidentApi);

// Protected routes (authenticated users)
router.put('/profile', protect, ctrl.updateProfileApi);
router.put('/change-password', protect, ctrl.changePasswordApi);

// Private routes(admin only)
router.post('/:id/setPassword', [protect, authorize(['admin'])],  ctrl.setPassword);
router.post('/:id/addAdminRole', [protect, authorize(['admin'])], ctrl.addAdminRole);
router.post('/:id/removeAdminRole', [protect, authorize(['admin'])], ctrl.removeAdminRole);

module.exports = router; 