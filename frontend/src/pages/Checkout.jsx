
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API_BASE_URL from "../config/api";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  const deliveryCharge = cartItems.length > 0 ? 50 : 0;

  const getPrice = (price) => {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      return Number(price.replace(/[^\d.]/g, "")) || 0;
    }
    return 0;
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + getPrice(item.price) * item.quantity,
    0
  );

  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (loading) return;

    const customerToken = localStorage.getItem("customerToken");

    if (!customerToken) {
      alert("Please login to place an order.");
      navigate("/customer/login");
      return;
    }

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (!city.trim()) {
      alert("Please enter your city.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/menu");
      return;
    }

    const orderId = "SL" + Date.now();

    const order = {
      orderId,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      },
      items: cartItems.map((item) => ({
        id: item._id,
        name: item.name,
        category: item.category,
        price: getPrice(item.price),
        unit: item.unit,
        quantity: item.quantity,
        image: item.image,
        status: "Pending",
      })),
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      paymentStatus:
        paymentMethod === "UPI Payment"
          ? "Verification Required"
          : "Pending",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to place order.");
        return;
      }

      clearCart();

      navigate(
        `/order-confirmation?orderId=${encodeURIComponent(
          data.order.orderId
        )}`
      );
    } catch (error) {
      console.error("Place order error:", error);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full min-w-0 rounded-xl border border-orange-200 bg-white px-4 py-3 text-base text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

  return (
    <section className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[4px] text-orange-600 sm:text-sm sm:tracking-[5px]">
            Secure Checkout
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:mt-4 sm:text-4xl">
            Complete Your Order
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
            Enter your delivery details and choose how you would like to pay.
          </p>
        </header>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg sm:p-12">
            <p className="text-5xl" aria-hidden="true">🛒</p>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>
            <p className="mt-2 text-gray-500">
              Add something delicious before checking out.
            </p>
            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="mt-6 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">

            {/* Customer and Payment Form */}
            <div className="min-w-0 rounded-2xl border border-orange-100 bg-white p-4 shadow-lg sm:rounded-3xl sm:p-7 lg:p-8">

              <h2 className="mb-5 text-xl font-bold text-gray-800 sm:mb-6 sm:text-2xl">
                <span className="mr-2">📍</span>
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
                  <label htmlFor="customer-name" className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customer-phone" className="mb-2 block text-sm font-semibold text-gray-700">
                    Mobile Number
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={inputClass}
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="delivery-address" className="mb-2 block text-sm font-semibold text-gray-700">
                  Complete Delivery Address
                </label>
                <textarea
                  id="delivery-address"
                  placeholder="House number, street, area, landmark..."
                  rows={3}
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`${inputClass} resize-y`}
                  required
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
                  <label htmlFor="delivery-city" className="mb-2 block text-sm font-semibold text-gray-700">
                    City
                  </label>
                  <input
                    id="delivery-city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="delivery-pincode" className="mb-2 block text-sm font-semibold text-gray-700">
                    PIN Code
                  </label>
                  <input
                    id="delivery-pincode"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="6-digit PIN code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className={inputClass}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {/* Delivery Preview */}
              <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4 sm:p-5">
                <h3 className="font-bold text-gray-800">
                  Delivery Address Preview
                </h3>
                <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                  {address.trim() || "Your address will appear here"}
                </p>
                <p className="mt-1 break-words text-sm text-gray-600">
                  {[city.trim(), pincode.trim()].filter(Boolean).join(", ") ||
                    "City and PIN code"}
                </p>
              </div>

              {/* Payment Methods */}
              <h2 className="mb-4 mt-8 text-xl font-bold text-gray-800 sm:text-2xl">
                <span className="mr-2">💳</span>
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                  paymentMethod === "Cash on Delivery"
                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200"
                    : "border-gray-200 hover:border-orange-300"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 accent-orange-600"
                  />
                  <div>
                    <p className="font-bold text-gray-800">
                      Cash on Delivery
                    </p>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Pay when your order is delivered.
                    </p>
                  </div>
                </label>

                <label className={`block cursor-pointer rounded-2xl border p-4 transition ${
                  paymentMethod === "UPI Payment"
                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200"
                    : "border-gray-200 hover:border-orange-300"
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="UPI Payment"
                      checked={paymentMethod === "UPI Payment"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 h-4 w-4 accent-orange-600"
                    />
                    <div>
                      <p className="font-bold text-gray-800">
                        UPI / QR Payment
                      </p>
                      <p className="mt-1 text-sm leading-5 text-gray-500">
                        Scan the QR code using your preferred UPI app.
                      </p>
                    </div>
                  </div>

                  {paymentMethod === "UPI Payment" && (
                    <div className="mt-5 border-t border-orange-100 pt-5 text-center">
                      <img
                        src="/payment-qr.jpg"
                        alt="UPI payment QR code"
                        className="mx-auto aspect-square w-48 max-w-full rounded-xl border border-orange-200 bg-white object-contain p-2 sm:w-56"
                      />

                      <p className="mt-4 font-bold text-gray-800">
                        Scan to Pay ₹{total}
                      </p>
                      <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-gray-500">
                        Use Google Pay, PhonePe, Paytm or another UPI app.
                        Your payment will require verification.
                      </p>
                      <p className="mt-2 text-xs leading-5 text-orange-700">
                        After paying, place your order and keep your payment
                        confirmation for reference.
                      </p>
                    </div>
                  )}
                </label>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                UPI payment is manually verified. Placing an order does not
                automatically confirm that payment has been received.
              </p>
            </div>

            {/* Order Summary */}
            <aside className="min-w-0 rounded-2xl border border-orange-100 bg-white p-5 shadow-lg sm:rounded-3xl sm:p-7 lg:sticky lg:top-28">
              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                Order Summary
              </h2>

              <div className="mt-5 max-h-64 space-y-4 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-gray-800">
                      ₹{getPrice(item.price) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex justify-between gap-3 text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ₹{subtotal}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-3 text-sm text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-gray-800">
                  ₹{deliveryCharge}
                </span>
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-bold text-gray-800">
                  Grand Total
                </span>
                <span className="text-2xl font-extrabold text-orange-600">
                  ₹{total}
                </span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-4 font-bold text-white shadow-md transition hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Placing Order..."
                  : paymentMethod === "UPI Payment"
                  ? "I Have Completed Payment"
                  : "Place Order"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/menu")}
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-orange-200 px-4 py-3 font-semibold text-orange-700 transition hover:bg-orange-50 disabled:opacity-50"
              >
                ← Continue Shopping
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                Please check your delivery details before placing your order.
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default Checkout;
