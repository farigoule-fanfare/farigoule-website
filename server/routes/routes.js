const express = require("express");
const controllers = require("../controllers/controllers");

const router = express.Router();

router.get("/test", controllers.test);


module.exports = router;