const express = require("express");
const { userSignup, userLogin, refreshToken, userLogout } = require("../controllers/auth.controller");
const router = express.Router();

router.route("/signup")
    .post(userSignup);
router.route("/login")
    .post(userLogin);
router.route("/refresh")
    .post(refreshToken);
router.route("/logout")
    .post(userLogout);

module.exports = router;