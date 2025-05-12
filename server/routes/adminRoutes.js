const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'public/uploads/fanfarons' });
const ctrl   = require('../controllers/adminController');
const router = express.Router();

router.get('/',        ctrl.getAll);
router.post('/',       upload.single('photoFanfaron'), ctrl.create);
router.put('/:id',     upload.single('photoFanfaron'), ctrl.update);
router.delete('/:id',                    ctrl.remove);

module.exports = router;
