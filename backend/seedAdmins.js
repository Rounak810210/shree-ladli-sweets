const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const Admin = require("./models/Admin");

const admins = [
  {
    name: "Owner",
    email: "owner@shreeladli.com",
    password: "owner123",
    role: "owner",
  },
  {
    name: "Sweets Admin",
    email: "sweets@shreeladli.com",
    password: "sweets123",
    role: "sweets",
  },
  {
    name: "Fast Food Admin",
    email: "fastfood@shreeladli.com",
    password: "fastfood123",
    role: "fastfood",
  },
  {
    name: "Snacks Admin",
    email: "snacks@shreeladli.com",
    password: "snacks123",
    role: "snacks",
  },
  {
    name: "Beverages Admin",
    email: "beverages@shreeladli.com",
    password: "beverages123",
    role: "beverages",
  },
];

const seedAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for admin setup ✅");

    for (const adminData of admins) {
      const existingAdmin = await Admin.findOne({
        email: adminData.email,
      });

      if (existingAdmin) {
        console.log(`Already exists: ${adminData.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(
        adminData.password,
        10
      );

      await Admin.create({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
      });

      console.log(`Created: ${adminData.email}`);
    }

    console.log("Admin setup completed ✅");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Admin setup failed ❌");
    console.error(error.message);
  }
};

seedAdmins();