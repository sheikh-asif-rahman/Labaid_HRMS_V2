const express = require("express");
const router = express.Router();
const { updateEmployee } = require("../../controllers/EmployeeProfileController/EmployeeUpdateController");

router.put("/employeeupdate", updateEmployee);

module.exports = router;
