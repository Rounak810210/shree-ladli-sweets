const express = require("express");

const router = express.Router();

const {
  registerCustomer,
  loginCustomer,
  getProfile,
} = require("../controllers/customerController");

const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", registerCustomer);

// Login
router.post("/login", loginCustomer);

// Customer profile
router.get("/profile", authMiddleware, getProfile);

module.exports = router;