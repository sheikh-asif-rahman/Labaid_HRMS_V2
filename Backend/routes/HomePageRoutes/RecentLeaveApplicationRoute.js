const express = require("express");
const { recentleaveapplication } = require("../../controllers/HomePageControllers/RecentLeaveApplicationController");

const router = express.Router();

// POST request to get recent leave applications by EmployeeId
router.post("/recentleaveapplication", recentleaveapplication);

module.exports = router;
