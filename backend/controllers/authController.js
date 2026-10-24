const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Customer = require("../models/Customer");
const Admin = require("../models/Admin");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // =====================================
    // 1. CHECK ADMIN
    // =====================================

    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (admin) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        admin.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          adminId: admin._id,
          role: admin.role,
          accountType: "admin",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        message: "Admin login successful",
        accountType: "admin",
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    // =====================================
    // 2. CHECK CUSTOMER
    // =====================================

    const customer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (customer) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        customer.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          customerId: customer._id,
          accountType: "customer",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        message: "Customer login successful",
        accountType: "customer",
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
      });
    }

    // =====================================
    // 3. ACCOUNT NOT FOUND
    // =====================================

    return res.status(401).json({
      message: "Invalid email or password",
    });

  } catch (error) {
    console.error("Unified login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  login,
};