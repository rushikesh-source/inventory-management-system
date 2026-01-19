"use client";

import api from "@/app/lib/api";
import { useEffect, useMemo, useState } from "react";
import CreateUser from "./CreateUser";

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  // Filters (ONLY search + role)
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   *  Manager Enforcement
   * - ONLY active users
   * - Read-only access
   */
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => user.isActive) // HARD RULE: ACTIVE ONLY
      .filter((user) => {
        const matchesSearch =
          search === "" ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.id.toString().includes(search);

        const matchesRole = role === "" || user.role === role;

        return matchesSearch && matchesRole;
      });
  }, [users, search, role]);

  return (
    <section className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Users Management
        </h2>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Create User
        </button>
      </div>

      {/* filter */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by ID or Email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          >
            <option value="">All Roles</option>
            {/* <option value="ADMIN">ADMIN</option> */}
            <option value="USER">USER</option>
            {/* <option value="MANAGER">MANAGER</option> */}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setRole("");
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table (READ-ONLY) */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.id}
                </td>

                <td className="px-6 py-4 text-gray-800">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Active
                  </span>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No active users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <CreateUser
          onClose={() => setShowCreate(false)}
          onSuccess={fetchUsers}
        />
      )}
    </section>
  );
}
