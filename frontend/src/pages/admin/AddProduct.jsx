import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add product
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      alert("Admin authentication required.");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/products",
      {
        method: "POST",
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
      alert(data.message || "Unable to add product.");
      return;
    }

    alert("Product added successfully! 🎉");

    navigate("/admin/products");

  } catch (error) {
    console.error("Error adding product:", error);
    alert("Unable to connect to server.");
  }
};
  return (
    <div className="min-h-screen bg-[#fff8ef] px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <p className="text-sm tracking-[0.3em] text-orange-600 font-semibold">
            ADMIN PANEL
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Add Product
          </h1>

          <p className="text-gray-600 mt-2">
            Add a new product to your Shree Ladli menu.
          </p>
        </div>

        {/* ================= FORM ================= */}

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
              <option value="Sweets">Sweets</option>
              <option value="Snacks">Snacks</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Chaat">Chaat</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>

          {/* Price */}

          <div className="mb-6">
            <label className="block font-semibold text-gray-800 mb-2">
              Price
            </label>

            <input
              type="number"
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
              <option value="5">★★★★★ - 5</option>
              <option value="4">★★★★ - 4</option>
              <option value="3">★★★ - 3</option>
              <option value="2">★★ - 2</option>
              <option value="1">★ - 1</option>
            </select>
          </div>

          {/* ================= AVAILABILITY ================= */}

          <div className="mb-6">
            <label className="block font-semibold text-gray-800 mb-2">
              Product Availability
            </label>

            <select
              value={formData.available ? "available" : "out"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  available: e.target.value === "available",
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

            {/* Cancel */}

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            {/* Add Product */}

            <button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Add Product
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddProduct;