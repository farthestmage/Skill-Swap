const express = require("express");
const { getTemplatesList, getTemplates, addTemplates } = require("../controllers/templates.controller");
const router = express.Router();

router.route("/")
    .get(getTemplates)
    .post(addTemplates);

router.route("/all")
    .get(getTemplatesList);

module.exports = router;