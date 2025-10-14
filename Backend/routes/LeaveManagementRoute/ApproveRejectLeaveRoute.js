const express = require("express");
const router = express.Router();
const { updateApproveRejectLeave } = require("../../controllers/LeaveManagementController/ApproveRejectLeaveController");

// ✅ POST /api/approve-reject-leave
router.post("/approve-reject-leave", updateApproveRejectLeave);

module.exports = router;
