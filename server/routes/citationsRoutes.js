const router = require('express').Router();
const ctrl   = require('../controllers/citationsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get("/", ctrl.listCitations); // Route for all citations

// Private routes
router.get('/ordered', [protect, authorize(['admin'])], (req, res, next) => { req.query.order = 'alpha'; ctrl.listCitations(req, res, next); });
router.post('/',       [protect, authorize(['admin'])], ctrl.addCitation);
router.put('/:id',     [protect, authorize(['admin'])], ctrl.updateCitation);
router.delete('/:id',  [protect, authorize(['admin'])], ctrl.deleteCitation);

module.exports = router;
