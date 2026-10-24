
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const isAvailable = product.available !== false;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:rounded-3xl">

      {/* Product Image */}
      <div className="relative overflow-hidden bg-orange-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-56 lg:h-60 ${
            !isAvailable ? "opacity-60 grayscale-[30%]" : ""
          }`}
        />

        {/* Availability Badge */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm sm:text-sm ${
            isAvailable
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {isAvailable ? "✓ Available" : "✕ Out of Stock"}
        </span>

        {/* Decorative Label */}
        {isAvailable && (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-orange-800 backdrop-blur-sm">
            Fresh & Delicious
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">

        <h2 className="line-clamp-2 text-lg font-bold leading-snug text-gray-800 transition-colors group-hover:text-orange-700 sm:text-xl">
          {product.name}
        </h2>

        {/* Price and Unit */}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-xl font-extrabold text-orange-700 sm:text-2xl">
            ₹{product.price}
          </span>
          <span className="text-sm text-gray-500">
            / {product.unit}
          </span>
        </div>

        {/* Rating: display only when provided */}
        {product.rating != null && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="text-amber-500" aria-hidden="true">
              ★
            </span>
            <span className="font-semibold text-gray-700">
              {Number(product.rating).toFixed(1)}
            </span>
            <span className="text-gray-400">rating</span>
          </div>
        )}

        {/* Description */}
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-500">
          {product.description || "Enjoy the authentic taste of Shree Ladli."}
        </p>

        {/* Add to Cart */}
        {isAvailable ? (
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-300 hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            🛒 Add to Cart
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-xl bg-gray-200 px-4 py-3 font-semibold text-gray-500"
          >
            Currently Unavailable
          </button>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
