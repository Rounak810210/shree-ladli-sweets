
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/forgot-password/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to send OTP.");
        return;
      }

      alert(data.message || "OTP sent successfully.");

      navigate("/reset-password", {
        state: {
          email: email.trim(),
        },
      });
    } catch (error) {
      console.error("Forgot password error:", error);

      alert(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] flex items-center justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-amber-100">
        <div className="grid md:grid-cols-2">

          {/* Brand Banner */}
          <div className="relative min-h-[180px] sm:min-h-[230px] md:min-h-[580px] bg-[#651c25] overflow-hidden flex items-center justify-center p-6 sm:p-10">
            {!imageFailed ? (
              <img
                src="/images/sweets.jpg"
                alt="Shree Ladli traditional Indian sweets"
                onError={() => setImageFailed(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-br from-[#4a1019]/80 via-[#651c25]/75 to-[#2b0b10]/90" />

            <div className="relative z-10 text-center text-white max-w-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-amber-300/70 bg-white/10 text-2xl sm:text-3xl text-amber-300">
                ✦
              </div>

              <p className="text-amber-300 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold">
                Shree Ladli
              </p>

              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-wide">
                Sweet Memories,
              </h1>

              <h2 className="text-3xl sm:text-4xl font-bold text-amber-300">
                Always.
              </h2>

              <div className="mx-auto my-4 h-px w-20 bg-amber-300" />

              <p className="text-sm sm:text-base text-amber-50/90 leading-relaxed">
                Your favourite sweets and snacks are just a step away.
                Let’s help you get back to your account.
              </p>
            </div>
          </div>

          {/* Forgot Password Form */}
          <div className="flex items-center justify-center p-6 sm:p-10 md:p-12">
            <div className="w-full max-w-md">

              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                  Account Recovery
                </p>

                <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[#651c25]">
                  Forgot Password?
                </h2>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-500">
                  No worries! Enter your registered email address and
                  we’ll send you an OTP to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-amber-200 bg-[#fffdf8] px-4 py-3.5 text-gray-800 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-200 disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#651c25] px-4 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#4a1019] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPassword;
