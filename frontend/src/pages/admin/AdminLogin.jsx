import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    alert("Please enter email and password.");
    return;
  }

  try {
    const response = await fetch(
  `${API_BASE_URL}/api/admin/login`,
  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid email or password.");
      return;
    }

    localStorage.setItem(
      "adminToken",
      data.token
    );

    localStorage.setItem(
      "shreeLadliAdmin",
      JSON.stringify(data.admin)
    );

    navigate("/admin/dashboard");
  } catch (error) {
    console.error("Admin login error:", error);

    alert(
      "Unable to connect to the server. Please try again."
    );
  }
};

  return (
    <section className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-6 py-20">

      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">

          <div className="text-5xl mb-4">
            🍬
          </div>

          <p className="uppercase tracking-[4px] text-orange-500 font-semibold text-sm">
            Shree Ladli
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-3">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-3">
            Login to manage your shop
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8">

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="mb-5">

              <label className="block font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-orange-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              />

            </div>

            {/* Password */}
            <div className="mb-6">

              <label className="block font-semibold text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-orange-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              />

            </div>

            {/* Login */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
            >
              Login to Admin Panel →
            </button>

          </form>

          {/* Demo Accounts */}
          <div className="mt-8 border-t border-orange-100 pt-6">

            <p className="text-sm font-semibold text-gray-700 mb-4">
              Demo Login Accounts
            </p>

            <div className="text-xs text-gray-500 space-y-3">

              <div>
                <p className="font-semibold text-gray-700">
                  👑 Owner Admin
                </p>
                <p>
                  owner@shreeladli.com / owner123
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  🍬 Sweets Admin
                </p>
                <p>
                  sweets@shreeladli.com / sweets123
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  🍟 Fast Food Admin
                </p>
                <p>
                  fastfood@shreeladli.com / fastfood123
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  🥟 Snacks Admin
                </p>
                <p>
                  snacks@shreeladli.com / snacks123
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  🥤 Beverages Admin
                </p>
                <p>
                  beverages@shreeladli.com / beverages123
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default AdminLogin;