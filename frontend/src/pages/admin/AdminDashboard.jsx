
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const CHART_COLORS = [
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#22c55e",
];

const CATEGORIES = [
  "Sweets",
  "Fast Food",
  "Snacks",
  "Beverages",
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  let admin = null;

  try {
    admin = JSON.parse(
      localStorage.getItem("shreeLadliAdmin") || "null"
    );
  } catch {
    admin = null;
  }

  const role = admin?.role || "admin";

  const getRoleName = () => {
    const roleNames = {
      owner: "Owner",
      sweets: "Sweets Admin",
      fastfood: "Fast Food Admin",
      snacks: "Snacks Admin",
      beverages: "Beverages Admin",
    };

    return roleNames[role] || "Admin";
  };

  const getCategory = () => {
    const roleCategories = {
      sweets: "Sweets",
      fastfood: "Fast Food",
      snacks: "Snacks",
      beverages: "Beverages",
    };

    return roleCategories[role] || null;
  };

  const adminCategory = getCategory();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
          setOrders([]);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/orders/admin/all",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders"
          );
        }

        const allOrders = data.orders || [];

        if (role === "owner") {
          setOrders(allOrders);
        } else {
          const categoryOrders = allOrders.filter((order) =>
            order.items?.some(
              (item) => item.category === adminCategory
            )
          );

          setOrders(categoryOrders);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [role, adminCategory]);

  const handleLogout = () => {
    localStorage.removeItem("shreeLadliAdmin");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  // Order statistics
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

  // Revenue from completed orders only
  const totalRevenue = orders
    .filter((order) => order.status === "Completed")
    .reduce((total, order) => {
      if (role === "owner") {
        return total + Number(order.total || 0);
      }

      const categoryRevenue = (order.items || [])
        .filter(
          (item) => item.category === adminCategory
        )
        .reduce((itemTotal, item) => {
          return (
            itemTotal +
            Number(item.price || 0) *
              Number(item.quantity || 1)
          );
        }, 0);

      return total + categoryRevenue;
    }, 0);

  // Pie chart data
  const orderStatusData = [
    { name: "Pending", value: pendingOrders },
    { name: "Preparing", value: preparingOrders },
    { name: "Ready", value: readyOrders },
    { name: "Completed", value: completedOrders },
  ];

  // Category revenue from completed orders
  const categoryRevenueData = CATEGORIES.map((category) => {
    const revenue = orders
      .filter((order) => order.status === "Completed")
      .reduce((total, order) => {
        const categoryTotal = (order.items || [])
          .filter((item) => item.category === category)
          .reduce((itemTotal, item) => {
            return (
              itemTotal +
              Number(item.price || 0) *
                Number(item.quantity || 1)
            );
          }, 0);

        return total + categoryTotal;
      }, 0);

    return { category, revenue };
  });

  // Latest five orders
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-700",
      Preparing: "bg-blue-100 text-blue-700",
      Ready: "bg-purple-100 text-purple-700",
      Completed: "bg-green-100 text-green-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const categoryCards = [
    {
      role: "sweets",
      title: "Sweets Admin",
      icon: "🍬",
      description: "Manage sweets orders.",
      path: "/admin/sweets",
    },
    {
      role: "fastfood",
      title: "Fast Food Admin",
      icon: "🍟",
      description: "Manage fast food orders.",
      path: "/admin/fast-food",
    },
    {
      role: "snacks",
      title: "Snacks Admin",
      icon: "🥟",
      description: "Manage snacks, chaat and samosa orders.",
      path: "/admin/snacks",
    },
    {
      role: "beverages",
      title: "Beverages Admin",
      icon: "🥤",
      description: "Manage beverage orders.",
      path: "/admin/beverages",
    },
  ];

  const openOrders = () => {
    const paths = {
      owner: "/admin/orders",
      sweets: "/admin/sweets",
      fastfood: "/admin/fast-food",
      snacks: "/admin/snacks",
      beverages: "/admin/beverages",
    };

    navigate(paths[role] || "/login");
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🍬 Shree Ladli
            </h1>
            <p className="text-sm text-gray-500">
              Sweets & Snacks
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">
                {getRoleName()}
              </p>
              <p className="text-sm text-gray-500">
                {admin?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <p className="uppercase tracking-widest text-orange-500 font-semibold text-sm">
            Admin Panel
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            {role === "owner"
              ? "Manage your complete Shree Ladli shop."
              : `Manage your ${adminCategory || ""} orders.`}
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-600">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  title: "Total Orders",
                  value: totalOrders,
                  icon: "📦",
                },
                {
                  title: "Pending Orders",
                  value: pendingOrders,
                  icon: "🟡",
                },
                {
                  title: "Preparing",
                  value: preparingOrders,
                  icon: "👨‍🍳",
                },
                {
                  title: "Ready",
                  value: readyOrders,
                  icon: "🟣",
                },
                {
                  title: "Completed",
                  value: completedOrders,
                  icon: "✅",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-3xl shadow-sm p-6 border border-orange-100"
                >
                  <div className="text-4xl mb-4">
                    {card.icon}
                  </div>
                  <p className="text-gray-500">
                    {card.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-2">
                    {card.value}
                  </h3>
                </div>
              ))}
            </div>

            {/* Revenue */}
            <div className="mt-6">
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-orange-100 max-w-sm">
                <div className="text-4xl mb-4">💰</div>
                <p className="text-gray-500">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  From completed orders
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <section className="mt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Quick Actions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={openOrders}
                  className="text-left bg-white rounded-3xl shadow-sm p-6 border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition"
                >
                  <div className="text-4xl mb-4">📋</div>
                  <h4 className="text-xl font-bold">Orders</h4>
                  <p className="text-gray-500 mt-2">
                    {role === "owner"
                      ? "View and manage all customer orders."
                      : `View and manage ${adminCategory || ""} orders.`}
                  </p>
                </button>

                {role === "owner" && (
                  <>
                    <button
                      onClick={() => navigate("/admin/products")}
                      className="text-left bg-white rounded-3xl shadow-sm p-6 border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition"
                    >
                      <div className="text-4xl mb-4">🍬</div>
                      <h4 className="text-xl font-bold">Products</h4>
                      <p className="text-gray-500 mt-2">
                        Manage sweets, snacks, fast food and beverages.
                      </p>
                    </button>

                    <button
                      onClick={() => navigate("/admin/analytics")}
                      className="text-left bg-white rounded-3xl shadow-sm p-6 border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition"
                    >
                      <div className="text-4xl mb-4">📊</div>
                      <h4 className="text-xl font-bold">Analytics</h4>
                      <p className="text-gray-500 mt-2">
                        View sales and business performance.
                      </p>
                    </button>
                  </>
                )}
              </div>
            </section>

            {/* Category Management */}
            {role === "owner" && (
              <section className="mt-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-5">
                  Category Management
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryCards.map((category) => (
                    <button
                      key={category.role}
                      onClick={() => navigate(category.path)}
                      className="text-left bg-white rounded-3xl shadow-sm p-6 border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition"
                    >
                      <div className="text-4xl mb-4">
                        {category.icon}
                      </div>
                      <h4 className="text-xl font-bold">
                        {category.title}
                      </h4>
                      <p className="text-gray-500 mt-2">
                        {category.description}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Category Admin Shortcut */}
            {role !== "owner" && (
              <section className="mt-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-5">
                  My Category
                </h3>

                {categoryCards
                  .filter((category) => category.role === role)
                  .map((category) => (
                    <button
                      key={category.role}
                      onClick={() => navigate(category.path)}
                      className="text-left bg-white rounded-3xl shadow-sm p-6 border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition max-w-sm"
                    >
                      <div className="text-4xl mb-4">
                        {category.icon}
                      </div>
                      <h4 className="text-xl font-bold">
                        {category.title}
                      </h4>
                      <p className="text-gray-500 mt-2">
                        {category.description}
                      </p>
                    </button>
                  ))}
              </section>
            )}

            {/* Analytics Charts - Owner Only */}
            {role === "owner" && (
              <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Pie Chart */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-orange-100 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Order Status Overview
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Distribution of customer orders.
                  </p>

                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={CHART_COLORS[index]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Revenue Bar Chart */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-orange-100 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Revenue by Category
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Revenue from completed orders.
                  </p>

                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="category"
                          tick={{ fontSize: 11 }}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            `₹${Number(value).toLocaleString("en-IN")}`,
                            "Revenue",
                          ]}
                        />
                        <Bar
                          dataKey="revenue"
                          fill="#ea580c"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            )}

            {/* Recent Orders */}
            <section className="mt-10 bg-white rounded-3xl shadow-sm border border-orange-100 p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">
                    Recent Orders
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {role === "owner"
                      ? "Your latest customer orders."
                      : `Latest ${adminCategory || ""} orders.`}
                  </p>
                </div>

                <button
                  onClick={openOrders}
                  className="text-orange-600 font-semibold hover:text-orange-800 whitespace-nowrap"
                >
                  View All →
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="mt-8 text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">📦</div>
                  <p>No orders to display yet.</p>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="font-bold text-gray-900">
                            #{order.orderId}
                          </p>
                          <p className="text-gray-700 mt-1">
                            {order.customer?.name || "Customer"}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="font-bold text-gray-900">
                            ₹{Number(order.total || 0).toLocaleString("en-IN")}
                          </p>
                          <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
