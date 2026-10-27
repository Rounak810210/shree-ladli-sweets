
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import API_BASE_URL from "../config/api";
import localProducts from "../data/product";

const categories = [
  { name: "All", icon: "⭐" },
  { name: "Sweets", icon: "🍬" },
  { name: "Snacks", icon: "🥟" },
  { name: "Fast Food", icon: "🍜" },
  { name: "Beverages", icon: "🥤" },
];

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuProducts, setMenuProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setLoadError(false);

       const response = await fetch(
  `${API_BASE_URL}/api/products`
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load products");
        }

       const apiProducts = Array.isArray(data.products)
  ? data.products
  : [];

const imageByName = new Map(
  localProducts.map((item) => [
    item.name.trim().toLowerCase(),
    item.image,
  ])
);

const imageAliases = {
  "rasmalai special": "rasmalai",
  "kaju barffi special": "kaju katli",
};

const fixedProducts = apiProducts.map((product) => {
  const productName = String(product.name || "")
    .trim()
    .toLowerCase();

  const localName = imageAliases[productName] || productName;

  return {
    ...product,
    image: imageByName.get(localName) || product.image,
  };
});

setMenuProducts(fixedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter by category and search term
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = menuProducts.filter((product) => {
    const name = String(product.name || "").toLowerCase();
    const description = String(product.description || "").toLowerCase();

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      name.includes(normalizedSearch) ||
      description.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="min-h-screen scroll-mt-20 bg-gradient-to-b from-orange-50 via-white to-orange-50/50 px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[4px] text-orange-600 sm:text-sm sm:tracking-[5px]">
            Our Menu
          </p>

          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 sm:mt-4 sm:text-4xl lg:text-5xl">
            Freshly Prepared Every Day
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            Explore our delicious range of sweets, snacks, fast food,
            and refreshing beverages.
          </p>
        </header>

        {/* Search Bar */}
        <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
          <label htmlFor="menu-search" className="sr-only">
            Search menu products
          </label>

          <div className="relative">
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl"
              aria-hidden="true"
            >
              🔍
            </span>

            <input
              id="menu-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search sweets, snacks, fast food..."
              className="w-full rounded-full border border-orange-200 bg-white py-3.5 pl-12 pr-5 text-sm text-gray-800 shadow-md outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 sm:py-4 sm:text-base"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-7 flex flex-wrap justify-center gap-2.5 sm:mt-8 sm:gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                aria-pressed={isSelected}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 sm:px-6 sm:py-3 ${
                  isSelected
                    ? "border-orange-600 bg-orange-600 text-white shadow-orange-200"
                    : "border-orange-200 bg-white text-orange-700 hover:border-orange-400 hover:bg-orange-50"
                }`}
              >
                <span aria-hidden="true">{category.icon}</span>{" "}
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Product Count */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 pb-4 sm:mt-10">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-bold text-orange-700">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-sm font-semibold text-orange-700 hover:text-orange-900"
            >
              Clear search ✕
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-7">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-orange-100/70"
              />
            ))}
          </div>
        ) : loadError ? (
          /* Loading Error */
          <div className="py-16 text-center">
            <p className="text-4xl" aria-hidden="true">⚠️</p>
            <h2 className="mt-4 text-xl font-bold text-gray-800">
              We couldn't load the menu
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please check your connection and try refreshing the page.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          /* Product Grid */
          <div className="grid grid-cols-1 items-stretch gap-5 pt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          /* No Products Found */
          <div className="py-16 text-center sm:py-20">
            <div className="text-5xl sm:text-6xl" aria-hidden="true">
              😔
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800 sm:text-3xl">
              No Products Found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              We couldn't find any products matching your search or category.
              Try another search or browse all products.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-6 rounded-xl bg-orange-600 px-7 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Menu;
