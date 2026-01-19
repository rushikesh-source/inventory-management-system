"use client";

import api from "@/app/lib/api";
import { useState } from "react";

export default function EditProduct({ product, onClose, onSuccess }: any) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/products/${product.id}`,
        {
          name,
          price: Number(price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white text-black rounded-xl p-6 w-96">
        <h3 className="text-lg font-bold mb-4">
          Edit Product
        </h3>

        <input
          className="border w-full mb-3 px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="border w-full mb-4 px-3 py-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
