"use client";

import api from "@/app/lib/api";

type UserDeleteProps = {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function UserDelete({
  user,
  onClose,
  onSuccess,
}: UserDeleteProps) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      // SOFT DELETE → isActive = false
      await api.put(
        `/users/${user.id}`,
        { isActive: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess(); // refresh users
      onClose();   // close modal
    } catch (error) {
      console.error("DELETE USER ERROR", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Delete User
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to deactivate this user?
          <br />
          <strong>{user.email}</strong>
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
