
const multer  = require('multer');
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

// routes/api/fanfarons.js
const router = require('express').Router();
const ctrl   = require('../controllers/fanfaronsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', ctrl.listFanfarons); // Route for all fanfarons

// Private routes
router.get('/annuaire',                               [protect, authorize(['admin'])], ctrl.getAllFanfaronsAnnuaire);
router.post('/',      upload.single('photoFanfaron'), [protect, authorize(['admin'])], ctrl.createFanfaron);
router.put('/:id',    upload.single('photoFanfaron'), [protect, authorize(['admin'])], ctrl.updateFanfaron);
router.delete('/:id',                                 [protect, authorize(['admin'])], ctrl.removeFanfaron);
module.exports = router;
