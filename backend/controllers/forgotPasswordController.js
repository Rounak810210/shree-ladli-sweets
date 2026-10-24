const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");
const sendEmail = require("../utils/sendEmail");

const sendResetOTP = async (req, res) => {
  try {
    console.log("Forgot password request received");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email address is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const customer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (!customer) {
      return res.status(404).json({
        message: "No customer account found with this email",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    customer.resetOTP = otp;
    customer.resetOTPExpires = otpExpires;

    await customer.save();

    console.log("OTP generated");
    console.log("Trying to send email to:", customer.email);

    await sendEmail(
      customer.email,
      "Shree Ladli - Password Reset OTP",
      `Hello ${customer.name},

Your Shree Ladli password reset OTP is:

${otp}

This OTP is valid for 5 minutes.

If you did not request a password reset, please ignore this email.

Regards,
Shree Ladli Sweets & Snacks`
    );

    console.log("Email sent successfully ✅");

    res.status(200).json({
      message: "OTP sent successfully to your email",
    });

  } catch (error) {
    console.error("Send reset OTP error:", error);

    res.status(500).json({
      message: "Unable to send OTP. Please try again.",
    });
  }
};


const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const customer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer account not found",
      });
    }

    if (!customer.resetOTP || !customer.resetOTPExpires) {
      return res.status(400).json({
        message: "No password reset request found",
      });
    }

    if (customer.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (new Date() > customer.resetOTPExpires) {
      customer.resetOTP = null;
      customer.resetOTPExpires = null;

      await customer.save();

      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    customer.password = hashedPassword;

    // Clear OTP after successful password reset
    customer.resetOTP = null;
    customer.resetOTPExpires = null;

    await customer.save();

    res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Unable to reset password",
    });
  }
};


module.exports = {
  sendResetOTP,
  resetPassword,
};