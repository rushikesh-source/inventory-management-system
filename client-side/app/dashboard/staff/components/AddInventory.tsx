"use client";

import api from "@/app/lib/api";
import { useState } from "react";

export default function AddInventory({
  product,
  onClose,
  onSuccess,
}: {
  product: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [quantity, setQuantity] = useState("");

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/inventory/add",
        {
          productId: product.id,
          quantity: Number(quantity),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("ADD INVENTORY ERROR", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96 text-black">
        <h3 className="font-bold mb-4">
          Add Inventory – {product.name}
        </h3>

        <input
          type="number"
          min={1}
          className="border w-full px-3 py-2 rounded mb-4 text-black"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded text-black"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
}
