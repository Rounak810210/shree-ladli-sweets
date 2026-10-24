const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    id: {
  type: String,
  required: true,
},

    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Completed"],
      default: "Pending",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "UPI Payment"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Verification Required", "Paid"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);