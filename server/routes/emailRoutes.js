const express = require('express');
const router  = express.Router();
const ctrl = require('../controllers/emailController');

// Public routes
router.post('/', ctrl.handleContact);

module.exports = router;