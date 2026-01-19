"use client";

import api from "@/app/lib/api";
import { useState, ChangeEvent, FormEvent } from "react";

type CreateUserProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateUser({
  onClose,
  onSuccess,
}: CreateUserProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Frontend validation (same as DTO)
    if (!form.name || form.name.trim().length < 2) {
      return setError("Name must be at least 2 characters");
    }

    if (!form.email) {
      return setError("Email is required");
    }

    if (
      !form.password ||
      form.password.length < 6 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)
    ) {
      return setError(
        "Password must contain uppercase, lowercase and number",
      );
    }

    if (!form.role) {
      return setError("Role is required");
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/users/create",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create user",
      );
    }
  };

  return (
    <div className="fixed  inset-0 text-black flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">
          Create User
        </h3>

        {error && (
          <p className="text-red-600 text-sm mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-3"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-6"
          >
            <option value="">Select Role</option>
            {/* <option value="ADMIN">ADMIN</option> */}
            <option value="MANAGER">MANAGER</option>
            <option value="STAFF">STAFF</option>
            <option value="USER">USER</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600  text-black"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
