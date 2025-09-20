const express = require("express");
const router = express.Router();
const { overview } = require("../controllers/OverViewController");

router.get("/overview", overview);

module.exports = router;
