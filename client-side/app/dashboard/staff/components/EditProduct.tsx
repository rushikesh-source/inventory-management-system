"use client";

import api from "@/app/lib/api";
import { useState } from "react";

export default function EditProduct({
  product,
  onClose,
  onSuccess,
}: {
  product: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/products/${product.id}`,
        { name, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md text-black">
        <h3 className="text-xl font-bold mb-4">
          Edit Product
        </h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full px-3 py-2 rounded mb-3 text-black"
          placeholder="Product name"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border w-full px-3 py-2 rounded mb-4 text-black"
          placeholder="Price"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded text-black"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
