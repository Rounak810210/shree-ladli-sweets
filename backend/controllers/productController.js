const Product = require("../models/Product");

// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// CREATE PRODUCT
// ==========================================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      unit,
      image,
      rating,
      description,
      available,
    } = req.body;

    if (!name || !category || price === undefined || !unit) {
      return res.status(400).json({
        message: "Name, category, price and unit are required",
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
      unit,
      image,
      rating,
      description,
      available,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};