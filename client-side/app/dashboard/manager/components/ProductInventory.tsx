"use client";

import api from "@/app/lib/api";
import { useEffect, useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";

export default function ProductInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null;

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res?.data?.data?.data || []);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Product status update (ACTIVE / INACTIVE)
   * Manager CAN toggle lifecycle
   */
  const updateProductStatus = async (
    productId: number,
    status: "ACTIVE" | "INACTIVE"
  ) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/products/${productId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchProducts();
    } catch (error) {
      console.error("UPDATE PRODUCT STATUS ERROR", error);
    }
  };

  /**
   * Filtering
   * - Search by name
   * - Optional product status filter
   */
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = item.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = status
        ? item.status === status
        : true;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, status]);

  return (
    <section>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-black text-2xl font-bold">
          Product Inventory (Manager)
        </h2>

        {/* Manager CAN create */}
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl shadow p-5"
          >
            <h6 className="text-black font-semibold">
              ID: {item.id}
            </h6>

            <h4 className="text-black font-semibold">
              {item.name}
            </h4>

            <p className="text-black">Price: ₹{item.price}</p>

            <p className="text-black">
              Code: {item.productCode}
            </p>

            {/* Status Badge */}
            <p
              className={`font-medium ${
                item.status === "ACTIVE"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Status: {item.status}
            </p>

            {/* Manager Actions */}
            <div className="flex gap-4 mt-4">
              {/* Edit */}
              <button
                onClick={() => setEditProduct(item)}
                className="text-blue-600 flex items-center gap-1"
              >
                <FiEdit /> Edit
              </button>

              {/* Activate / Inactivate */}
              {item.status === "ACTIVE" ? (
                <button
                  onClick={() =>
                    updateProductStatus(item.id, "INACTIVE")
                  }
                  className="text-red-600 font-medium"
                >
                  Inactivate
                </button>
              ) : (
                <button
                  onClick={() =>
                    updateProductStatus(item.id, "ACTIVE")
                  }
                  className="text-green-600 font-medium"
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateProduct
          onClose={() => setShowCreate(false)}
          onSuccess={fetchProducts}
        />
      )}

      {editProduct && (
        <EditProduct
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={fetchProducts}
        />
      )}
    </section>
  );
}
