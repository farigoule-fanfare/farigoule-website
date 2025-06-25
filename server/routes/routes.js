const express = require("express");
const controllers = require("../controllers/controllers");

const router = express.Router();

// New route for citations
router.get("/citations", controllers.getCitationsApi);

// Public routes
router.get('/diapos', controllers.getAllDiaposApi);           // Route for all diapos
router.get('/diapos/latest', controllers.getLatestDiaposApi);       // Route for latest diapos
router.get('/diapos/random', controllers.getRandomDiapoApi); // Route for random diapo
router.get('/contrats/upcoming', controllers.getUpcomingContratsApi); // Route for upcoming contrats
router.get('/contrats/past', controllers.getPastContratsApi);       // Route for past contrats
router.get('/fanfarons', controllers.getAllFanfaronsApi); // Route for all fanfarons

module.exports = router;