"use client";

import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const ProductInventory = () => {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  
  const token=localStorage.getItem("token")
  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products",{
        headers:{
          Authorization:token
        }
      });
      const products = res?.data?.data?.data || [];
      const userProducts= res.data
        console.log("userProducts",userProducts);
        
      setData(products);

      const qtyMap = {};
      products.forEach((p) => {
        qtyMap[p.id] = 1;
      });
      setQuantities(qtyMap);
    } catch (error) {
      console.log("fetch product error", error);
    }
  };

  // Load cart from localStorage
  useEffect(() => {
    fetchProducts();
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Filters
  const filteredData = data.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesMin =
      minPrice === "" || Number(item.price) >= Number(minPrice);

    const matchesMax =
      maxPrice === "" || Number(item.price) <= Number(maxPrice);

    return matchesSearch && matchesMin && matchesMax;
  });

  //  Add to Cart Handler
  const handleAddToCart = (product) => {
    const qty = Number(quantities[product.id]) || 1;

    const updatedCart = (() => {
      const existing = cart.find((p) => p.id === product.id);

      if (existing) {
        return cart.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + qty }
            : p
        );
      }

      return [...cart, { ...product, quantity: qty }];
    })();

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    console.log(cart);
    
  };

const handleBuyNow = (item) => {
  const product = item.product ?? item; 

  if (!product?.id) {
    console.error("Invalid item passed to handleBuyNow:", item);
    alert("❌ Product data is corrupted. Please refresh.");
    return;
  }

  const qty = Number(quantities[product.id]) || 1;

  const availableStock =
    typeof item.quantity === "number" ? item.quantity : Infinity; // fallback if no inventory layer

  // 1. Stock governance
  if (availableStock < qty) {
    alert("❌ Insufficient stock. Please reduce quantity or try later.");
    return;
  }

  // 2. Build order payload
  const newOrder = {
    orderId: Date.now(),
    productId: product.id,
    name: product.name,
    price: Number(product.price),
    quantity: qty,
    total: Number(product.price) * qty,
    status: "PLACED",
    orderedAt: new Date().toISOString(),
  };

  // here am getting product from local storage 
  const existingOrders =
    JSON.parse(localStorage.getItem("orders") || "[]");

  const updatedOrders = [...existingOrders, newOrder];
  localStorage.setItem("orders", JSON.stringify(updatedOrders));

  alert(" Order placed successfully");

};




  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Product Inventory
      </h1>

      {/* Filters */}
      <div className="bg-white p-4 text-black rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          onClick={() => {
            setSearch("");
            setMinPrice("");
            setMaxPrice("");
          }}
          className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
        >
          Reset
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between"
          >
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {item.name}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {item.category}
              </p>

              <p className="text-gray-700 text-sm mt-3 line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <span className="text-xl font-bold text-indigo-600 block">
                ₹{item.price}
              </span>
              <label className="text-black">Quantity:</label>
              <input 
                type="number"
                min={1}
                value={quantities[item.id] || 1}
                onChange={(e) =>
                  setQuantities((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              {/* CTA Row */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handleBuyNow(item)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInventory;
