// server/routes/admin/admin.js
const express = require('express');
const router = express.Router();
const adminCtrl = require('../../controllers/admin/adminController');
// (Optionally) add an `isAdmin` middleware here

router.get('/fanfarons',       adminCtrl.listUsers);
router.post('/fanfarons/:id/setPassword',  adminCtrl.setPassword);
router.post('/fanfarons/:id/addAdminRole',    adminCtrl.addAdminRole);
router.post('/fanfarons/:id/removeAdminRole', adminCtrl.removeAdminRole);

module.exports = router;
