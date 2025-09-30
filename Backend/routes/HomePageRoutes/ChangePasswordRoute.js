const express = require("express");
const router = express.Router();
const { changePassword } = require("../../controllers/HomePageControllers/ChangePasswordController");

router.post("/changepassword", changePassword);

module.exports = router;
