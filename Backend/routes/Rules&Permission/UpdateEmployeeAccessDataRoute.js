const express = require("express");
const router = express.Router();
const { updateEmployeeAccessData } = require("../../controllers/Rules&Permission/UpdateEmployeeAccessDataController");

// POST route for updating employee access
router.post("/updateEmployeeAccessData", updateEmployeeAccessData);

module.exports = router;
