
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const sendEmail = require("../utils/sendEmail");

// ============================================================
// CREATE ORDER
// ============================================================
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      paymentStatus,
    } = req.body;

    if (
      !customer ||
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode
    ) {
      return res.status(400).json({
        message: "Complete customer details are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    const orderId = `SL${Date.now()}`;

    const order = await Order.create({
      orderId,
      customerId: req.customerId,
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        pincode: customer.pincode,
      },
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        unit: item.unit,
        quantity: item.quantity,
        image: item.image,
        status: "Pending",
      })),
      subtotal: Number(subtotal) || 0,
      deliveryCharge: Number(deliveryCharge) || 0,
      total: Number(total) || 0,
      paymentMethod,
      paymentStatus:
        paymentStatus ||
        (paymentMethod === "UPI Payment"
          ? "Verification Required"
          : "Pending"),
      status: "Pending",
    });

    // Send order confirmation email
    try {
      const customerAccount = await Customer.findById(
        req.customerId
      );

      if (customerAccount?.email) {
        const itemsList = order.items
          .map(
            (item) =>
              `${item.name} x ${item.quantity} = ₹${
                item.price * item.quantity
              }`
          )
          .join("\n");

        const emailText = `
Hello ${order.customer.name},

Thank you for ordering from Shree Ladli Sweets & Snacks!

Your order has been placed successfully.

Order ID: ${order.orderId}

Items:
${itemsList}

Subtotal: ₹${order.subtotal}
Delivery Charge: ₹${order.deliveryCharge}
Total Amount: ₹${order.total}

Payment Method: ${order.paymentMethod}
Payment Status: ${order.paymentStatus}
Order Status: ${order.status}

Delivery Address:
${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}

We will keep you updated about your order.

Thank you,
Shree Ladli Sweets & Snacks
`;

        await sendEmail(
          customerAccount.email,
          `Order Confirmation - ${order.orderId}`,
          emailText
        );
      }
    } catch (emailError) {
      console.error(
        "Order confirmation email failed:",
        emailError.message
      );
    }

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ============================================================
// GET LOGGED-IN CUSTOMER ORDERS
// ============================================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.customerId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ============================================================
// GET SINGLE CUSTOMER ORDER
// ============================================================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      customerId: req.customerId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ============================================================
// GET ALL ORDERS
// ============================================================
const getAllOrders = async (req, res) => {
  try {
    const adminRole = req.adminRole;

    const roleToCategory = {
      sweets: "Sweets",
      fastfood: "Fast Food",
      snacks: "Snacks",
      beverages: "Beverages",
    };

    let orders;

    if (adminRole === "owner") {
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      const allowedCategory = roleToCategory[adminRole];

      if (!allowedCategory) {
        return res.status(403).json({
          message: "Admin role is not authorized",
        });
      }

      const matchingOrders = await Order.find({
        "items.category": allowedCategory,
      }).sort({ createdAt: -1 });

      orders = matchingOrders.map((order) => {
        const orderObject = order.toObject();

        orderObject.items = orderObject.items
          .map((item, originalIndex) => ({
            ...item,
            originalIndex,
          }))
          .filter(
            (item) => item.category === allowedCategory
          );

        return orderObject;
      });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ============================================================
// GET SINGLE ORDER FOR ADMIN
// ============================================================
const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const roleToCategory = {
      sweets: "Sweets",
      fastfood: "Fast Food",
      snacks: "Snacks",
      beverages: "Beverages",
    };

    // Owner can view the complete order.
    if (req.adminRole === "owner") {
      return res.status(200).json({ order });
    }

    // Category admins can only view orders containing
    // their assigned category, and only those items.
    const allowedCategory = roleToCategory[req.adminRole];

    if (!allowedCategory) {
      return res.status(403).json({
        message: "Admin role is not authorized",
      });
    }

    const orderObject = order.toObject();

    orderObject.items = orderObject.items
      .map((item, originalIndex) => ({
        ...item,
        originalIndex,
      }))
      .filter(
        (item) => item.category === allowedCategory
      );

    if (orderObject.items.length === 0) {
      return res.status(403).json({
        message: "You are not authorized to view this order",
      });
    }

    return res.status(200).json({
      order: orderObject,
    });
  } catch (error) {
    console.error("Get admin order error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ============================================================
// UPDATE ORDER STATUS
// ============================================================
const updateOrderStatus = async (req, res) => {
  try {
    const { status, itemIndex } = req.body;
    const adminRole = req.adminRole;

    const roleToCategory = {
      sweets: "Sweets",
      fastfood: "Fast Food",
      snacks: "Snacks",
      beverages: "Beverages",
    };

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Ready",
      "Completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findOne({
      orderId: req.params.orderId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // OWNER: Update the entire order.
    if (adminRole === "owner") {
      order.status = status;

      order.items.forEach((item) => {
        item.status = status;
      });

      await order.save();

      if (
        ["Preparing", "Ready", "Completed"].includes(status)
      ) {
        try {
          const customerAccount = await Customer.findById(
            order.customerId
          );

          if (customerAccount?.email) {
            await sendEmail(
              customerAccount.email,
              `Order Update - ${order.orderId}`,
              `Hello ${order.customer.name},

Your order status has been updated.

Order ID: ${order.orderId}
Status: ${status}
Total Amount: ₹${order.total}

Thank you for ordering from Shree Ladli Sweets & Snacks!`
            );
          }
        } catch (emailError) {
          console.error(
            "Status notification email failed:",
            emailError.message
          );
        }
      }

      return res.status(200).json({
        message: "Whole order status updated successfully",
        order,
      });
    }

    // CATEGORY ADMIN: Update only an authorized item.
    const allowedCategory = roleToCategory[adminRole];

    if (!allowedCategory) {
      return res.status(403).json({
        message: "Admin role is not authorized",
      });
    }

    if (itemIndex === undefined || itemIndex === null) {
      return res.status(400).json({
        message: "Item index is required",
      });
    }

    const index = Number(itemIndex);

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= order.items.length
    ) {
      return res.status(400).json({
        message: "Invalid item index",
      });
    }

    const selectedItem = order.items[index];

    if (selectedItem.category !== allowedCategory) {
      return res.status(403).json({
        message: "You are not authorized to update this item",
      });
    }

    selectedItem.status = status;

    const itemStatuses = order.items.map(
      (item) => item.status || "Pending"
    );

    if (
      itemStatuses.every(
        (itemStatus) => itemStatus === "Completed"
      )
    ) {
      order.status = "Completed";
    } else if (
      itemStatuses.every(
        (itemStatus) =>
          itemStatus === "Ready" ||
          itemStatus === "Completed"
      )
    ) {
      order.status = "Ready";
    } else if (
      itemStatuses.some(
        (itemStatus) =>
          itemStatus === "Preparing" ||
          itemStatus === "Ready" ||
          itemStatus === "Completed"
      )
    ) {
      order.status = "Preparing";
    } else {
      order.status = "Pending";
    }

    await order.save();

    if (
      ["Preparing", "Ready", "Completed"].includes(status)
    ) {
      try {
        const customerAccount = await Customer.findById(
          order.customerId
        );

        if (customerAccount?.email) {
          await sendEmail(
            customerAccount.email,
            `Order Update - ${order.orderId}`,
            `Hello ${order.customer.name},

An item in your order has been updated.

Order ID: ${order.orderId}
Item: ${selectedItem.name}
Item Status: ${selectedItem.status}
Overall Order Status: ${order.status}
Total Amount: ₹${order.total}

Thank you for ordering from Shree Ladli Sweets & Snacks!`
          );
        }
      } catch (emailError) {
        console.error(
          "Status notification email failed:",
          emailError.message
        );
      }
    }

    return res.status(200).json({
      message: "Item status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ============================================================
// GET ORDER ANALYTICS
// ============================================================
const getOrderAnalytics = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    const preparingOrders = orders.filter(
      (order) => order.status === "Preparing"
    ).length;

    const readyOrders = orders.filter(
      (order) => order.status === "Ready"
    ).length;

    const completedOrders = orders.filter(
      (order) => order.status === "Completed"
    ).length;

    const totalRevenue = orders
      .filter((order) => order.status === "Completed")
      .reduce(
        (total, order) => total + Number(order.total || 0),
        0
      );

    const categories = [
      "Sweets",
      "Fast Food",
      "Snacks",
      "Beverages",
    ];

    const categoryAnalytics = categories.map((category) => {
      const categoryOrders = orders.filter((order) =>
        order.items?.some(
          (item) => item.category === category
        )
      );

      const categoryRevenue = orders
        .filter((order) => order.status === "Completed")
        .reduce((total, order) => {
          const categoryTotal = (order.items || [])
            .filter((item) => item.category === category)
            .reduce((itemTotal, item) => {
              const price = Number(item.price || 0);
              const quantity = Number(item.quantity || 1);

              return itemTotal + price * quantity;
            }, 0);

          return total + categoryTotal;
        }, 0);

      return {
        category,
        orders: categoryOrders.length,
        revenue: categoryRevenue,
      };
    });

    return res.status(200).json({
      analytics: {
        totalOrders,
        pendingOrders,
        preparingOrders,
        readyOrders,
        completedOrders,
        totalRevenue,
        categoryAnalytics,
      },
    });
  } catch (error) {
    console.error("Get order analytics error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ============================================================
// EXPORT CONTROLLERS
// ============================================================
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  getOrderAnalytics,
};
