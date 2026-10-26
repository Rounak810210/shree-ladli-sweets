
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

function CustomerLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed. Please try again.");
        setMessageType("error");
        return;
      }

      if (data.accountType === "customer") {
        localStorage.setItem("customerToken", data.token);
        localStorage.setItem("customer", JSON.stringify(data.customer));

        setMessage("Welcome back! Taking you to Shree Ladli...");
        setMessageType("success");

        setTimeout(() => navigate("/"), 800);
        return;
      }

      if (data.accountType === "admin") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("shreeLadliAdmin", JSON.stringify(data.admin));

        setMessage("Admin login successful. Opening dashboard...");
        setMessageType("success");

        setTimeout(() => navigate("/admin/dashboard"), 800);
        return;
      }

      setMessage("Unknown account type. Please contact support.");
      setMessageType("error");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to the server. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-start justify-center overflow-hidden bg-[#f7efdf] px-3 py-4 sm:items-center sm:px-6 sm:py-8 lg:px-10 lg:py-12">
      {/* Traditional patterned background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #a98548 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl overflow-hidden rounded-[22px] border border-[#d7bd88] bg-[#fffdf7] shadow-[0_24px_70px_rgba(79,35,25,0.16)] sm:rounded-[28px] lg:min-h-[700px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand panel */}
        <section className="relative flex min-h-[235px] flex-col overflow-hidden bg-[#531620] text-[#fff8e9] sm:min-h-[310px] lg:min-h-[700px]">
          {/* Sweets photograph */}
          {!imageFailed && (
            <img
              src="/images/sweets.jpg"
              alt="Traditional Indian sweets at Shree Ladli"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#421019]/90 via-[#531620]/65 to-[#300b12]/95" />

          {/* Fallback background */}
          {imageFailed && (
            <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#531620] via-[#70212c] to-[#3c1018]">
              <div className="absolute -right-10 top-10 h-52 w-52 rounded-full border border-[#d8b76e]/40 sm:top-20 sm:h-72 sm:w-72" />
              <div className="absolute -right-2 top-16 h-40 w-40 rounded-full border border-[#d8b76e]/30 sm:top-28 sm:h-56 sm:w-56" />
              <div className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full border border-[#d8b76e]/30 sm:h-80 sm:w-80" />
            </div>
          )}

          {/* Decorative borders */}
          <div className="pointer-events-none absolute inset-2 rounded-[16px] border border-[#e1c17b]/60 sm:inset-3 sm:rounded-[21px]" />
          <div className="pointer-events-none absolute inset-4 rounded-[13px] border border-[#e1c17b]/20 sm:inset-5 sm:rounded-[17px]" />

          <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-8 lg:justify-between lg:p-12 xl:p-14">
            {/* Brand logo */}
            <Link to="/" className="inline-flex items-center gap-3 self-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4c47c] bg-[#fff4dc] font-serif text-lg font-bold text-[#641923] shadow-lg sm:h-14 sm:w-14 sm:text-xl lg:h-16 lg:w-16 lg:text-2xl">
                SL
              </div>

              <div>
                <p className="font-serif text-lg font-bold tracking-wide text-[#fff7e7] sm:text-xl lg:text-2xl">
                  Shree Ladli
                </p>
                <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-[#e8c77e] sm:text-[10px] sm:tracking-[0.25em]">
                  Sweets & Snacks
                </p>
              </div>
            </Link>

            {/* Main message */}
            <div className="mt-5 max-w-lg sm:mt-8 lg:mt-16">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#e7c579] sm:text-xs sm:tracking-[0.28em]">
                The Taste of Tradition
              </p>

              <h1 className="mt-2 font-serif text-[28px] font-bold leading-tight sm:mt-4 sm:text-4xl sm:leading-[1.15] lg:text-6xl xl:text-7xl">
                A little mithai,
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                a lot of{" "}
                <span className="italic text-[#edce8a]">happiness.</span>
              </h1>

              <div className="my-3 flex items-center gap-3 sm:my-5 lg:my-6">
                <span className="h-px w-8 bg-[#d9b568] sm:w-12" />
                <span className="text-sm text-[#e5c783] sm:text-lg">✦</span>
                <span className="h-px w-8 bg-[#d9b568] sm:w-12" />
              </div>

              {/* Keep the long description for larger screens */}
              <p className="hidden max-w-md text-sm leading-7 text-[#f5e8d5] sm:block sm:leading-8 lg:text-base">
                From cherished family recipes to your favourite sweets, bring
                home the flavours that make every occasion special.
              </p>
            </div>

            {/* Traditional message card: tablet and desktop */}
            <div className="mt-8 hidden rounded-2xl border border-[#e3c37e]/50 bg-[#371018]/75 p-5 backdrop-blur-md sm:block sm:p-6 lg:mt-10">
              <p className="font-serif text-lg font-semibold text-[#f1d69a] sm:text-xl">
                मिठास हर रिश्ते में
              </p>

              <p className="mt-2 text-sm leading-6 text-[#f8ead8]">
                Made for celebrations, shared with love.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-[0.13em] text-[#e4c37e] sm:text-xs">
                <span>✦ TRADITION</span>
                <span>·</span>
                <span>QUALITY</span>
                <span>·</span>
                <span>HAPPINESS ✦</span>
              </div>
            </div>
          </div>
        </section>

        {/* Login form */}
        <section className="relative flex items-center justify-center bg-[#fffdf7] px-5 py-7 sm:px-9 sm:py-10 lg:px-14 lg:py-12 xl:px-16">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#786b60] transition hover:text-[#761d2b] sm:text-sm"
            >
              <span aria-hidden="true">←</span>
              Back to Home
            </Link>

            <div className="mb-5 mt-6 sm:mb-8 sm:mt-9 lg:mt-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a47b37] sm:text-xs">
                Welcome Back
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold text-[#451720] sm:mt-3 sm:text-4xl lg:text-5xl">
                Sign in
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#786d63] sm:mt-4 sm:text-base sm:leading-7">
                Sign in to order your favourites and keep track of your sweet
                moments.
              </p>

              <div className="mt-4 flex items-center gap-2 sm:mt-6">
                <span className="h-[2px] w-8 bg-[#b38b45] sm:w-10" />
                <span className="text-xs text-[#b38b45]">✦</span>
                <span className="h-px w-6 bg-[#e4d4b5]" />
              </div>
            </div>

            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`mb-4 rounded-xl border p-3 text-sm leading-6 sm:mb-5 sm:p-4 ${
                  messageType === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-[#4d3532]"
                >
                  Email Address
                </label>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-[#e4d9c6] bg-white px-4 py-3 text-sm text-[#392a28] outline-none transition placeholder:text-[#b2a69b] focus:border-[#a47b37] focus:ring-4 focus:ring-[#b38b45]/10 sm:py-4"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-semibold text-[#4d3532]"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#8c2936] transition hover:text-[#5b1721] hover:underline sm:text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="flex overflow-hidden rounded-xl border border-[#e4d9c6] bg-white transition focus-within:border-[#a47b37] focus-within:ring-4 focus-within:ring-[#b38b45]/10">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full min-w-0 px-4 py-3 text-sm text-[#392a28] outline-none placeholder:text-[#b2a69b] sm:py-4"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 border-l border-[#eee4d4] px-3 text-xs font-semibold text-[#812631] transition hover:bg-[#faf3e7] sm:px-4"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-3 rounded-xl border border-[#a87b38] bg-[#681c29] px-5 py-3.5 font-bold text-[#fff7e8] shadow-lg shadow-[#5b1721]/15 transition hover:-translate-y-0.5 hover:bg-[#50141f] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:py-4"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 sm:my-8">
              <span className="h-px flex-1 bg-[#eadfce]" />
              <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.12em] text-[#a39481] sm:text-[10px] sm:tracking-[0.15em]">
                New to Shree Ladli?
              </span>
              <span className="h-px flex-1 bg-[#eadfce]" />
            </div>

            <p className="text-center text-xs text-[#786d63] sm:text-sm">
              Don't have an account?{" "}
              <Link
                to="/customer/register"
                className="font-bold text-[#812631] transition hover:text-[#50141f] hover:underline"
              >
                Create Account
              </Link>
            </p>

            <div className="mt-6 border-t border-[#eee3d1] pt-4 text-center sm:mt-9 sm:pt-6">
              <p className="font-serif text-sm italic text-[#a18b6b]">
                "Every sweet tells a story."
              </p>

              <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-[#b2a28b] sm:text-[10px] sm:tracking-[0.2em]">
                Shree Ladli Sweets & Snacks
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CustomerLogin;
