const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, authorize } = require('../middleware/authMiddleware');

// Mounted at /route/users
// router.post('/register', protect, authorize(['admin']), userController.registerFanfaronApi); // Admin only
// router.put('/update-password/:id', protect, authorize(['admin']), userController.updateFanfaronPasswordApi); // Admin only

// New public route for current president
router.get('/current-president', userController.getCurrentPresidentApi);

module.exports = router; 