
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email) {
      setMessage("Email address is missing. Please request a new OTP.");
      setMessageType("error");
      return;
    }

    if (otp.length !== 6) {
      setMessage("Please enter the 6-digit OTP.");
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
    const response = await fetch(
  `${API_BASE_URL}/api/forgot-password/reset-password`,
  {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to reset password.");
        setMessageType("error");
        return;
      }

      setMessage(
        "Password reset successfully! Redirecting to login..."
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/customer/login");
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage("Unable to connect to the server. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-amber-200 bg-[#fffdf8] px-4 py-3.5 text-gray-800 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-200 disabled:opacity-60";

  return (
    <div className="min-h-screen bg-[#fffaf0] flex items-center justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-amber-100">
        <div className="grid md:grid-cols-2">

          {/* Brand Banner */}
          <div className="relative min-h-[180px] sm:min-h-[230px] md:min-h-[580px] overflow-hidden bg-[#651c25] flex items-center justify-center p-6 sm:p-10">
            <img
              src="/images/sweets.jpg"
              alt="Shree Ladli traditional Indian sweets"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-[#4a1019]/80 via-[#651c25]/75 to-[#2b0b10]/90" />

            <div className="relative z-10 max-w-sm text-center text-white">
              <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-amber-300/70 bg-white/10 text-3xl text-amber-300">
                ✦
              </div>

              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                Shree Ladli
              </p>

              <h1 className="mt-3 text-3xl sm:text-4xl font-bold">
                A Fresh Start,
              </h1>

              <h2 className="text-3xl sm:text-4xl font-bold text-amber-300">
                A Sweet Return.
              </h2>

              <div className="mx-auto my-4 h-px w-20 bg-amber-300" />

              <p className="text-sm sm:text-base leading-relaxed text-amber-50/90">
                Create a new password securely and get back to enjoying
                your favourite treats.
              </p>
            </div>
          </div>

          {/* Reset Password Form */}
          <div className="flex items-center justify-center p-6 sm:p-10 md:p-12">
            <div className="w-full max-w-md">

              <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                Account Recovery
              </p>

              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[#651c25]">
                Reset Password
              </h2>

              <p className="mt-3 mb-7 text-sm sm:text-base leading-relaxed text-gray-500">
                Enter the OTP sent to your email and choose a new password.
              </p>

              {email && (
                <p className="mb-5 break-all rounded-xl bg-amber-50 px-4 py-3 text-sm text-gray-600">
                  Resetting password for: <span className="font-semibold text-[#651c25]">{email}</span>
                </p>
              )}

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mb-5 rounded-xl border p-3 text-sm ${
                    messageType === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    6-Digit OTP
                  </label>

                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    disabled={loading}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                      className={`${inputClass} pr-20`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 text-sm font-semibold text-[#651c25] hover:text-amber-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Use at least 6 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                      className={`${inputClass} pr-20`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-3 text-sm font-semibold text-[#651c25] hover:text-amber-700"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#651c25] px-4 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#4a1019] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>

              <div className="mt-7 text-center">
                <Link
                  to="/customer/login"
                  className="font-semibold text-[#651c25] transition hover:text-amber-700 hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>

              <div className="mt-8 border-t border-amber-100 pt-5 text-center">
                <p className="text-xs text-gray-400">
                  © {new Date().getFullYear()} Shree Ladli Sweets & Snacks
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
