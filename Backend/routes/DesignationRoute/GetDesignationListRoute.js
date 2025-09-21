const express = require("express");
const router = express.Router();
const { getDesignationList } = require("../../controllers/DesignationController/GetDesignationListController");

router.get("/getDesignationList", getDesignationList);

module.exports = router;
