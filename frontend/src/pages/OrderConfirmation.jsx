
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OrderConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(
    async (showLoading = false) => {
      const customerToken = localStorage.getItem("customerToken");

      if (!customerToken) {
        navigate("/customer/login");
        return;
      }

      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      if (showLoading) setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${encodeURIComponent(orderId)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${customerToken}`,
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

          setError(data.message || "Unable to load your order.");
          setLoading(false);
          return;
        }

        if (!data.order) {
          setError("We could not find this order.");
          setLoading(false);
          return;
        }

        setOrder(data.order);
        setError("");
        setLoading(false);
      } catch (err) {
        console.error("Fetch order error:", err);
        setError("Unable to connect to the server. Please try again.");
        setLoading(false);
      }
    },
    [orderId, navigate]
  );

  useEffect(() => {
    fetchOrder(true);

    const interval = setInterval(() => {
      fetchOrder(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchOrder]);

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

  const statusSteps = [
    { name: "Order Placed", number: 1, icon: "✓" },
    { name: "Preparing", number: 2, icon: "♨" },
    { name: "Ready", number: 3, icon: "✓" },
    { name: "Completed", number: 4, icon: "★" },
  ];

  const getStatusIndex = (status) => {
    const index = statusSteps.findIndex(
      (step) => step.name.toLowerCase() === String(status || "").toLowerCase()
    );

    return index < 0 ? 0 : index;
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl">
            📦
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Loading Your Order
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Please wait while we fetch your order details.
          </p>
          <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-orange-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-orange-500" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl">📦</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order Not Found
          </h1>
          <p className="mt-3 text-gray-500">
            {error || "We could not find your order."}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => fetchOrder(true)}
              className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="rounded-xl border border-orange-200 px-6 py-3 font-semibold text-orange-700 transition hover:bg-orange-50"
            >
              My Orders
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Support either nested customer details or direct customer fields.
  const customer = order.customer || order;
  const currentStatusIndex = getStatusIndex(order.status);

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/50 to-white px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Success banner */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-white px-5 py-9 text-center shadow-lg sm:px-10 sm:py-12">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-100/60" />
          <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-orange-100/60" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl ring-8 ring-green-50/60">
              ✓
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
              Shree Ladli Sweets & Snacks
            </p>

            <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Order Placed Successfully!
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Thank you for choosing Shree Ladli. We are preparing to make your
              experience special!
            </p>

            <div className="mx-auto mt-7 inline-block max-w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Your Order ID
              </p>
              <p className="mt-1 break-all text-xl font-extrabold text-orange-700 sm:text-2xl">
                {order.orderId || orderId}
              </p>
            </div>
          </div>
        </div>

        {/* Order tracking */}
        <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-md sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Stay Updated
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Track Your Order
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Your order status refreshes automatically.
            </p>
          </div>

          <div className="overflow-x-auto pb-3">
            <div className="mx-auto flex min-w-[440px] max-w-3xl items-start">
              {statusSteps.map((step, index) => {
                const isComplete = currentStatusIndex >= index;
                const isCurrent = currentStatusIndex === index;

                return (
                  <div
                    key={step.name}
                    className="relative flex flex-1 flex-col items-center text-center"
                  >
                    {index > 0 && (
                      <div
                        className={`absolute right-1/2 top-6 h-1 w-full ${
                          currentStatusIndex >= index
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition ${
                        isComplete
                          ? "bg-green-500 text-white shadow-md shadow-green-100"
                          : "bg-gray-100 text-gray-400"
                      } ${
                        isCurrent ? "ring-4 ring-green-100" : ""
                      }`}
                    >
                      {isComplete ? step.icon : step.number}
                    </div>

                    <p
                      className={`mt-3 text-xs font-semibold sm:text-sm ${
                        isComplete ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </p>

                    {isCurrent && (
                      <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-green-600">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {order.status && (
            <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
              Current status: <strong>{order.status}</strong>
            </div>
          )}
        </div>

        {/* Order and customer information */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            {/* Items */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Here is what you ordered.
              </p>

              <div className="mt-6 divide-y divide-gray-100">
                {(order.items || []).map((item, index) => (
                  <div
                    key={`${item.id || item.name}-${index}`}
                    className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {item.quantity}
                        {item.unit ? ` · ${item.unit}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        ₹{formatPrice(item.price)} each
                      </p>
                    </div>

                    <p className="shrink-0 font-bold text-gray-900">
                      ₹
                      {formatPrice(
                        Number(item.price || 0) *
                          Number(item.quantity || 1)
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-dashed border-gray-200 pt-5">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">Delivery Charge</span>
                  <span className="font-semibold text-gray-900">
                    ₹{formatPrice(order.deliveryCharge)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-t border-gray-100 pt-4">
                  <span className="text-lg font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-extrabold text-orange-700">
                    ₹{formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                Payment Information
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Payment Method
                  </p>
                  <p className="mt-2 break-words font-semibold text-gray-900">
                    {order.paymentMethod || "Not specified"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Payment Status
                  </p>
                  <p className="mt-2 break-words font-semibold text-orange-700">
                    {order.paymentStatus || "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer details */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                Delivery Details
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Customer Name
                  </p>
                  <p className="mt-1 break-words font-semibold text-gray-900">
                    {customer.name || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Phone Number
                  </p>
                  <p className="mt-1 break-words font-semibold text-gray-900">
                    {customer.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Delivery Address
                  </p>
                  <p className="mt-1 break-words leading-6 text-gray-700">
                    {customer.address || "Not provided"}
                    {customer.city ? `, ${customer.city}` : ""}
                    {customer.pincode ? ` - ${customer.pincode}` : ""}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Order Placed On
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-gray-900">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-600 to-amber-600 p-6 text-white shadow-lg">
              <div className="text-3xl">🍬</div>
              <h3 className="mt-3 text-lg font-bold">
                Thank You for Choosing Shree Ladli!
              </h3>
              <p className="mt-2 text-sm leading-6 text-orange-50">
                We appreciate your order. We hope every bite brings you
                happiness!
              </p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/menu")}
            className="rounded-xl bg-orange-600 px-8 py-3.5 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-orange-700"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/my-orders")}
            className="rounded-xl border border-orange-300 bg-white px-8 py-3.5 font-semibold text-orange-700 transition hover:bg-orange-50"
          >
            My Orders
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Thank you for making Shree Ladli a part of your day.
        </p>
      </div>
    </section>
  );
}

export default OrderConfirmation;
