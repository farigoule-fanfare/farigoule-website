const router = require('express').Router();
const ctrl   = require('../../controllers/admin/citationsController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// ⚠️-protège toutes les routes ci-dessous
router.use(protect, authorize(['admin']));

// POST a new citation: /admin/citations
router.post('/',       ctrl.addCitation);

// PUT update a citation by ID: /admin/citations/:id
router.put('/:id',     ctrl.updateCitation);

// DELETE a citation by ID: /admin/citations/:id
router.delete('/:id',  ctrl.deleteCitation);

module.exports = router;
