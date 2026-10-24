const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Customer routes
app.use("/api/customers", customerRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/forgot-password", forgotPasswordRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully! ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Shree Ladli backend is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});