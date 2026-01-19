"use client";

import api from "@/app/lib/api";
import { useEffect, useMemo, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import EditProduct from "./EditProduct";
import AddInventory from "./AddInventory";

export default function ProductInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [addInventoryProduct, setAddInventoryProduct] =
    useState<any | null>(null);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res?.data?.data?.data || []);
    } catch (error) {
      console.error("FETCH INVENTORY ERROR", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = item.product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const isActiveProduct = item.product.status === "ACTIVE";

      return matchesSearch && isActiveProduct;
    });
  }, [inventory, search]);

  return (
    <section className="bg-white text-black">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">
          Product Inventory (Staff)
        </h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full text-black"
        />
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl shadow p-5 text-black"
          >
            <h6 className="font-semibold">
              Product ID: {item.product.id}
            </h6>

            <h4 className="font-semibold text-lg">
              {item.product.name}
            </h4>

            <p>Price: ₹{item.product.price}</p>
            <p>Code: {item.product.productCode}</p>
            <p>Quantity: {item.quantity}</p>

            <p className="font-medium">
              Product Status:{" "}
              <span className="text-green-700">
                {item.product.status}
              </span>
            </p>

            <p className="font-medium">
              Stock Status:{" "}
              <span
                className={
                  item.quantity > 0
                    ? "text-blue-700"
                    : "text-gray-600"
                }
              >
                {item.quantity > 0
                  ? "IN_STOCK"
                  : "OUT_OF_STOCK"}
              </span>
            </p>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditProduct(item.product)}
                className="border px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-100"
              >
                <FiEdit /> Edit
              </button>

              <button
                onClick={() =>
                  setAddInventoryProduct(item.product)
                }
                className="border px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-100"
              >
                <FiPlus /> Add Inventory
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {editProduct && (
        <EditProduct
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={fetchInventory}
        />
      )}

      {addInventoryProduct && (
        <AddInventory
          product={addInventoryProduct}
          onClose={() => setAddInventoryProduct(null)}
          onSuccess={fetchInventory}
        />
      )}
    </section>
  );
}
