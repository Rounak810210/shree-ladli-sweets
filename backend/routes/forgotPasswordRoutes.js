const express = require("express");

const router = express.Router();

const {
  sendResetOTP,
  resetPassword,
} = require("../controllers/forgotPasswordController");

router.post("/send-otp", sendResetOTP);

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;