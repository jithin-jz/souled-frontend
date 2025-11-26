import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/admin/all/');
      setOrders(res.data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, statusType, newValue) => {
    try {
      const updateData = {};
      updateData[statusType] = newValue;
      
      await api.patch(`/orders/${orderId}/status/`, updateData);
      
      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, [statusType]: newValue } : order
        )
      );

      toast.success(`${statusType === 'payment_status' ? 'Payment' : 'Order'} status updated successfully`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <AdminNavbar />

      <main className="flex-grow px-4 py-10 max-w-7xl mx-auto w-full">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase tracking-wide">
          Order Management
        </h2>

        {loading ? (
          <div className="text-center text-slate-400 animate-pulse">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-slate-400">No orders found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-800 shadow">
              <table className="min-w-full text-sm bg-slate-900">
                <thead className="bg-slate-800 sticky top-0 z-10">
                  <tr className="text-left text-slate-300 uppercase text-xs tracking-widest">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4">Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr
                      key={order.id}
                      className="border-t border-slate-800 hover:bg-slate-800/60 transition"
                    >
                      <td className="p-4 font-mono text-gray-200">{order.id}</td>
                      <td className="p-4">
                        <p className="font-semibold text-white">{order.user}</p>
                      </td>
                      <td className="p-4 text-slate-300">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-semibold text-green-300">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </td>
                      <td className="p-4 text-slate-300 capitalize">
                        {order.payment_method}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.payment_status}
                          onChange={e =>
                            handleStatusChange(order.id, 'payment_status', e.target.value)
                          }
                          className="bg-slate-800 border border-slate-700 text-white px-2 py-1 text-xs rounded-md w-full"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.order_status}
                          onChange={e =>
                            handleStatusChange(order.id, 'order_status', e.target.value)
                          }
                          className="bg-slate-800 border border-slate-700 text-white px-2 py-1 text-xs rounded-md w-full"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md"
                >
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Order ID:</span>
                    <span className="font-mono text-sm text-gray-200">{order.id}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{order.user}</p>
                  </div>
                  <p className="text-sm text-slate-300">
                    <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-green-400 font-bold">
                    ₹{Number(order.total_amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-300 capitalize">
                    <strong>Payment:</strong> {order.payment_method}
                  </p>
                  
                  <div>
                    <p className="text-sm font-semibold mb-1">Payment Status:</p>
                    <select
                      value={order.payment_status}
                      onChange={e =>
                        handleStatusChange(order.id, 'payment_status', e.target.value)
                      }
                      className="w-full text-xs bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-1">Order Status:</p>
                    <select
                      value={order.order_status}
                      onChange={e =>
                        handleStatusChange(order.id, 'order_status', e.target.value)
                      }
                      className="w-full text-xs bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="text-center text-sm p-4 bg-gray-950 text-slate-500 border-t border-slate-800">
        &copy; {new Date().getFullYear()}{' '}
        <span className="text-white font-semibold">Souled Admin</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminOrderManagement;

