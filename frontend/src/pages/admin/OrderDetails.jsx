
import { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import API_BASE_URL from "../../config/api";

function OrderDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = searchParams.get("orderId");
  const isAdmin = location.pathname.toLowerCase().includes("admin");

  // Fetch order details from the backend
  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);
      setError("");
      setOrder(null);

      if (!orderId) {
        setError("No order ID was provided.");
        setLoading(false);
        return;
      }

      try {
        let token;
        let endpoint;

        if (isAdmin) {
          token = localStorage.getItem("adminToken");
          endpoint = `${API_BASE_URL}/api/orders/admin/${encodeURIComponent(
            orderId
          )}`;
        } else {
          token = localStorage.getItem("customerToken");
          endpoint = `${API_BASE_URL}/api/orders/${encodeURIComponent(
            orderId
          )}`;
        }

        if (!token) {
          throw new Error(
            isAdmin
              ? "Admin login required. Please log in again."
              : "Customer login required. Please log in again."
          );
        }

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load order details."
          );
        }

        if (!cancelled) {
          if (data.order) {
            setOrder(data.order);
          } else {
            setError("The server did not return order details.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading order details:", err);
          setError(
            err.message || "Unable to connect to the server."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId, isAdmin]);

  const getPrice = (price) => {
    if (typeof price === "number") return price;

    return (
      Number(String(price || "").replace(/[^\d.]/g, "")) || 0
    );
  };

  const getNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  };

  const formatCurrency = (value) =>
    `₹${getPrice(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const statusSteps = [
    "Pending",
    "Preparing",
    "Ready",
    "Completed",
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Ready":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Preparing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "Verification Required":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getDepartmentStatus = (items) => {
    if (!items.length) return "Pending";

    const statuses = items.map(
      (item) => item.status || "Pending"
    );

    if (
      statuses.every(
        (itemStatus) => itemStatus === "Completed"
      )
    ) {
      return "Completed";
    }

    if (statuses.some((itemStatus) => itemStatus === "Preparing")) {
      return "Preparing";
    }

    if (statuses.some((itemStatus) => itemStatus === "Ready")) {
      return "Ready";
    }

    return "Pending";
  };

  // Loading and error states
  if (loading || !order) {
    return (
      <div className="min-h-screen bg-[#fffaf0] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-3xl border border-amber-100 bg-white p-7 sm:p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl">
            {loading ? "⏳" : "📦"}
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
            Shree Ladli Sweets & Snacks
          </p>

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-[#651c25]">
            {loading
              ? "Loading Order Details..."
              : "Order Details Unavailable"}
          </h1>

          {!loading && (
            <>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                {error || "We couldn't find this order."}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    isAdmin ? "/admin/orders" : "/my-orders"
                  )
                }
                className="mt-7 w-full rounded-xl bg-[#651c25] px-5 py-3 font-semibold text-white transition hover:bg-[#4a1019]"
              >
                {isAdmin ? "Back to Orders" : "Back to My Orders"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const customerName =
    order.customer?.name ||
    order.name ||
    order.customerName ||
    "N/A";

  const customerPhone =
    order.customer?.phone ||
    order.phone ||
    "N/A";

  const customerAddress =
    order.customer?.address ||
    order.address ||
    "N/A";

  const customerCity =
    order.customer?.city ||
    order.city ||
    "";

  const customerPincode =
    order.customer?.pincode ||
    order.pincode ||
    "";

  const paymentMethod =
    order.paymentMethod ||
    order.payment?.method ||
    "N/A";

  const paymentStatus =
    order.paymentStatus ||
    (paymentMethod === "UPI Payment"
      ? "Verification Required"
      : "Pending");

  const status = order.status || "Pending";
  const currentStatusIndex = statusSteps.indexOf(status);

  const items = Array.isArray(order.items) ? order.items : [];

  const subtotal =
    order.subtotal !== undefined && order.subtotal !== null
      ? getPrice(order.subtotal)
      : items.reduce(
          (total, item) =>
            total +
            getPrice(item.price) * getNumber(item.quantity, 1),
          0
        );

  const deliveryCharge = getPrice(order.deliveryCharge || 0);

  const total =
    order.total !== undefined && order.total !== null
      ? getPrice(order.total)
      : subtotal + deliveryCharge;

  const departments = [
    { name: "Sweets", icon: "🍬", category: "Sweets" },
    { name: "Fast Food", icon: "🍟", category: "Fast Food" },
    { name: "Snacks", icon: "🥟", category: "Snacks" },
    { name: "Beverages", icon: "🥤", category: "Beverages" },
  ];

  const sectionClass =
    "rounded-2xl border border-amber-100 bg-white p-5 sm:p-7 shadow-sm";

  const headingClass =
    "text-xl sm:text-2xl font-bold text-[#651c25]";

  const labelClass = "text-sm text-gray-500";

  const valueClass =
    "mt-1 break-words text-sm sm:text-base font-semibold text-gray-800";

  return (
    <div className="min-h-screen bg-[#fffaf0] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-7 sm:mb-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
              Shree Ladli Sweets & Snacks
            </p>

            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-[#651c25]">
              {isAdmin ? "Order Details" : "Track Your Order"}
            </h1>

            <p className="mt-2 break-all text-sm text-gray-500">
              Order ID:{" "}
              <span className="font-semibold text-gray-800">
                #{order.orderId}
              </span>
            </p>

            {order.createdAt && (
              <p className="mt-1 text-sm text-gray-500">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(isAdmin ? "/admin/orders" : "/my-orders")
            }
            className="w-full sm:w-auto rounded-xl border border-[#651c25] px-5 py-3 font-semibold text-[#651c25] transition hover:bg-[#651c25] hover:text-white"
          >
            ← {isAdmin ? "Back to Orders" : "Back to My Orders"}
          </button>
        </header>

        {/* Current Status */}
        <section className={`${sectionClass} mb-6 sm:mb-8`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Current Order Status
              </p>

              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[#651c25]">
                {status}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {status === "Completed"
                  ? "Your order has been completed. Thank you for choosing Shree Ladli!"
                  : status === "Ready"
                  ? "Your order is ready."
                  : status === "Preparing"
                  ? "Your order is being prepared fresh."
                  : "Your order has been received and is awaiting preparation."}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-bold ${getStatusStyle(status)}`}
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-current" />
              {status}
            </span>
          </div>

          {/* Order Progress */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {statusSteps.map((step, index) => {
              const isCompleted = currentStatusIndex >= index;
              const isCurrent = currentStatusIndex === index;

              return (
                <div
                  key={step}
                  className={`rounded-xl border p-4 text-center transition ${
                    isCompleted
                      ? "border-amber-300 bg-amber-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                      isCompleted
                        ? "bg-[#651c25] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  <p
                    className={`mt-3 text-sm font-bold ${
                      isCompleted
                        ? "text-[#651c25]"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {isCurrent
                      ? "Current stage"
                      : isCompleted
                      ? "Completed"
                      : "Upcoming"}
                  </p>
                </div>
              );
            })}
          </div>

          {currentStatusIndex === -1 && (
            <p className="mt-4 text-sm text-gray-500">
              This order has a status that is not included in the standard
              progress steps.
            </p>
          )}
        </section>

        {/* Department Status */}
        <section className={`${sectionClass} mb-6 sm:mb-8`}>
          <div className="mb-5">
            <h2 className={headingClass}>Department Status</h2>
            <p className="mt-1 text-sm text-gray-500">
              Progress for the departments preparing your items.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((department) => {
              const departmentItems = items.filter(
                (item) => item.category === department.category
              );

              if (departmentItems.length === 0) return null;

              const departmentStatus =
                getDepartmentStatus(departmentItems);

              return (
                <div
                  key={department.category}
                  className="rounded-xl border border-amber-100 bg-[#fffdf8] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{department.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {department.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {departmentItems.length} item
                        {departmentItems.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(departmentStatus)}`}
                  >
                    {departmentStatus}
                  </span>
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <p className="text-sm text-gray-500">
              No items are available for this order.
            </p>
          )}
        </section>

        {/* Customer Information */}
        <section className={`${sectionClass} mb-6 sm:mb-8`}>
          <h2 className={headingClass}>Customer Information</h2>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className={labelClass}>Customer Name</p>
              <p className={valueClass}>{customerName}</p>
            </div>

            <div>
              <p className={labelClass}>Phone Number</p>
              <p className={valueClass}>{customerPhone}</p>
            </div>

            <div>
              <p className={labelClass}>Order Time</p>
              <p className={valueClass}>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("en-IN")
                  : "N/A"}
              </p>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <p className={labelClass}>Delivery Address</p>
              <p className={valueClass}>{customerAddress}</p>
            </div>

            {customerCity && (
              <div>
                <p className={labelClass}>City</p>
                <p className={valueClass}>{customerCity}</p>
              </div>
            )}

            {customerPincode && (
              <div>
                <p className={labelClass}>Pincode</p>
                <p className={valueClass}>{customerPincode}</p>
              </div>
            )}
          </div>
        </section>

        {/* Order Items */}
        <section className={`${sectionClass} mb-6 sm:mb-8`}>
          <div className="mb-5">
            <h2 className={headingClass}>Your Order Items</h2>
            <p className="mt-1 text-sm text-gray-500">
              {items.length} item{items.length !== 1 ? "s" : ""} in this order
            </p>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => {
              const price = getPrice(item.price);
              const quantity = getNumber(item.quantity, 1);
              const itemTotal = price * quantity;

              return (
                <div
                  key={`${item.id || item.name}-${index}`}
                  className="rounded-xl border border-amber-100 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Order item"}
                          className="h-20 w-20 shrink-0 rounded-xl border border-amber-100 object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-3xl">
                          🍬
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="break-words text-base sm:text-lg font-bold text-[#651c25]">
                          {item.name || "Unnamed Item"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.category || "General"}
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                          {formatCurrency(price)} × {quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-amber-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                      <div>
                        <p className="text-xs text-gray-500">Item Total</p>
                        <p className="mt-1 text-xl font-bold text-[#651c25]">
                          {formatCurrency(itemTotal)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(item.status || "Pending")}`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment Information */}
        <section className={`${sectionClass} mb-6 sm:mb-8`}>
          <h2 className={headingClass}>Payment Information</h2>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-[#fffdf8] p-4">
              <p className={labelClass}>Payment Method</p>
              <p className={valueClass}>{paymentMethod}</p>
            </div>

            <div className="rounded-xl bg-[#fffdf8] p-4">
              <p className={labelClass}>Payment Status</p>
              <span
                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-bold ${getStatusStyle(paymentStatus)}`}
              >
                {paymentStatus}
              </span>
            </div>
          </div>
        </section>

        {/* Price Summary */}
        <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
          <div className="bg-[#651c25] px-5 py-5 sm:px-7">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Price Summary
            </h2>
            <p className="mt-1 text-sm text-amber-100">
              Final breakdown for your order
            </p>
          </div>

          <div className="p-5 sm:p-7">
            <div className="ml-auto max-w-md space-y-4">
              <div className="flex justify-between gap-4 text-sm sm:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm sm:text-base">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(deliveryCharge)}
                </span>
              </div>

              <div className="border-t border-amber-100 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg font-bold text-[#651c25]">
                    Total Amount
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#651c25]">
                    {formatCurrency(total)}
                  </span>
                </div>

                <p className="mt-2 text-right text-xs text-gray-400">
                  Inclusive of the charges shown above
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-sm font-semibold text-[#651c25]">
            Thank you for choosing Shree Ladli!
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Freshness, quality and sweetness in every bite.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default OrderDetails;
