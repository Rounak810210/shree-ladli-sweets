import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    category: "Sweets",
    price: "",
    unit: "Piece",
    description: "",
    rating: 5,
    image: "",
    available: true,
  });

  // =====================================================
  // LOAD PRODUCT FROM MONGODB
  // =====================================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
          alert("Admin authentication required.");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Unable to load product.");
          return;
        }

        const loadedProduct = data.product;

        setProduct(loadedProduct);

        setFormData({
          name: loadedProduct.name || "",
          category: loadedProduct.category || "Sweets",
          price: loadedProduct.price || "",
          unit: loadedProduct.unit || "Piece",
          description: loadedProduct.description || "",
          rating: loadedProduct.rating || 5,
          image: loadedProduct.image || "",
          available: loadedProduct.available !== false,
        });

      } catch (error) {
        console.error("Error loading product:", error);
        alert("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // =====================================================
  // HANDLE INPUT CHANGES
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8ef] flex items-center justify-center">
        <p className="text-orange-600 font-semibold">
          Loading product...
        </p>
      </div>
    );
  }
  // Update product
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!product) {
    alert("Product not found.");
    return;
  }

  try {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      alert("Admin authentication required.");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          price: Number(formData.price),
          unit: formData.unit.trim(),
          description: formData.description.trim(),
          rating: Number(formData.rating),
          image: formData.image.trim(),
          available: formData.available,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to update product.");
      return;
    }

    alert("Product updated successfully! 🎉");

    navigate("/admin/products");

  } catch (error) {
    console.error("Error updating product:", error);
    alert("Unable to connect to server.");
  }
};

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#fff8ef] flex items-center justify-center px-6">

        <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">

          <div className="text-6xl mb-5">
            🔍
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-3">
            The product you are trying to edit does not exist.
          </p>

          <button
            onClick={() =>
              navigate("/admin/products")
            }
            className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Back to Products
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8ef] px-6 py-10">

      <div className="max-w-3xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <p className="text-sm tracking-[0.3em] text-orange-600 font-semibold">
            ADMIN PANEL
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Edit Product
          </h1>

          <p className="text-gray-600 mt-2">
            Update product information for your Shree Ladli menu.
          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8"
        >

          {/* Product Name */}

          <div className="mb-6">

            <label className="block font-semibold text-gray-800 mb-2">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full px-4 py-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            />

          </div>

          {/* Category */}

          <div className="mb-6">

            <label className="block font-semibold text-gray-800 mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="Sweets">
                Sweets
              </option>

              <option value="Fast Food">
                Fast Food
              </option>

          

              <option value="Beverages">
                Beverages
              </option>

              <option value="Snacks">
                Snacks
              </option>
            </select>

          </div>

          {/* Price */}

          <div className="mb-6">

            <label className="block font-semibold text-gray-800 mb-2">
              Price
            </label>

            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Example: ₹500 / Kg"
              required
              className="w-full px-4 py-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            />

          </div>
          {/* Unit */}

<div className="mb-6">
  <label className="block font-semibold text-gray-800 mb-2">
    Unit
  </label>

  <select
    name="unit"
    value={formData.unit}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
  >
    <option value="Piece">Piece</option>
    <option value="Kg">Kg</option>
    <option value="Plate">Plate</option>
    <option value="Glass">Glass</option>
  </select>
</div>

          {/* Description */}

          <div className="mb-6">

            <label className="block font-semibold text-gray-800 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              required
              className="w-full px-4 py-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            />

          </div>

          {/* Rating */}

          <div className="mb-6">

            <label className="block font-semibold text-gray-800 mb-2">
              Rating
            </label>

            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="5">
                ★★★★★ - 5
              </option>

              <option value="4">
                ★★★★ - 4
              </option>

              <option value="3">
                ★★★ - 3
              </option>

              <option value="2">
                ★★ - 2
              </option>

              <option value="1">
                ★ - 1
              </option>
            </select>

          </div>

          {/* ================= AVAILABILITY ================= */}

          <div className="mb-6">

            <label className="block font-semibold text-gray-800 mb-2">
              Product Availability
            </label>

            <select
              value={
                formData.available
                  ? "available"
                  : "out"
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  available:
                    e.target.value === "available",
                })
              }
              className="w-full px-4 py-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="available">
                Available
              </option>

              <option value="out">
                Out of Stock
              </option>
            </select>

          </div>

          {/* Image URL */}

          <div className="mb-8">

            <label className="block font-semibold text-gray-800 mb-2">
              Product Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste image URL"
              required
              className="w-full px-4 py-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            />

          </div>

          {/* Buttons */}

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() =>
                navigate("/admin/products")
              }
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProduct;