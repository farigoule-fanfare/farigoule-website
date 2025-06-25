// server/routes/admin/admin.js
const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:id/setPassword', [protect, authorize(['admin'])],  adminCtrl.setPassword);
router.post('/:id/addAdminRole', [protect, authorize(['admin'])], adminCtrl.addAdminRole);
router.post('/:id/removeAdminRole', [protect, authorize(['admin'])], adminCtrl.removeAdminRole);

module.exports = router;
    