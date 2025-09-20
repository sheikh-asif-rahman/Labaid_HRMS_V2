const express = require("express");
const { usershortprofile } = require("../../controllers/HomePageControllers/UserShortProfileController");

const router = express.Router();

// POST request to get short profile of a user
router.post("/usershortprofile", usershortprofile);

module.exports = router;
