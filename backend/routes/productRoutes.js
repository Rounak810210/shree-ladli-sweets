const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// ==========================================
// OWNER ONLY MIDDLEWARE
// ==========================================
const ownerOnly = (req, res, next) => {
  if (req.adminRole !== "owner") {
    return res.status(403).json({
      message: "Only the owner can manage products",
    });
  }

  next();
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================
router.get("/", getProducts);

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
router.get("/:id", getProductById);

// ==========================================
// ADD PRODUCT - OWNER ONLY
// ==========================================
router.post(
  "/",
  adminAuthMiddleware,
  ownerOnly,
  createProduct
);

// ==========================================
// UPDATE PRODUCT - OWNER ONLY
// ==========================================
router.patch(
  "/:id",
  adminAuthMiddleware,
  ownerOnly,
  updateProduct
);

// ==========================================
// DELETE PRODUCT - OWNER ONLY
// ==========================================
router.delete(
  "/:id",
  adminAuthMiddleware,
  ownerOnly,
  deleteProduct
);

module.exports = router;