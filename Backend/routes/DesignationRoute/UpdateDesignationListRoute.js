const express = require("express");
const router = express.Router();
const { updateDesignationList } = require("../../controllers/DesignationController/UpdateDesignationListController");

// Full URL: /api/updateDesignationList
router.post("/updateDesignationList", updateDesignationList);

module.exports = router;
