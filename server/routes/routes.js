const express = require("express");
const controllers = require("../controllers/controllers");

const router = express.Router();

router.get("/test", controllers.test);

// New route for citations
router.get("/api/citations", controllers.getCitationsApi);

// Public routes
router.get('/api/diapos', controllers.getAllDiaposApi);           // Route for all diapos
router.get('/api/diapos/latest', controllers.getLatestDiaposApi);       // Route for latest diapos
router.get('/api/diapos/random', controllers.getRandomDiapoApi); // Route for random diapo
router.get('/api/contrats/upcoming', controllers.getUpcomingContratsApi); // Route for upcoming contrats
router.get('/api/contrats/past', controllers.getPastContratsApi);       // Route for past contrats
router.get('/api/fanfarons', controllers.getAllFanfaronsApi); // Route for all fanfarons


// Example protected route structure (add actual protected routes later)
// const { protect, authorize } = require('../middleware/authMiddleware');
// router.get('/api/protected-data', protect, controllers.getSomeProtectedData);
// router.post('/api/admin/action', protect, authorize(['admin']), controllers.doAdminAction);

module.exports = router;