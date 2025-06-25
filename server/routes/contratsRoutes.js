const router = require('express').Router();
const ctrl   = require('../controllers/contratsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ⚠️-protège toutes les routes ci-dessous
router.use(protect, authorize(['admin']));

// GET all contrats
router.get('/',     ctrl.getAllContrats);

// POST a new contrat: /admin/contrats
router.post('/',         ctrl.addContrat);

// PUT update a contrat by ID: /admin/contrats/:id
router.put('/:id',       ctrl.updateContrat);

// DELETE a contrat by ID: /admin/contrats/:id
router.delete('/:id',    ctrl.deleteContrat);

module.exports = router;
