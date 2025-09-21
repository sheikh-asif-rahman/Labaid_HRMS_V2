const express = require("express");
const router = express.Router();
const { getAllFacility } = require("../controllers/GetAllFacilityController");

// GET /api/facilities
router.get("/facilities", getAllFacility);

module.exports = router;
