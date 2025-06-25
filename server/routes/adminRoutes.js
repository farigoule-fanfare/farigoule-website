// server/routes/admin/admin.js
const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
// (Optionally) add an `isAdmin` middleware here

// ⚠️-protège toutes les routes ci-dessous
router.use(protect, authorize(['admin']));

router.post('/:id/setPassword',  adminCtrl.setPassword);
router.post('/:id/addAdminRole',    adminCtrl.addAdminRole);
router.post('/:id/removeAdminRole', adminCtrl.removeAdminRole);

module.exports = router;
    