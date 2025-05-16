
const multer  = require('multer');
const upload = multer({ dest: 'public/uploads/fanfarons' });

// routes/admin/fanfarons.js
const router = require('express').Router();
const ctrl   = require('../../controllers/admin/fanfaronsController');

router.get('/',        ctrl.getAllFanfarons);
router.post('/',       upload.single('photoFanfaron'), ctrl.createFanfaron);
router.put('/:id',     upload.single('photoFanfaron'), ctrl.updateFanfaron);
router.delete('/:id',                    ctrl.removeFanfaron);
module.exports = router;
