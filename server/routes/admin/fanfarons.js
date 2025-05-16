
const multer  = require('multer');
const upload = multer({ dest: 'public/uploads/fanfarons' });

// routes/admin/fanfarons.js
const router = require('express').Router();
const ctrl   = require('../../controllers/admin/fanfaronsController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// ⚠️-protège toutes les routes ci-dessous
router.use(protect, authorize(['admin']));

router.get('/',        ctrl.getAllFanfarons);
router.post('/',       upload.single('photoFanfaron'), ctrl.createFanfaron);
router.put('/:id',     upload.single('photoFanfaron'), ctrl.updateFanfaron);
router.delete('/:id',                    ctrl.removeFanfaron);
module.exports = router;
