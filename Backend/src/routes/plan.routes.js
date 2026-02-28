const express = require("express");
const router = express.Router();
const { handlePlan } = require("../controllers/plan.controller");

router.post("/", handlePlan);

module.exports = router;