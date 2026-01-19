"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/TopBar";
import ProductInventory from "./components/ProductInventory";
import Dashboard from "./components/Dashboard";
import AddToCart from "./components/AddToCart";
import Orders from "./components/Orders";

export default function UsersDashboard() {
  const [activeSection, setActiveSection] = useState<"users" | "dashboard">("dashboard");

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} />

      {/* Right Side */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header */}
        <Topbar />

        {/* Main Dynamic Content */}
        <main className="p-6">
          {activeSection === "dashboard" && <Dashboard/>}
          {activeSection === "products" && <ProductInventory />}
          {activeSection === "addtocart" && <AddToCart />}
          {activeSection === "orders" && <Orders />}
        </main>

      </div>
    </div>
  );
}
