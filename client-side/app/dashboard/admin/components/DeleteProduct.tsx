"use client";

import api from "@/app/lib/api";

export default function DeleteProduct({
  product,
  onClose,
  onSuccess,
}: any) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ DELETE = STATUS INACTIVE
      await api.patch(
        `/products/${product.id}/status`,
        { status: "INACTIVE" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("DELETE PRODUCT ERROR", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="text-lg font-bold mb-4 text-red-600">
          Delete Product
        </h3>

        <p className="mb-6 text-black">
          Are you sure you want to delete{" "}
          <strong>{product.name}</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-black"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
