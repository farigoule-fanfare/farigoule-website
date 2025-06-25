const router = require('express').Router();
const ctrl   = require('../controllers/contratsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET all contrats
router.get('/', [protect, authorize(['admin'])], ctrl.getAllContrats);

// POST a new contrat: /admin/contrats
router.post('/', [protect, authorize(['admin'])], ctrl.addContrat);

// PUT update a contrat by ID: /admin/contrats/:id
router.put('/:id', [protect, authorize(['admin'])], ctrl.updateContrat);

// DELETE a contrat by ID: /admin/contrats/:id
router.delete('/:id', [protect, authorize(['admin'])], ctrl.deleteContrat);

module.exports = router;
