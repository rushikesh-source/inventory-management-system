"use client";
import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(stored);
  }, []);

  if (!orders.length) {
    return <div className="p-6 text-gray-500">No orders yet.</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.orderId}
          className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{order.name}</p>
            <p className="text-sm text-gray-500">
              Qty: {order.quantity} • Price: ₹{order.price}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(order.orderedAt).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">₹{order.total}</p>
            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
