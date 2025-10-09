const express = require("express");
const router = express.Router();
const { getLeaveHistory } = require("../../controllers/LeaveManagementController/LeaveHistoryDataController");

// POST /api/leave-history
router.post("/leave-history-data", getLeaveHistory);

module.exports = router;
