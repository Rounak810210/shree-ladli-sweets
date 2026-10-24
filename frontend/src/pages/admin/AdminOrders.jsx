
import { useCallback, useEffect, useState } from "react";

function AdminOrders({ category }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const adminToken = () => localStorage.getItem("adminToken");

  const getPrice = (price) => {
    if (typeof price === "number") return price;
    return Number(String(price || "").replace(/[^\d.]/g, "")) || 0;
  };

  const getNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const formatPrice = (value) =>
    getPrice(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-800 border-amber-200",
      Preparing: "bg-blue-50 text-blue-800 border-blue-200",
      Ready: "bg-purple-50 text-purple-800 border-purple-200",
      Completed: "bg-green-50 text-green-800 border-green-200",
    };

    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getPaymentStatusStyle = (status) => {
    if (status === "Paid") return "text-green-700 bg-green-50";
    if (status === "Verification Required") {
      return "text-purple-700 bg-purple-50";
    }
    return "text-amber-800 bg-amber-50";
  };

  const getCategoryStatus = (order) => {
    if (!category) return order.status || "Pending";

    const categoryItems = (order.items || []).filter(
      (item) => item.category === category
    );

    if (!categoryItems.length) return "Pending";

    const statuses = categoryItems.map((item) => item.status || "Pending");

    if (statuses.every((status) => status === "Completed")) {
      return "Completed";
    }
    if (statuses.some((status) => status === "Preparing")) {
      return "Preparing";
    }
    if (statuses.some((status) => status === "Ready")) {
      return "Ready";
    }

    return "Pending";
  };

  const loadOrders = useCallback(async () => {
    const token = adminToken();

    if (!token) {
      setOrders([]);
      setError("Admin authentication required. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setOrders([]);
        setError(data.message || "Unable to load orders.");
        return;
      }

      const savedOrders = Array.isArray(data.orders) ? data.orders : [];

      const filteredByCategory = category
        ? savedOrders.filter((order) =>
            order.items?.some((item) => item.category === category)
          )
        : savedOrders;

      filteredByCategory.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      setOrders(filteredByCategory);
    } catch (err) {
      console.error("Error loading orders:", err);
      setOrders([]);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (orderId, newStatus) => {
    const token = adminToken();

    if (!token) {
      alert("Admin authentication required.");
      return;
    }

    setUpdating(orderId);

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${encodeURIComponent(orderId)}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update order status.");
        return;
      }

      await loadOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Unable to update order status. Please try again.");
    } finally {
      setUpdating("");
    }
  };

  const updateItemStatus = async (orderId, itemIndex, newStatus) => {
    const token = adminToken();

    if (!token) {
      alert("Admin authentication required.");
      return;
    }

    const updateKey = `${orderId}-${itemIndex}`;
    setUpdating(updateKey);

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${encodeURIComponent(orderId)}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            itemIndex,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update item status.");
        return;
      }

      await loadOrders();
    } catch (err) {
      console.error("Error updating item status:", err);
      alert("Unable to update item status. Please try again.");
    } finally {
      setUpdating("");
    }
  };

  // Existing local payment confirmation behavior retained for now.
  // This does not update MongoDB; persistent payment verification
  // should be implemented through a secured backend endpoint.
  const markPaymentAsPaid = (orderId) => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("shreeLadliOrders") || "[]"
      );

      const updatedOrders = savedOrders.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              paymentStatus: "Paid",
              updatedAt: new Date().toISOString(),
            }
          : order
      );

      localStorage.setItem(
        "shreeLadliOrders",
        JSON.stringify(updatedOrders)
      );

      const latestOrder = JSON.parse(
        localStorage.getItem("shreeLadliOrder") || "null"
      );

      if (latestOrder?.orderId === orderId) {
        localStorage.setItem(
          "shreeLadliOrder",
          JSON.stringify({
            ...latestOrder,
            paymentStatus: "Paid",
            updatedAt: new Date().toISOString(),
          })
        );
      }

      alert(
        "Updated local payment information only. The database payment status has not been changed."
      );
    } catch (err) {
      console.error("Error updating local payment status:", err);
      alert("Unable to update local payment information.");
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;
  const readyOrders = orders.filter(
    (order) => order.status === "Ready"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const searchText = search.toLowerCase().trim();

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "All" || order.status === filter;

    const orderId = String(order.orderId || "").toLowerCase();
    const customerName = String(
      order.customer?.name || order.customerName || order.name || ""
    ).toLowerCase();
    const customerPhone = String(
      order.customer?.phone || order.customerPhone || order.phone || ""
    ).toLowerCase();

    const matchesSearch =
      orderId.includes(searchText) ||
      customerName.includes(searchText) ||
      customerPhone.includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const departments = [
    "Sweets",
    "Fast Food",
    "Snacks",
    "Beverages",
  ];

  const statCards = [
    { label: "Total Orders", value: totalOrders, color: "text-[#651c25]" },
    { label: "Pending", value: pendingOrders, color: "text-amber-700" },
    { label: "Preparing", value: preparingOrders, color: "text-blue-700" },
    { label: "Ready", value: readyOrders, color: "text-purple-700" },
    { label: "Completed", value: completedOrders, color: "text-green-700" },
  ];

  const sectionClass =
    "rounded-2xl border border-amber-100 bg-white shadow-sm";

  return (
    <section className="min-h-screen bg-[#fffaf0] px-4 py-7 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
              Shree Ladli Sweets & Snacks
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#651c25] sm:text-4xl">
              {category ? `${category} Orders` : "Order Management"}
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              {category
                ? `Manage orders and items assigned to ${category}.`
                : "View and manage all customer orders in one place."}
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="rounded-xl border border-amber-200 bg-white px-5 py-3 font-semibold text-[#651c25] transition hover:bg-amber-50 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh Orders"}
          </button>
        </header>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`${sectionClass} p-4 sm:p-5`}
            >
              <p className="text-xs font-semibold text-gray-500 sm:text-sm">
                {stat.label}
              </p>
              <p className={`mt-2 text-3xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className={`${sectionClass} mb-6 p-4 sm:p-5`}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order ID, customer name or phone..."
              className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] px-4 py-3 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <strong className="text-[#651c25]">
              {filteredOrders.length}
            </strong>{" "}
            of {orders.length} orders
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className={`${sectionClass} animate-pulse p-6`}
              >
                <div className="h-5 w-40 rounded bg-amber-100" />
                <div className="mt-4 h-4 w-64 rounded bg-gray-100" />
                <div className="mt-6 h-24 rounded-xl bg-gray-100" />
              </div>
            ))}
            <p className="text-center text-sm text-gray-500">
              Loading orders...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className={`${sectionClass} p-7 text-center sm:p-12`}>
            <div className="text-4xl">⚠️</div>
            <h2 className="mt-4 text-xl font-bold text-[#651c25]">
              Unable to Load Orders
            </h2>
            <p className="mt-2 break-words text-sm text-gray-500">
              {error}
            </p>
            <button
              type="button"
              onClick={loadOrders}
              className="mt-5 rounded-xl bg-[#651c25] px-6 py-3 font-semibold text-white hover:bg-[#4a1019]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className={`${sectionClass} p-8 text-center sm:p-14`}>
            <div className="text-5xl">📦</div>
            <h2 className="mt-5 text-2xl font-bold text-[#651c25]">
              No Orders Found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
            {(search || filter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="mt-5 rounded-xl border border-amber-200 px-5 py-2.5 font-semibold text-[#651c25] hover:bg-amber-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Orders */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];

              const subtotal =
                order.subtotal !== undefined && order.subtotal !== null
                  ? getPrice(order.subtotal)
                  : items.reduce(
                      (sum, item) =>
                        sum +
                        getPrice(item.price) *
                          getNumber(item.quantity || 1),
                      0
                    );

              const deliveryCharge = getPrice(order.deliveryCharge || 0);

              const total =
                order.total !== undefined && order.total !== null
                  ? getPrice(order.total)
                  : subtotal + deliveryCharge;

              const paymentMethod =
                order.paymentMethod ||
                order.payment?.method ||
                "N/A";

              const paymentStatus =
                order.paymentStatus ||
                (paymentMethod === "UPI Payment"
                  ? "Verification Required"
                  : "Pending");

              const customerName =
                order.customer?.name ||
                order.customerName ||
                order.name ||
                "N/A";

              const customerPhone =
                order.customer?.phone ||
                order.customerPhone ||
                order.phone ||
                "N/A";

              const customerAddress =
                order.customer?.address ||
                order.address ||
                "N/A";

              const visibleItems = items
                .map((item, originalIndex) => ({
                  ...item,
                  originalIndex: item.originalIndex ?? originalIndex,
                }))
                .filter((item) => !category || item.category === category);

              return (
                <article
                  key={order.orderId}
                  className={`${sectionClass} overflow-hidden`}
                >
                  {/* Order header */}
                  <div className="border-b border-amber-100 bg-gradient-to-r from-white to-amber-50 px-5 py-5 sm:px-7">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Order ID
                        </p>
                        <h2 className="mt-1 break-all text-lg font-extrabold text-[#651c25]">
                          {order.orderId || "N/A"}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-2 text-xs font-bold ${getStatusStyle(getCategoryStatus(order))}`}
                        >
                          {getCategoryStatus(order)}
                        </span>

                        {!category && (
                          <select
                            aria-label={`Update status for order ${order.orderId}`}
                            value={order.status || "Pending"}
                            disabled={updating === order.orderId}
                            onChange={(event) =>
                              updateStatus(order.orderId, event.target.value)
                            }
                            className="min-w-36 rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-semibold text-[#651c25] outline-none focus:ring-2 focus:ring-amber-100 disabled:opacity-60"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Completed">Completed</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                      {/* Customer details */}
                      <div>
                        <h3 className="mb-4 text-lg font-bold text-[#651c25]">
                          Customer Details
                        </h3>

                        <div className="space-y-3 rounded-xl bg-[#fffdf8] p-4 text-sm">
                          <p className="break-words">
                            <span className="text-gray-500">Name: </span>
                            <strong className="text-gray-800">{customerName}</strong>
                          </p>
                          <p className="break-words">
                            <span className="text-gray-500">Phone: </span>
                            <strong className="text-gray-800">{customerPhone}</strong>
                          </p>
                          <p className="break-words">
                            <span className="text-gray-500">Address: </span>
                            <strong className="text-gray-800">{customerAddress}</strong>
                          </p>
                          {(order.customer?.city || order.city) && (
                            <p>
                              <span className="text-gray-500">City: </span>
                              <strong className="text-gray-800">
                                {order.customer?.city || order.city}
                              </strong>
                            </p>
                          )}
                          {(order.customer?.pincode || order.pincode) && (
                            <p>
                              <span className="text-gray-500">Pincode: </span>
                              <strong className="text-gray-800">
                                {order.customer?.pincode || order.pincode}
                              </strong>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold text-[#651c25]">
                            Order Items
                          </h3>
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-[#651c25]">
                            {visibleItems.length} items
                          </span>
                        </div>

                        {visibleItems.length === 0 ? (
                          <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                            No items in this department.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {visibleItems.map((item) => {
                              const price = getPrice(item.price);
                              const quantity = getNumber(item.quantity || 1);
                              const itemStatus = item.status || "Pending";
                              const updateKey = `${order.orderId}-${item.originalIndex}`;

                              return (
                                <div
                                  key={`${order.orderId}-${item.originalIndex}`}
                                  className="rounded-xl border border-amber-100 p-4"
                                >
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                      <p className="break-words font-bold text-gray-800">
                                        {item.name || "Unnamed Item"}
                                      </p>
                                      <p className="mt-1 text-xs text-gray-500">
                                        {item.category || "N/A"} · Qty: {quantity}
                                      </p>
                                      <p className="mt-2 font-semibold text-[#651c25]">
                                        ₹{formatPrice(price * quantity)}
                                      </p>
                                    </div>

                                    <span
                                      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(itemStatus)}`}
                                    >
                                      {itemStatus}
                                    </span>
                                  </div>

                                  {category && (
                                    <div className="mt-4 border-t border-amber-100 pt-3">
                                      <label
                                        className="mb-2 block text-xs font-semibold text-gray-500"
                                        htmlFor={updateKey}
                                      >
                                        Update item status
                                      </label>
                                      <select
                                        id={updateKey}
                                        value={itemStatus}
                                        disabled={updating === updateKey}
                                        onChange={(event) =>
                                          updateItemStatus(
                                            order.orderId,
                                            item.originalIndex,
                                            event.target.value
                                          )
                                        }
                                        className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2.5 text-sm font-semibold text-[#651c25] outline-none focus:ring-2 focus:ring-amber-100 disabled:opacity-60 sm:w-auto"
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Ready">Ready</option>
                                        <option value="Completed">Completed</option>
                                      </select>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment and total */}
                    <div className="mt-7 grid grid-cols-1 gap-6 border-t border-amber-100 pt-6 lg:grid-cols-2">
                      <div>
                        <h3 className="mb-4 text-lg font-bold text-[#651c25]">
                          Payment Information
                        </h3>

                        <div className="rounded-xl bg-[#fffdf8] p-4">
                          <p className="text-xs text-gray-500">Payment Method</p>
                          <p className="mt-1 break-words font-semibold text-gray-800">
                            {paymentMethod}
                          </p>

                          <p className="mt-4 text-xs text-gray-500">
                            Payment Status
                          </p>
                          <span
                            className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getPaymentStatusStyle(paymentStatus)}`}
                          >
                            {paymentStatus}
                          </span>

                          {!category &&
                            paymentStatus !== "Paid" &&
                            (paymentMethod === "UPI Payment" ||
                              paymentMethod === "Cash on Delivery") && (
                              <div className="mt-4 border-t border-amber-100 pt-4">
                                <p className="mb-3 text-xs leading-5 text-gray-500">
                                  Verify receipt using your bank/UPI records or
                                  confirm that cash has actually been received.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const confirmed = window.confirm(
                                      paymentMethod === "UPI Payment"
                                        ? "Have you verified the UPI payment in your bank or UPI app?"
                                        : "Have you received the cash from the customer?"
                                    );
                                    if (confirmed) {
                                      markPaymentAsPaid(order.orderId);
                                    }
                                  }}
                                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-100"
                                >
                                  {paymentMethod === "UPI Payment"
                                    ? "Mark as Paid"
                                    : "Confirm Cash Received"}
                                </button>
                              </div>
                            )}

                          {paymentStatus === "Paid" && (
                            <p className="mt-3 text-xs font-semibold text-green-700">
                              Marked as paid.
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-4 text-lg font-bold text-[#651c25]">
                          Price Summary
                        </h3>

                        <div className="rounded-xl bg-[#fffdf8] p-4">
                          <div className="flex justify-between gap-4 py-2 text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-semibold text-gray-800">
                              ₹{formatPrice(subtotal)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 py-2 text-sm">
                            <span className="text-gray-500">Delivery Charge</span>
                            <span className="font-semibold text-gray-800">
                              ₹{formatPrice(deliveryCharge)}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-4 border-t border-amber-100 pt-4">
                            <span className="font-bold text-[#651c25]">
                              Total
                            </span>
                            <span className="text-2xl font-extrabold text-[#651c25]">
                              ₹{formatPrice(total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details button */}
                    <div className="mt-6 border-t border-amber-100 pt-5">
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href =
                            `/admin/order-details?orderId=${encodeURIComponent(order.orderId)}`;
                        }}
                        className="w-full rounded-xl bg-[#651c25] px-5 py-3.5 font-semibold text-white transition hover:bg-[#4a1019]"
                      >
                        View Full Order Details →
                      </button>

                      {order.updatedAt && (
                        <p className="mt-3 text-right text-xs text-gray-400">
                          Last updated: {formatDate(order.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-9 border-t border-amber-100 pt-6 text-center">
          <p className="text-sm font-semibold text-[#651c25]">
            Shree Ladli Sweets & Snacks
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Order management dashboard
          </p>
        </footer>
      </div>
    </section>
  );
}

export default AdminOrders;
