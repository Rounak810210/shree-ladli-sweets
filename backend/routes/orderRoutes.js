const express = require("express");

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderAnalytics,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const ownerOnly = (req, res, next) => {
  if (req.adminRole !== "owner") {
    return res.status(403).json({
      message: "Only the owner can view analytics",
    });
  }

  next();
};
// Create a new order
router.post("/", authMiddleware, createOrder);

// Get only the logged-in customer's orders
router.get("/my-orders", authMiddleware, getMyOrders);

// Get all orders for admin
router.get("/admin/all", adminAuthMiddleware, getAllOrders);

router.patch(
  "/admin/:orderId/status",
  adminAuthMiddleware,
  updateOrderStatus
);
// Get a specific order

router.get(
  "/admin/analytics",
  adminAuthMiddleware,
  ownerOnly,
  getOrderAnalytics
);
router.get("/:orderId", authMiddleware, getOrderById);



module.exports = router;