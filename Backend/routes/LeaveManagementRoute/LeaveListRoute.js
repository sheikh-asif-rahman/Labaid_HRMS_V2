const express = require("express");
const router = express.Router();
const { getLeaveApproveRejectData } = require("../../controllers/LeaveManagementController/LeaveListController");

// ✅ POST /api/leave-approve-reject
router.post("/leave-approve-reject", getLeaveApproveRejectData);

module.exports = router;
