const multer  = require('multer');
// Store carousel images in the dedicated folder
const upload = multer({ dest: 'public/uploads/carousel' });

const router = require('express').Router();
const ctrl   = require('../../controllers/admin/diaposController');

// GET latest diapos: /admin/diapos/latest?limit=5
router.get('/latest', ctrl.getLatestDiapos);

// GET all diapos: /admin/diapos
router.get('/',        ctrl.getAllDiapos);

// POST a new diapo: /admin/diapos (file upload required)
router.post('/',       upload.single('fichier'), ctrl.addDiapo);

// PUT update a diapo by ID: /admin/diapos/:id (file upload optional)
router.put('/:id',     upload.single('fichier'), ctrl.updateDiapo);

// DELETE a diapo by ID: /admin/diapos/:id
router.delete('/:id',  ctrl.deleteDiapo);

module.exports = router;
