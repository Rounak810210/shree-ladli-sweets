import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function AdminProducts() {
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

const loadProducts = async () => {
  try {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      alert("Admin authentication required.");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/products",
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to load products.");
      return;
    }

    setAllProducts(data.products || []);

  } catch (error) {
    console.error("Error loading products:", error);
    alert("Unable to connect to server.");
  }
};

  // Load products when page opens
  useEffect(() => {
    loadProducts();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

 const handleDelete = async (product) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${product.name}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      alert("Admin authentication required.");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/products/${product._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to delete product.");
      return;
    }

    // Remove from screen immediately
    setAllProducts((prev) =>
      prev.filter((item) => item._id !== product._id)
    );

    alert(`${product.name} deleted successfully!`);

  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Unable to connect to server.");
  }
};
  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#fff8ef] px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <p className="text-sm tracking-[0.3em] text-orange-600 font-semibold">
            ADMIN PANEL
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Products
          </h1>

          <p className="text-gray-600 mt-2">
            Manage sweets, fast food, chaat and beverages.
          </p>
        </div>

        {/* ================= SEARCH + ADD ================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 mb-6">

          <div className="flex flex-col md:flex-row gap-4 justify-between">

            {/* Search */}

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 px-4 py-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Add Product */}

            <button
              onClick={() =>
                navigate("/admin/products/add")
              }
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              + Add Product
            </button>

          </div>
        </div>

        {/* ================= PRODUCT COUNT ================= */}

        <p className="text-gray-600 mb-4">
          Showing{" "}
          <span className="font-semibold">
            {filteredProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {allProducts.length}
          </span>{" "}
          products
        </p>

        {/* ================= PRODUCTS ================= */}

        {filteredProducts.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProducts.map((product) => (

              <div
              key={product._id}
                className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden hover:shadow-lg transition"
              >

                {/* ================= IMAGE ================= */}

                <div className="h-52 bg-orange-50 flex items-center justify-center">

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="text-gray-400 text-center">

                      <div className="text-4xl mb-2">
                        🍬
                      </div>

                      No Image

                    </div>

                  )}

                </div>

                {/* ================= DETAILS ================= */}

                <div className="p-5">

                  <div className="flex justify-between items-start gap-3">

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">
                        {product.name}
                      </h2>

                      <p className="text-sm text-orange-600 mt-1">
                        {product.category}
                      </p>

                    </div>

                    <span className="text-lg font-bold text-orange-600">
                      {product.price}
                    </span>

                  </div>

                 {/* ================= RATING ================= */}

<div className="mt-3 text-yellow-500">
  {"★".repeat(
    Number(product.rating) || 0
  )}
</div>

{/* ================= AVAILABILITY ================= */}

<div className="mt-3">

  {product.available !== false ? (

    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
      ✓ Available
    </span>

  ) : (

    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
      ✕ Out of Stock
    </span>

  )}

</div>

                  {/* ================= DESCRIPTION ================= */}

                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* ================= BUTTONS ================= */}

                  <div className="flex gap-3 mt-5">

                    {/* EDIT */}

                    <button
                      onClick={() =>
                       navigate(
  `/admin/products/edit/${product._id}`
)
                      }
                      className="flex-1 border border-orange-500 text-orange-600 hover:bg-orange-50 py-2.5 rounded-lg font-semibold transition"
                    >
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDelete(product)
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* ================= NO RESULTS ================= */

          <div className="bg-white rounded-2xl border border-orange-100 p-10 text-center">

            <p className="text-4xl mb-3">
              🔍
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try searching for another product.
            </p>

          </div>

        )}

      </div>
    </div>
  );
}

export default AdminProducts;