"use client";

import api from "@/app/lib/api";
import { useEffect, useMemo, useState } from "react";
import { FiEdit, FiTrash2, FiRefreshCcw } from "react-icons/fi";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

export default function ProductInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<any | null>(null);
  const [page,setPage]=useState(1)

  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null;

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/products?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res?.data?.data?.data || []);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

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

  //  ACTIVATE PRODUCT (SUPER_ADMIN)
  const activateProduct = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/products/${id}/status`,
        { status: "ACTIVE" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchProducts();
    } catch (error) {
      console.error("ACTIVATE PRODUCT ERROR", error);
    }
  };

// here cheking for pagination

const handleClick=()=>{
  console.log("page value and responce ",page);
  
}


  return (
    <section>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-black text-2xl font-bold">
          Product Inventory (Super Admin)
        </h2>

        {role === "SUPER_ADMIN" && (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 text-black">
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

            <p
              className={`font-medium ${
                item.status === "ACTIVE"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Status: {item.status}
            </p>

            {role === "SUPER_ADMIN" && (
              <div className="flex gap-4 mt-4">
                {/* ACTIVE → Edit & Delete */}
                {item.status === "ACTIVE" && (
                  <>
                    <button
                      onClick={() => setEditProduct(item)}
                      className="text-blue-600 flex items-center gap-1"
                    >
                      <FiEdit /> Edit
                    </button>

                    <button
                      onClick={() => setDeleteProduct(item)}
                      className="text-red-600 flex items-center gap-1"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </>
                )}

                {/* INACTIVE → Activate */}
                {item.status === "INACTIVE" && (
                  <button
                    onClick={() => activateProduct(item.id)}
                    className="text-green-600 flex items-center gap-1"
                  >
                    <FiRefreshCcw /> Activate
                  </button>
                )}
              </div>
            )}
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

      {deleteProduct && (
        <DeleteProduct
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onSuccess={fetchProducts}
        />
      )}


      <button   className="text-black" onClick={()=>setPage(page+1)}>
        
        next
        </button>
      <button   className="text-black" onClick={handleClick}>
        
        next for console
        </button>
      <br />
      <button className="text-black" disabled={page===1} onClick={()=>setPage(page-1)}>prev</button>
    </section>
  );
}
