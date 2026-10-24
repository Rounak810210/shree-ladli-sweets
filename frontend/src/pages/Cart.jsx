
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  const getPrice = (price) => {
    return Number(String(price).replace(/[^\d.]/g, ""));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + getPrice(item.price) * item.quantity,
    0
  );

  const deliveryCharge = cartItems.length > 0 ? 50 : 0;
  const grandTotal = subtotal + deliveryCharge;

  return (
    <section className="min-h-screen scroll-mt-20 bg-gradient-to-b from-orange-50 to-white px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-8 text-center sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[4px] text-orange-600 sm:text-sm sm:tracking-[5px]">
            Your Cart
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:mt-4 sm:text-5xl">
            Shopping Cart <span aria-hidden="true">🛒</span>
          </h1>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="rounded-3xl bg-white px-5 py-12 text-center shadow-lg sm:p-16">
            <div className="text-6xl sm:text-7xl" aria-hidden="true">
              🛒
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800 sm:mt-6 sm:text-3xl">
              Your Cart is Empty
            </h2>

            <p className="mt-3 text-gray-500">
              Add some delicious items from our menu.
            </p>

            <Link
              to="/menu"
              className="mt-7 inline-block rounded-xl bg-orange-600 px-8 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Cart and Summary Layout */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

              {/* Cart Items */}
              <div className="min-w-0 space-y-5">
                {cartItems.map((item) => {
                  const price = getPrice(item.price);

                  return (
                    <article
                      key={item._id}
                      className="min-w-0 rounded-2xl border border-orange-100 bg-white p-4 shadow-md transition hover:shadow-lg sm:rounded-3xl sm:p-6"
                    >
                      {/* Product Information */}
                      <div className="flex min-w-0 items-start gap-3 sm:gap-5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-28 sm:w-28 sm:rounded-2xl"
                        />

                        <div className="min-w-0 flex-1">
                          <h2 className="break-words text-base font-bold text-gray-800 sm:text-xl">
                            {item.name}
                          </h2>

                          <p className="mt-1 text-sm font-semibold text-orange-700 sm:mt-2">
                            {item.price}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            {item.category}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="mt-3 text-sm font-semibold text-red-500 transition hover:text-red-700"
                          >
                            🗑 Remove
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="shrink-0 text-right">
                          <p className="text-xs text-gray-500 sm:text-sm">
                            Item Total
                          </p>

                          <p className="mt-1 text-base font-extrabold text-orange-600 sm:text-xl">
                            ₹{price * item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center justify-between border-t border-orange-50 pt-4 sm:mt-5">
                        <span className="text-sm text-gray-500">
                          Quantity
                        </span>

                        <div className="flex items-center overflow-hidden rounded-xl border border-orange-200">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item._id)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="px-4 py-2 font-bold text-orange-700 transition hover:bg-orange-100"
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center text-sm font-bold text-gray-800">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item._id)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="px-4 py-2 font-bold text-orange-700 transition hover:bg-orange-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Order Summary */}
              <aside className="rounded-2xl border border-orange-100 bg-white p-5 shadow-lg sm:rounded-3xl sm:p-8 lg:sticky lg:top-28">
                <h2 className="mb-6 text-xl font-bold text-gray-800 sm:text-2xl">
                  Order Summary
                </h2>

                <div className="mb-4 flex justify-between gap-4 text-sm text-gray-600 sm:text-base">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="mb-4 flex justify-between gap-4 text-sm text-gray-600 sm:text-base">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-800">
                    ₹{deliveryCharge}
                  </span>
                </div>

                <div className="my-5 border-t border-gray-200" />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-bold text-gray-800 sm:text-lg">
                    Grand Total
                  </span>

                  <span className="text-xl font-extrabold text-orange-600 sm:text-2xl">
                    ₹{grandTotal}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-3.5 font-bold text-white shadow-sm transition hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Proceed to Checkout →
                </button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  Review your order before checkout.
                </p>
              </aside>
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link
                to="/menu"
                className="font-semibold text-orange-700 transition hover:text-orange-900"
              >
                ← Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Cart;
