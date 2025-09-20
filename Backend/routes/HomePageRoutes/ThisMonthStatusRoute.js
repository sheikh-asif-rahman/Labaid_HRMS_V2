const express = require("express");
const { thismonthstatus } = require("../../controllers/HomePageControllers/ThisMonthStatusController");

const router = express.Router();

// POST request to get punch status for the current month
router.post("/thismonthstatus", thismonthstatus);

module.exports = router;
