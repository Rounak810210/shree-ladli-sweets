import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-28">

      <div className="max-w-2xl mx-auto px-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-6xl mb-6">
            🎉
          </div>

          <p className="uppercase tracking-[5px] text-orange-500 font-semibold">
            Order Confirmed
          </p>

          <h1 className="text-4xl font-bold mt-4 text-gray-800">
            Thank You For Your Order!
          </h1>

          <p className="text-gray-500 mt-5">
            Your order has been successfully placed.
          </p>

          <div className="bg-orange-50 rounded-2xl p-5 mt-8">

            <p className="text-gray-500">
              Order ID
            </p>

            <p className="text-xl font-bold text-orange-600 mt-2">
              #SL{Math.floor(Math.random() * 90000) + 10000}
            </p>

          </div>

          <p className="text-gray-600 mt-6">
            We will contact you shortly regarding your order.
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="mt-8 px-8 py-4 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </section>
  );
}

export default OrderSuccess;