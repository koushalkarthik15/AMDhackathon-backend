const express = require("express");
const router = express.Router();
const { handleRefine } = require("../controllers/refine.controller");

router.post("/", handleRefine);

module.exports = router;