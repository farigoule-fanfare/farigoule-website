const router = require('express').Router();
const ctrl   = require('../../controllers/admin/contratsController');

// GET all contrats
router.get('/',     ctrl.getAllContrats);

// GET upcoming contrats: /admin/contrats/upcoming
router.get('/upcoming', ctrl.getUpcomingContrats);

// GET past contrats 
router.get('/past',     ctrl.getPastContrats);

// POST a new contrat: /admin/contrats
router.post('/',         ctrl.addContrat);

// PUT update a contrat by ID: /admin/contrats/:id
router.put('/:id',       ctrl.updateContrat);

// DELETE a contrat by ID: /admin/contrats/:id
router.delete('/:id',    ctrl.deleteContrat);

module.exports = router;
