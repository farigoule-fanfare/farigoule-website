// server/routes/admin/admin.js
const express = require('express');
const router = express.Router();
const adminCtrl = require('../../controllers/admin/adminController');
// (Optionally) add an `isAdmin` middleware here

router.get('/',       adminCtrl.listUsers);
router.post('/:id/setPassword',  adminCtrl.setPassword);
router.post('/:id/addAdminRole',    adminCtrl.addAdminRole);
router.post('/:id/removeAdminRole', adminCtrl.removeAdminRole);

module.exports = router;
