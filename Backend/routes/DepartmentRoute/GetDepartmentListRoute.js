const express = require("express");
const { getDepartmentList } = require("../../controllers/DepartmentController/GetDepartmentListController");
const router = express.Router();

// Make sure the path matches exactly
router.get("/getDepartmentList", getDepartmentList);

module.exports = router;
