import { useEffect, useState } from "react";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    categoryAnalytics: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          "http://localhost:5000/api/orders/admin/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch analytics"
          );
        }

        setAnalytics(data.analytics);
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalOrders = analytics.totalOrders;
  const pendingOrders = analytics.pendingOrders;
  const preparingOrders = analytics.preparingOrders;
  const readyOrders = analytics.readyOrders;
  const completedCount = analytics.completedOrders;
  const totalRevenue = analytics.totalRevenue;

  const categoryAnalytics = analytics.categoryAnalytics || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf2] flex items-center justify-center">
        <p className="text-xl font-semibold text-[#7a1f1f]">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf2] p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#7a1f1f]">
          Analytics Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Overview of Shree Ladli orders and business performance.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
          <p className="text-gray-500">
            Total Orders
          </p>

          <h2 className="text-3xl font-bold text-[#7a1f1f] mt-2">
            {totalOrders}
          </h2>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
          <p className="text-gray-500">
            Pending Orders
          </p>

          <h2 className="text-3xl font-bold text-orange-600 mt-2">
            {pendingOrders}
          </h2>
        </div>

        {/* Preparing Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
          <p className="text-gray-500">
            Preparing Orders
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {preparingOrders}
          </h2>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
          <p className="text-gray-500">
            Completed Orders
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {completedCount}
          </h2>
        </div>

      </div>

      {/* Total Revenue */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-orange-100">

        <p className="text-gray-500">
          Total Revenue from Orders
        </p>

        <h2 className="text-4xl font-bold text-[#7a1f1f] mt-2">
          ₹{totalRevenue.toLocaleString("en-IN")}
        </h2>

      </div>

      {/* Order Status Overview */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-orange-100">

        <h2 className="text-2xl font-bold text-[#7a1f1f] mb-6">
          Order Status Overview
        </h2>

        <div className="space-y-5">

          {/* Pending */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Pending</span>

              <span className="font-semibold">
                {pendingOrders}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full"
                style={{
                  width: `${
                    totalOrders
                      ? (pendingOrders / totalOrders) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Preparing */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Preparing</span>

              <span className="font-semibold">
                {preparingOrders}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{
                  width: `${
                    totalOrders
                      ? (preparingOrders / totalOrders) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Ready */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Ready</span>

              <span className="font-semibold">
                {readyOrders}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full"
                style={{
                  width: `${
                    totalOrders
                      ? (readyOrders / totalOrders) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Completed */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Completed</span>

              <span className="font-semibold">
                {completedCount}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{
                  width: `${
                    totalOrders
                      ? (completedCount / totalOrders) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

        </div>

      </div>

      {/* Category Overview */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-orange-100">

        <h2 className="text-2xl font-bold text-[#7a1f1f] mb-6">
          Category Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          {categoryAnalytics.map((item) => (
            <div
              key={item.category}
              className="border border-orange-100 rounded-xl p-5"
            >

              {/* Category Name */}
              <h3 className="font-bold text-lg text-[#7a1f1f]">
                {item.category}
              </h3>

              {/* Orders */}
              <p className="text-gray-500 mt-3">
                Orders
              </p>

              <p className="text-2xl font-bold mt-1">
                {item.orders}
              </p>

              {/* Revenue */}
              <p className="text-gray-500 mt-3">
                Revenue
              </p>

              <p className="text-2xl font-bold text-green-600 mt-1">
                ₹{Number(item.revenue || 0).toLocaleString("en-IN")}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Analytics;