const router = require('express').Router();
const ctrl   = require('../controllers/citationsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get("/", ctrl.randomCitation);

// Private routes
router.get('/ordered', [protect, authorize(['admin'])], ctrl.listCitations);
router.post('/',       [protect, authorize(['admin'])], ctrl.addCitation);
router.put('/:id',     [protect, authorize(['admin'])], ctrl.updateCitation);
router.delete('/:id',  [protect, authorize(['admin'])], ctrl.deleteCitation);

module.exports = router;
