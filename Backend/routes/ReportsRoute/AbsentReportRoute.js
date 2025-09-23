const express = require("express");
const router = express.Router();
const { getAbsentReport } = require("../../controllers/ReportsController/AbsentReportController");

// POST API
router.post("/absentreport", getAbsentReport);

module.exports = router;
 