"use client";

import api from "@/app/lib/api";
import { useState, ChangeEvent } from "react";

type UserEditProps = {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function UserEdit({
  user,
  onClose,
  onSuccess,
}: UserEditProps) {
  const [form, setForm] = useState({
    role: user.role,
    isActive: user.isActive,
  });

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/users/${user.id}`,
        {
          role: form.role,
          isActive: form.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess(); // refresh users
      onClose();   // close modal
    } catch (error) {
      console.error("UPDATE USER ERROR", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md text-black rounded-lg p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">
          Edit User
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          {user.email}
        </p>

        {/* Role */}
        <label className="block mb-2 text-sm font-medium">
          Role
        </label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="STAFF">STAFF</option>
          <option value="USER">USER</option>
        </select>

        {/* Status */}
        <label className="block mb-2 text-sm font-medium">
          Status
        </label>
        <select
          name="isActive"
          value={String(form.isActive)}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-6"
        >
          <option value="true">ACTIVE</option>
          <option value="false">INACTIVE</option>
        </select>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
