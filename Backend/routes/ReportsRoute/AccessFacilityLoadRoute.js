const express = require("express");
const router = express.Router();
const { getAccessFacility } = require("../../controllers/ReportsController/AccessFacilityLoadController");

router.post("/accessfacility", getAccessFacility);

module.exports = router;
