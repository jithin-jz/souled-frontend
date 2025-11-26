import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

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

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        <div className="text-center">
          <div className="animate-pulse mb-4">Loading orders...</div>
          <div className="text-sm">If this takes too long, try refreshing.</div>
        </div>
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
          <h1 className="text-3xl font-bold">Your Orders</h1>
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
                          : "bg-emerald-900/30 text-emerald-300 border-emerald-500"
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
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

