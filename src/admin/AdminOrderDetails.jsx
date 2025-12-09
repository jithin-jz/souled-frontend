import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}/`);
      setOrder(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (statusType, newValue) => {
    try {
      const updateData = {};
      updateData[statusType] = newValue;
      
      await api.patch(`/orders/${id}/status/`, updateData);
      
      setOrder((prev) => ({ ...prev, [statusType]: newValue }));
      toast.success("Status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center animate-pulse">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <AdminNavbar />

      <main className="flex-grow px-4 py-10 max-w-4xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-400 hover:underline mb-6"
        >
          ← Back
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            Order #{order.id}
          </h2>
          <span className="text-slate-400 text-sm">
            {new Date(order.created_at).toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Customer Info */}
          <div className="bg-slate-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">
              Customer Details
            </h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                <strong className="text-white">User ID:</strong> {order.user}
              </p>
              {order.address && (
                <>
                  <p>
                    <strong className="text-white">Name:</strong> {order.address.full_name}
                  </p>
                  <p>
                    <strong className="text-white">Phone:</strong> {order.address.phone}
                  </p>
                  <p>
                    <strong className="text-white">Address:</strong>
                    <br />
                    {order.address.street}, {order.address.city} - {order.address.pincode}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-slate-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">
              Order Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">
                  Payment Method
                </label>
                <div className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white capitalize">
                  {order.payment_method}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">
                  Payment Status
                </label>
                <select
                  value={order.payment_status}
                  onChange={(e) => handleStatusChange("payment_status", e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">
                  Order Status
                </label>
                <select
                  value={order.order_status}
                  onChange={(e) => handleStatusChange("order_status", e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-slate-800 rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-semibold">Order Items</h3>
          </div>
          <div className="divide-y divide-slate-700">
            {order.items?.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-700 rounded border border-slate-600 overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                        No Img
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-white hover:text-blue-400 transition-colors">
                      <a href={`/admin/products/edit/${item.product}`} target="_blank" rel="noopener noreferrer">
                        {item.product_name}
                      </a>
                    </h4>
                    <div className="text-sm text-slate-400 space-y-0.5 mt-1">
                      <p>Qty: {item.quantity} × ₹{item.price}</p>
                      <p className="text-xs">
                        <span className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 mr-2">
                          {item.category || "Uncategorized"}
                        </span>
                        <span className={item.stock < 10 ? "text-red-400" : "text-green-400"}>
                          Stock: {item.stock ?? "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right font-medium text-white">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-slate-800/50 flex justify-end">
            <div className="text-right">
              <p className="text-slate-400 mb-1">
                Subtotal: <span className="text-white">₹{Number(order.total_amount).toFixed(2)}</span>
              </p>
              <p className="text-xl font-bold text-white">
                Total: ₹{Number(order.total_amount).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-sm p-4 bg-slate-900 text-slate-400 border-t border-slate-800">
        © {new Date().getFullYear()}{' '}
        <span className="text-white font-semibold">Souled Admin</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminOrderDetails;
