const express = require("express");
const router = express.Router();
const { getAttendanceReport } = require("../../controllers/ReportsController/AttendanceReportController");

// POST API
router.post("/attendancereport", getAttendanceReport);

module.exports = router;
