const express = require("express");
const controllers = require("../controllers/controllers");

const router = express.Router();

router.get("/test", controllers.test);

// New route for citations
router.get("/api/citations", controllers.getCitationsApi);

module.exports = router;