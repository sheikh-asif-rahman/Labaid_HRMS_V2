const express = require("express");
const router = express.Router();
const { searchEmployee } = require("../../controllers/EmployeeProfileController/EmployeeSearchController");

// POST API
router.post("/employeesearch", searchEmployee);

module.exports = router;
