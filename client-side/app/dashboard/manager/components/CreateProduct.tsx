"use client";

import api from "@/app/lib/api";
import { useState, ChangeEvent } from "react";

type CreateProductProps = {
  onClose: () => void;
  onSuccess: () => void;
};

type ProductForm = {
  name: string;
  productCode: string;
  price: string;
  description: string;
  category: string;
  status: "ACTIVE" | "INACTIVE";
};

export default function CreateProduct({
  onClose,
  onSuccess,
}: CreateProductProps) {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    productCode: "",
    price: "",
    description: "",
    category: "",
    status: "INACTIVE",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.productCode.trim() ||
      !form.price ||
      !form.category.trim() ||
      !form.description.trim()
    ) {
      setError("All fields are required");
      return false;
    }

    if (Number(form.price) <= 0) {
      setError("Price must be greater than 0");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/products",
        {
          name: form.name,
          productCode: form.productCode,
          price: Number(form.price),
          description: form.description,
          category: form.category,
          status: form.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess(); // refresh product list
      onClose();   // close modal
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err);
      setError("Failed to create product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        
        {/* Header */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Create Product
        </h3>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        {/* Inputs */}
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          name="productCode"
          placeholder="Product Code"
          value={form.productCode}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
