const express = require("express");
const router = express.Router();
const { saveLeaveApplication } = require("../../controllers/LeaveManagementController/LeaveApplicationSaveController");

// POST /api/leave-application
router.post("/save-leave-application", saveLeaveApplication);

module.exports = router;
