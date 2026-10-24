const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");
const generateToken = require("../utils/jwt");

const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({
      email: email.toLowerCase(),
    });

    if (existingCustomer) {
      return res.status(400).json({
        message: "Customer with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await Customer.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken(customer._id);

    // Send response
    res.status(201).json({
      message: "Customer registered successfully",

      token,

      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find customer
    const customer = await Customer.findOne({
      email: email.toLowerCase(),
    });

    if (!customer) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      customer.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(customer._id);

    // Send response
    res.status(200).json({
      message: "Login successful",

      token,

      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId).select(
      "-password"
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getProfile,
};