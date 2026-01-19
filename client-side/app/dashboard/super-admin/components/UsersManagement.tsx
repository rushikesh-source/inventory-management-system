"use client";

import api from "@/app/lib/api";
import { useEffect, useMemo, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import UserEdit from "./UserEdit";
import UserDelete from "./UserDelete";
import CreateUser from "./CreateUser";

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [deleteUser, setDeleteUser] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toString().includes(search);

      const matchesRole = role === "" || user.role === role;

      const matchesStatus =
        status === "" ||
        (status === "ACTIVE" && user.isActive) ||
        (status === "INACTIVE" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  return (
    <section className="p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Users Management
        </h2>

        <button
          onClick={() => {
            console.log("CREATE USER CLICKED");
            setShowCreate(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Create User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
            <option value="MANAGER">MANAGER</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setRole("");
              setStatus("");
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
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
                  {user.isActive ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      title="Edit User"
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => setEditUser(user)}
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      title="Delete User"
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => setDeleteUser(user)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {editUser && (
        <UserEdit
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={fetchUsers}
        />
      )}

      {deleteUser && (
        <UserDelete
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onSuccess={fetchUsers}
        />
      )}

      {/* ✅ THIS WAS MISSING */}
      {showCreate && (
        <CreateUser
          onClose={() => setShowCreate(false)}
          onSuccess={fetchUsers}
        />
      )}
    </section>
  );
}
