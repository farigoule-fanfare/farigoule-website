const express = require("express");
const controllers = require("../controllers/controllers");
const citationControllers = require("../controllers/citationsController");
const diaposControllers = require("../controllers/diaposController");
const contratsControllers = require("../controllers/contratsController");

const router = express.Router();

// Public routes
router.get('/diapos', diaposControllers.getAllDiaposApi);           // Route for all diapos
router.get('/diapos/latest', diaposControllers.getLatestDiaposApi);       // Route for latest diapos
router.get('/diapos/random', diaposControllers.getRandomDiapoApi); // Route for random diapo
router.get('/contrats/upcoming', contratsControllers.getUpcomingContratsApi); // Route for upcoming contrats
router.get('/contrats/past', contratsControllers.getPastContratsApi);       // Route for past contrats
router.get("/citations", citationControllers.getCitationsApi); // Route for all citations
router.get("/citations/ordered", citationControllers.getAllCitationsOrdered); // Route for all citations
router.get('/fanfarons', controllers.getAllFanfaronsApi); // Route for all fanfarons

module.exports = router;