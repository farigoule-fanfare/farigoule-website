const router = require('express').Router();
const ctrl   = require('../controllers/citationsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST a new citation: /admin/citations
router.post('/', [protect, authorize(['admin'])], ctrl.addCitation);

// PUT update a citation by ID: /admin/citations/:id
router.put('/:id', [protect, authorize(['admin'])], ctrl.updateCitation);

// DELETE a citation by ID: /admin/citations/:id
router.delete('/:id', [protect, authorize(['admin'])], ctrl.deleteCitation);

module.exports = router;
