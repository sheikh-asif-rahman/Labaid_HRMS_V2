const express = require("express");
const router = express.Router();
const { updateDepartmentList } = require("../../controllers/DepartmentController/UpdateDepartmentListController");

// Full URL: /api/updateDepartmentList
router.post("/updateDepartmentList", updateDepartmentList);

module.exports = router;
