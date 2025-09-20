const express = require("express");
const { todaysattendance } = require("../../controllers/HomePageControllers/TodaysAttendanceController");

const router = express.Router();

// POST request to get punch status for the current month
router.post("/todaysattendance", todaysattendance);

module.exports = router;
