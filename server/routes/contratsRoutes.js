const router = require('express').Router();
const ctrl   = require('../controllers/contratsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
// Alias rétro-compatibles (optionnel mais pratique)
router.get('/upcoming', (req, res, next) => {req.query.scope = 'upcoming';ctrl.listContrats(req, res, next);});
router.get('/past', (req, res, next) => {req.query.scope = 'past';ctrl.listContrats(req, res, next);});

// Private routes
router.get('/',       [protect, authorize(['admin'])], ctrl.listContrats); // get all contrats
router.post('/',      [protect, authorize(['admin'])], ctrl.addContrat);
router.patch('/:id',  [protect, authorize(['admin'])], ctrl.updateContrat);
router.delete('/:id', [protect, authorize(['admin'])], ctrl.deleteContrat);

module.exports = router;
