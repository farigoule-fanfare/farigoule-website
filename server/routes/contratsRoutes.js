const router = require('express').Router();
const ctrl   = require('../controllers/contratsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/upcoming', ctrl.getUpcomingContratsApi); // upcoming contrats
router.get('/past',     ctrl.getPastContratsApi);     // past contrats

// Private routes
router.get('/',       [protect, authorize(['admin'])], ctrl.getAllContrats); // get all contrats
router.post('/',      [protect, authorize(['admin'])], ctrl.addContrat);
router.put('/:id',    [protect, authorize(['admin'])], ctrl.updateContrat);
router.delete('/:id', [protect, authorize(['admin'])], ctrl.deleteContrat);

module.exports = router;
