
const multer  = require('multer');
//const upload = multer({ dest: 'public/uploads/fanfarons' });
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/fanfarons'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname) return cb(null, false);
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// routes/admin/fanfarons.js
const router = require('express').Router();
const ctrl   = require('../../controllers/fanfaronsController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// ⚠️-protège toutes les routes ci-dessous
router.use(protect, authorize(['admin']));

router.get('/',         ctrl.getAllFanfaronsAnnuaire);
router.post('/',       upload.single('photoFanfaron'), ctrl.createFanfaron);
router.put('/:id',     upload.single('photoFanfaron'), ctrl.updateFanfaron);
router.delete('/:id',                    ctrl.removeFanfaron);
module.exports = router;
