
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchMyOrders = useCallback(async () => {
    const token = localStorage.getItem("customerToken");

    if (!token) {
      navigate("/customer/login");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("customerToken");
          localStorage.removeItem("customer");
          navigate("/customer/login");
          return;
        }

        setMessage(data.message || "Unable to load your orders.");
        return;
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Fetch orders error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-800 ring-amber-200",
      Preparing: "bg-blue-50 text-blue-800 ring-blue-200",
      Ready: "bg-purple-50 text-purple-800 ring-purple-200",
      Completed: "bg-green-50 text-green-800 ring-green-200",
    };

    return styles[status] || "bg-gray-100 text-gray-700 ring-gray-200";
  };

  const getPaymentStyle = (status) => {
    if (status === "Paid") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Verification Required") {
      return "bg-purple-50 text-purple-700";
    }

    return "bg-amber-50 text-amber-800";
  };

  const getItemCount = (items = []) =>
    items.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );

  return (
    <section className="min-h-screen bg-[#fffaf0] px-4 py-7 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">

        {/* Page Heading */}
        <header className="mb-8 text-center sm:mb-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-white text-3xl shadow-sm">
            🛍️
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
            Shree Ladli Sweets & Snacks
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-[#651c25] sm:text-4xl">
            My Orders
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Every sweet moment, all in one place. View your past orders
            and follow their progress.
          </p>

          {!loading && !message && orders.length > 0 && (
            <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-5 py-2 text-sm font-semibold text-[#651c25] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </div>
          )}
        </header>

        {/* Loading State */}
        {loading && (
          <div className="space-y-5">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-amber-100 bg-white p-6 shadow-sm"
              >
                <div className="h-5 w-40 rounded bg-amber-100" />
                <div className="mt-3 h-4 w-56 rounded bg-gray-100" />
                <div className="mt-7 h-20 rounded-2xl bg-gray-100" />
                <div className="mt-5 h-11 rounded-xl bg-gray-100" />
              </div>
            ))}

            <p className="text-center text-sm text-gray-500">
              Fetching your orders...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && message && (
          <div className="rounded-3xl border border-red-100 bg-white p-7 text-center shadow-sm sm:p-12">
            <div className="text-5xl">⚠️</div>

            <h2 className="mt-5 text-xl font-bold text-[#651c25]">
              Couldn't Load Your Orders
            </h2>

            <p className="mx-auto mt-3 max-w-md break-words text-sm leading-6 text-gray-500">
              {message}
            </p>

            <button
              type="button"
              onClick={fetchMyOrders}
              className="mt-6 rounded-xl bg-[#651c25] px-7 py-3 font-semibold text-white transition hover:bg-[#4a1019]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !message && orders.length === 0 && (
          <div className="rounded-3xl border border-amber-100 bg-white px-6 py-12 text-center shadow-lg sm:px-12 sm:py-16">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-5xl">
              📦
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#651c25]">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Your next favourite sweet or snack is waiting for you.
              Explore our menu and place your first order!
            </p>

            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="mt-7 rounded-xl bg-[#651c25] px-8 py-3.5 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#4a1019]"
            >
              Explore Menu →
            </button>
          </div>
        )}

        {/* Order Cards */}
        {!loading && !message && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <article
                key={order.orderId}
                className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm transition duration-300 hover:shadow-lg"
              >
                {/* Order Header */}
                <div className="border-b border-amber-100 bg-gradient-to-r from-white to-amber-50 p-5 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Order ID
                      </p>

                      <h2 className="mt-1 break-all text-lg font-extrabold text-[#651c25]">
                        {order.orderId}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        🗓️ {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${getStatusStyle(order.status || "Pending")}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-5 sm:p-7">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-bold text-[#651c25]">
                      Order Items
                    </h3>

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-[#651c25]">
                      {getItemCount(order.items || [])} items
                    </span>
                  </div>

                  <div className="divide-y divide-amber-100">
                    {(order.items || []).map((item, index) => (
                      <div
                        key={`${order.orderId}-${item.id || item.name}-${index}`}
                        className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || "Order item"}
                              loading="lazy"
                              className="h-14 w-14 shrink-0 rounded-xl border border-amber-100 bg-amber-50 object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                              🍬
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="break-words font-semibold text-gray-800">
                              {item.name || "Unnamed Item"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Qty: {item.quantity || 1}
                              {item.unit ? ` · ${item.unit}` : ""}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 text-sm font-bold text-[#651c25] sm:text-base">
                          ₹
                          {formatPrice(
                            Number(item.price || 0) *
                              Number(item.quantity || 1)
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Payment Summary */}
                  <div className="mt-6 rounded-2xl border border-amber-100 bg-[#fffdf8] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Payment Method
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                          {order.paymentMethod || "Not specified"}
                        </p>

                        <div className="mt-3">
                          <p className="text-xs text-gray-500">
                            Payment Status
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold ${getPaymentStyle(order.paymentStatus || "Pending")}`}
                          >
                            {order.paymentStatus || "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-amber-100 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-right">
                          Total Amount
                        </p>

                        <p className="mt-1 text-2xl font-extrabold text-[#651c25] sm:text-right">
                          ₹{formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View Details */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/order-confirmation?orderId=${encodeURIComponent(
                          order.orderId
                        )}`
                      )
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#651c25] px-5 py-3.5 font-semibold text-white transition hover:bg-[#4a1019]"
                  >
                    View Order Details
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        {!loading && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="rounded-xl bg-[#651c25] px-7 py-3 font-semibold text-white transition hover:bg-[#4a1019]"
            >
              Continue Shopping
            </button>

            <button
              type="button"
              onClick={fetchMyOrders}
              className="rounded-xl border border-amber-200 bg-white px-7 py-3 font-semibold text-[#651c25] transition hover:bg-amber-50"
            >
              Refresh Orders
            </button>
          </div>
        )}

        <footer className="mt-8 border-t border-amber-100 pt-6 text-center">
          <p className="text-sm font-semibold text-[#651c25]">
            Thank you for choosing Shree Ladli!
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Freshness, quality and sweetness in every bite.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default MyOrders;
