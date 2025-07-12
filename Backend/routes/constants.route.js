const express = require("express");
const { getUnits, getWidgets } = require("../controllers/constants.controller");
const router = express.Router();

router.route("/units")
    .get(getUnits);
router.route("/widgets")
    .get(getWidgets);

module.exports = router;