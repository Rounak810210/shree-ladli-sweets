const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Customer = require("./models/Customer");

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected ✅");

    const email = "rounakkeshri919@gmail.com";

    const newPassword = "8102109848";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const customer = await Customer.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { password: hashedPassword },
      { new: true }
    );

    if (!customer) {
      console.log("Customer not found ❌");
      return;
    }

    console.log("Customer password reset successfully! ✅");
    console.log("Email:", customer.email);

  } catch (error) {
    console.error("Password reset error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

resetPassword();