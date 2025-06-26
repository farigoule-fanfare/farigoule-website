const router = require('express').Router();
const ctrl   = require('../controllers/citationsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get("/", ctrl.getCitationsApi); // Route for all citations

// Private routes
router.get("/ordered", [protect, authorize(['admin'])], ctrl.getAllCitationsOrdered); // all citations ordered alphabetically
router.post('/',       [protect, authorize(['admin'])], ctrl.addCitation);
router.put('/:id',     [protect, authorize(['admin'])], ctrl.updateCitation);
router.delete('/:id',  [protect, authorize(['admin'])], ctrl.deleteCitation);

module.exports = router;
