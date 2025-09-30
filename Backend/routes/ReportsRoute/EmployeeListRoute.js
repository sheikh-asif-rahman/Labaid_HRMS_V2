const express = require("express");
const router = express.Router();
const { getEmployeeList } = require("../../controllers/ReportsController/EmployeeListController");

// POST API
router.post("/employeelist", getEmployeeList);

module.exports = router;
