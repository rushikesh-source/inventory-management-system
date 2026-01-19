"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/TopBar";
import UsersManagement from "./components/UsersManagement";
import ProductInventory from "./components/ProductInventory";
import Orders from "./components/Orders";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";

export default function ManagerDashboard() {
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
          {activeSection === "users" && <UsersManagement />}
          {activeSection === "products" && <ProductInventory />}
          {activeSection === "orders" && <Orders/>}
          {activeSection === "inventory" && <Inventory/>}
        </main>

      </div>
    </div>
  );
}
