import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import { Eye, Ban, CheckCircle, Trash2 } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: "" });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/panel/users/");
      console.log("USERS:", res.data);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    }
  };

  const toggleBlock = async (id) => {
    try {
      const res = await api.post(`/panel/users/${id}/toggle-block/`);
      
      // Update local state immediately instead of refetching all users
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, isBlock: res.data.isBlock } : user
        )
      );
      
      toast.success(
        res.data.isBlock ? "User blocked successfully" : "User unblocked successfully"
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user status");
    }
  };

  const openDeleteModal = (userId, userName) => {
    setDeleteModal({ show: true, userId, userName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, userId: null, userName: "" });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/panel/users/${deleteModal.userId}/delete/`);
      toast.success("User deleted successfully");
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== deleteModal.userId));
      closeDeleteModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <AdminNavbar />

      <main className="flex-grow p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>

        <div className="overflow-x-auto rounded-xl bg-slate-800 shadow-inner">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="bg-slate-700 text-slate-300 uppercase">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-700 hover:bg-slate-700/40 transition-colors"
                >
                  <td className="p-4">{user.name || "No Name"}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 capitalize">{user.role || "customer"}</td>
                  <td className="p-4">
                    <span
                      className={`font-medium ${
                        user.isBlock ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {user.isBlock ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="p-4 flex justify-center items-center gap-4 flex-wrap">
                    {/* View */}
                    <button
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      aria-label="View User"
                      className="hover:scale-110 transition-transform"
                    >
                      <Eye className="w-5 h-5 text-blue-400 hover:text-blue-300" />
                    </button>

                    {/* Block / Unblock */}
                    <button
                      onClick={() => toggleBlock(user.id)}
                      aria-label={user.isBlock ? "Unblock User" : "Block User"}
                      className="hover:scale-110 transition-transform"
                    >
                      {user.isBlock ? (
                        <CheckCircle className="w-5 h-5 text-green-400 hover:text-green-300" />
                      ) : (
                        <Ban className="w-5 h-5 text-yellow-400 hover:text-yellow-300" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => openDeleteModal(user.id, user.name || user.email)}
                      aria-label="Delete User"
                      className="hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-5 h-5 text-red-400 hover:text-red-300" />
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full p-6 animate-scaleIn">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/10 p-4 rounded-full">
                <Trash2 className="w-12 h-12 text-red-500" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-center mb-2 text-white">
              Delete User?
            </h3>

            {/* Message */}
            <p className="text-slate-300 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-400">{deleteModal.userName}</span>?
              <br />
              <span className="text-sm text-slate-400">This action cannot be undone.</span>
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-sm p-4 bg-slate-900 text-slate-400 border-t border-slate-800">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">Souled Admin</span>. All rights
        reserved.
      </footer>
    </div>
  );
};

export default AdminUsers;

// Add these styles to your global CSS or index.css:
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.9);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}
*/

