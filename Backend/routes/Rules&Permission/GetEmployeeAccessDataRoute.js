const express = require("express");
const router = express.Router();
const { getEmployeeAccessData } = require("../../controllers/Rules&Permission/GetEmployeeAccessDataController");

// API: GET /api/getEmployeeAccessData?employeeId=21275
router.get("/getEmployeeAccessData", getEmployeeAccessData);

module.exports = router;
