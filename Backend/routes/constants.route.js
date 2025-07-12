const express = require("express");
const constants = require("../controllers/constants.controller");
const router = express.Router();

router.get('/skills', constants.getAllSkills);

module.exports = router;