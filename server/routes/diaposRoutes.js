const multer  = require('multer');
// Store carousel images in the dedicated folder
//const upload = multer({ dest: 'public/uploads/carousel' });
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
    console.log(file)
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

// ⚠️-protège toutes les routes ci-dessous
router.use(protect, authorize(['admin']));

// POST a new diapo: /admin/diapos (file upload required)
router.post('/',       upload.single('file'), ctrl.addDiapo);

// PUT update a diapo by ID: /admin/diapos/:id (file upload optional)
router.put('/:id',     upload.single('file'), ctrl.updateDiapo);

// DELETE a diapo by ID: /admin/diapos/:id
router.delete('/:id',  ctrl.deleteDiapo);

module.exports = router;
