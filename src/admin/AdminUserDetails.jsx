import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import AdminNavbar from "../admin/AdminNavbar";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get(`/panel/users/${id}/`);

        if (!res.data) {
          toast.error("User not found");
          return;
        }

        // Map backend fields if needed (safe for custom user models)
        const mappedUser = {
          id: res.data.id,
          name: res.data.name || `${res.data.first_name || ""} ${res.data.last_name || ""}`.trim(),
          email: res.data.email,
          role: res.data.role || res.data.is_staff ? "admin" : "customer",
          isBlock: res.data.isBlock ?? res.data.is_block ?? false,
        };

        setUser(mappedUser);
        setOrders(res.data.orders || []);
      } catch (err) {
        toast.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center animate-pulse">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <AdminNavbar />

      <main className="flex-grow px-4 py-10 max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-400 hover:underline mb-6"
        >
          ← Back to Users
        </button>

        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
          {user.name}'s Profile
        </h2>

        {/* USER INFO */}
        <div className="bg-slate-800 p-6 rounded-xl shadow mb-10 space-y-2 text-sm sm:text-base">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={user.isBlock ? "text-red-400" : "text-green-400"}>
              {user.isBlock ? "Blocked" : "Active"}
            </span>
          </p>
        </div>

        {/* ORDER LIST */}
        <h3 className="text-2xl font-semibold mb-4">Order History</h3>

        {orders.length === 0 ? (
          <div className="text-slate-400">No orders found for this user.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-800 rounded-xl shadow overflow-hidden hover:scale-[1.01] transition-all"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between flex-wrap items-start mb-4 gap-2">
                    <div>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-lg font-semibold text-blue-400 hover:underline"
                      >
                        Order #{order.id}
                      </Link>
                      <p className="text-slate-400 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.order_status === "processing"
                          ? "bg-yellow-200 text-yellow-900"
                          : order.order_status === "shipped"
                          ? "bg-blue-200 text-blue-900"
                          : "bg-green-200 text-green-900"
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </div>

                  {/* ADDRESS */}
                  {order.address && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Shipping Address</h4>
                      <div className="text-slate-300 text-sm leading-relaxed">
                        <p>{order.address.full_name}</p>
                        <p>{order.address.phone}</p>
                        <p>{order.address.street}</p>
                        <p>
                          {order.address.city} - {order.address.pincode}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PAYMENT */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">Payment Method</h4>
                    <p className="text-slate-300">{order.payment_method}</p>
                    {order.payment_method === "UPI" && order.upiId && (
                      <p className="text-slate-400 text-sm">
                        UPI ID: {order.upiId}
                      </p>
                    )}
                  </div>

                  {/* ITEMS */}
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="divide-y divide-gray-700">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.product_name}
                              className="w-14 h-14 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-slate-400 text-sm">
                                Qty: {item.quantity || 1}
                              </p>
                            </div>
                          </div>

                          <div className="text-right font-medium">
                            ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="border-t border-slate-700 pt-4 flex justify-end">
                    <div className="text-right text-sm sm:text-base">
                      <p className="text-slate-300">
                        Subtotal:{" "}
                        <span className="font-medium">
                          ₹{Number(order.total_amount).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-slate-300">
                        Shipping: <span className="font-medium">Free</span>
                      </p>
                      <p className="text-lg font-bold mt-2">
                        Total: ₹{Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center text-sm p-4 bg-gray-950 text-slate-400 border-t border-slate-800">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">Souled Admin</span>.
        All rights reserved.
      </footer>
    </div>
  );
};

export default AdminUserDetails;

