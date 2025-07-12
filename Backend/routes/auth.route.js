const express = require("express");
const { userSignup, verifyOTP, userLogin, refreshToken, userLogout, resendOTP } = require("../controllers/auth.controller");
const router = express.Router();

router.route("/signup")
    .post(userSignup);
router.route("/verify-otp")
    .post(verifyOTP);
router.route("/login")
    .post(userLogin);
router.route("/refresh")
    .post(refreshToken);
router.route("/logout")
    .post(userLogout);
router.route("/resend-otp")
    .post(resendOTP);

module.exports = router;