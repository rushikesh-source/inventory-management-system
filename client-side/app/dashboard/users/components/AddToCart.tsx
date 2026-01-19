"use client";

import api from "@/app/lib/api";
import { useEffect, useState } from "react";

const AddToCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  //  Checkout Handler (Purchase API)
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      setLoading(true);

      for (const item of cart) {
        await api.post("/inventory/purchase", {
          productId: item.id,
          quantity: item.quantity,
        });
      }

      alert("Purchase successful!");

      setCart([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.log("checkout error", error);
      alert(error?.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          Your cart is empty.
        </div>
      ) : (
        <>
          {/* Cart Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.category}
                  </p>

                  <p className="text-sm text-gray-700 mt-2">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <span className="text-lg font-bold text-indigo-600 block">
                    ₹{Number(item.price) * item.quantity}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Bar */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-900">
              Total: ₹{total}
            </span>

            <button
              disabled={loading}
              onClick={handleCheckout}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddToCart;
