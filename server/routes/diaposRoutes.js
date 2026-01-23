const multer  = require('multer');
const path = require('path');

// Stockage dans le dossier carousel
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/carousel'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, name);
  }
});

// Filtrer les fichiers vides
const fileFilter = (req, file, cb) => {
  // Rejeter si aucun fichier n'est sélectionné (0 byte, ou mimetype vide)
  if (!file.originalname) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });
const router = require('express').Router();
const ctrl   = require('../controllers/diaposController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', (req, res, next) => {
  if (req.query.order === undefined) req.query.order = 'random';
  if (req.query.limit === undefined) req.query.limit = '5';
  ctrl.listDiapos(req, res, next);});

// Private routes
router.get('/ordered',
  [protect, authorize(['admin'])],
  (req, res, next) => {
    req.query.order = 'desc';
    req.query.all   = 'true';
    ctrl.listDiapos(req, res, next);
  });
router.post('/',       upload.single('file'), [protect, authorize(['admin'])], ctrl.addDiapo);
router.patch('/:id',   upload.single('file'), [protect, authorize(['admin'])], ctrl.updateDiapo);
router.delete('/:id',                         [protect, authorize(['admin'])], ctrl.deleteDiapo);

module.exports = router;
