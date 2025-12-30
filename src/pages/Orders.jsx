import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import api from "../utils/api";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { X, AlertCircle } from "lucide-react";

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my/");
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;

    setCancellingOrderId(orderToCancel.id);
    setShowCancelModal(false);

    try {
      const res = await api.post(`/orders/${orderToCancel.id}/cancel/`);
      toast.success(res.data.message || "Order cancelled successfully!");
      
      if (res.data.refund_info) {
        toast.info(res.data.refund_info, { autoClose: 5000 });
      }

      // Refresh orders
      await fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
      setOrderToCancel(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        <Loader />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-6">
        <div className="max-w-xl text-center">
          <svg className="mx-auto mb-6 w-24 h-24 opacity-60" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 6v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          <h2 className="text-3xl font-semibold mb-2">No orders yet</h2>
          <p className="text-slate-400">
            You haven't placed any orders. Browse products and complete a purchase to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <p className="text-sm text-slate-400">{orders.length} order{orders.length > 1 ? "s" : ""} placed</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          {orders.map((order) => (
            <article
              key={order.id}
              className="group bg-gradient-to-tr from-slate-800/60 to-slate-800/40 border border-slate-700 rounded-2xl p-6 shadow-lg hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString()} at{" "}
                    {new Date(order.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                        order.payment_status === "paid"
                          ? "bg-green-900/30 text-green-300 border-green-500"
                          : "bg-yellow-900/30 text-yellow-300 border-yellow-500"
                      }`}
                    >
                      {order.payment_status?.toUpperCase()}
                    </span>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                        order.order_status === "processing"
                          ? "bg-blue-900/30 text-blue-300 border-blue-500"
                          : order.order_status === "shipped"
                          ? "bg-purple-900/30 text-purple-300 border-purple-500"
                          : order.order_status === "delivered"
                          ? "bg-emerald-900/30 text-emerald-300 border-emerald-500"
                          : "bg-red-900/30 text-red-300 border-red-500"
                      }`}
                    >
                      {order.order_status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-right text-sm text-slate-400">
                    Payment:{" "}
                    <span className="text-gray-200 font-medium capitalize">
                      {order.payment_method}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-200">Shipping</h4>
                  <div className="mt-2 text-sm text-slate-300 leading-tight">
                    {order.address ? (
                      <>
                        <div className="font-medium">{order.address.full_name}</div>
                        <div className="mt-1">
                          {order.address.street}, {order.address.city} - {order.address.pincode}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">{order.address.phone}</div>
                      </>
                    ) : (
                      <div className="text-slate-400">Address information missing.</div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-1 text-right">
                  <div className="text-sm text-slate-400">Subtotal</div>
                  <div className="text-lg font-semibold text-white">
                    ₹{Number(order.total_amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Shipping: <span className="text-green-400">Free</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6 border-t border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-200 mb-3">Items</h4>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
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
                      <div className="flex-grow min-w-0">
                        <p className="font-medium text-white truncate">{item.product_name}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">
                            {item.category || "General"}
                          </span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right font-medium text-white whitespace-nowrap">
                        ₹{Number(item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel Button */}
              {order.order_status === "processing" && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => handleCancelClick(order)}
                    disabled={cancellingOrderId === order.id}
                    className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {cancellingOrderId === order.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Cancel Order
                      </>
                    )}
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && orderToCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Cancel Order?</h3>
            </div>

            <p className="text-slate-300 mb-6">
              Are you sure you want to cancel Order #{orderToCancel.id}? This action cannot be undone.
              {orderToCancel.payment_status === 'paid' && (
                <span className="block mt-2 text-sm text-blue-400">
                  Your refund will be processed within 5-7 business days.
                </span>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setOrderToCancel(null);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
