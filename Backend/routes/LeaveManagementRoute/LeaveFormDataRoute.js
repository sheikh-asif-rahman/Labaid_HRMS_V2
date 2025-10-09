const express = require("express");
const router = express.Router();
const { getLeaveFormData } = require("../../controllers/LeaveManagementController/LeaveFormDataController");

// ✅ POST /api/leave-form-data
router.post("/leave-form-data", getLeaveFormData);

module.exports = router;
