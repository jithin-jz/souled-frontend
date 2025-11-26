import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

const Orders = () => {
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
      <div className="text-center py-16 text-gray-400">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4">
        <h2 className="text-3xl font-bold mb-4">No Orders Found</h2>
        <p className="text-gray-400">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 md:px-10">
      <h2 className="text-3xl font-bold mb-10 text-center">Your Orders</h2>

      <div className="space-y-8 max-w-5xl mx-auto">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">Order #{order.id}</h3>
                <p className="text-sm text-gray-400">
                  Placed on: {new Date(order.created_at).toLocaleDateString()}{" "}
                  at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                    order.payment_status === "paid"
                      ? "bg-green-500/10 text-green-300 border border-green-400"
                      : "bg-yellow-500/10 text-yellow-300 border border-yellow-400"
                  }`}
                >
                  {order.payment_status?.toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                    order.order_status === "processing"
                      ? "bg-blue-500/10 text-blue-300 border border-blue-400"
                      : order.order_status === "shipped"
                      ? "bg-purple-500/10 text-purple-300 border border-purple-400"
                      : "bg-emerald-500/10 text-emerald-300 border border-emerald-400"
                  }`}
                >
                  {order.order_status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <h4 className="text-md font-semibold">Shipping Address</h4>
              <div className="text-gray-300 text-sm mt-1 leading-relaxed">
                {order.address ? (
                  <>
                    <p>{order.address.full_name}</p>
                    <p>{order.address.phone}</p>
                    <p>
                      {order.address.street}, {order.address.city} - {order.address.pincode}
                    </p>
                  </>
                ) : (
                  <p>Address information missing.</p>
                )}
              </div>
            </div>

            {/* Payment Status */}
            <div className="mb-4">
              <h4 className="text-md font-semibold">Payment Status</h4>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                    order.payment_status === "paid"
                      ? "bg-green-500/10 text-green-300 border border-green-400"
                      : "bg-yellow-500/10 text-yellow-300 border border-yellow-400"
                  }`}
                >
                  {order.payment_status?.toUpperCase()}
                </span>
                <p className="text-sm text-gray-400 mt-2">
                  {order.payment_status === "paid" && "Payment has been received"}
                  {order.payment_status === "unpaid" && "Waiting for payment"}
                </p>
              </div>
            </div>

            {/* Order Status */}
            <div className="mb-4">
              <h4 className="text-md font-semibold">Order Status</h4>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                    order.order_status === "processing"
                      ? "bg-blue-500/10 text-blue-300 border border-blue-400"
                      : order.order_status === "shipped"
                      ? "bg-purple-500/10 text-purple-300 border border-purple-400"
                      : "bg-emerald-500/10 text-emerald-300 border border-emerald-400"
                  }`}
                >
                  {order.order_status?.toUpperCase()}
                </span>
                <p className="text-sm text-gray-400 mt-2">
                  {order.order_status === "processing" && "Your order is being prepared"}
                  {order.order_status === "shipped" && "Your order has been dispatched and is on the way"}
                  {order.order_status === "delivered" && "Your order has been successfully delivered"}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <h4 className="text-md font-semibold">Payment Method</h4>
              <p className="text-gray-300 text-sm capitalize">
                {order.payment_method}
              </p>
            </div>

            {/* Items */}
            <div className="border-t border-slate-600 pt-4">
              <h4 className="font-semibold mb-3">Items</h4>

              <div className="divide-y divide-slate-700">
                {order.items?.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-3">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-14 h-14 object-cover rounded-lg border border-slate-700"
                        />
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-green-400 font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 py-3">No items found for this order.</p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-slate-700 pt-4 text-right">
              <p className="text-gray-300 text-sm">
                Subtotal:{" "}
                <span className="text-white font-semibold">
                  ₹{Number(order.total_amount).toFixed(2)}
                </span>
              </p>
              <p className="text-gray-300 text-sm">
                Shipping: <span className="text-green-400">Free</span>
              </p>
              <p className="text-xl font-bold mt-2 text-white">
                Total: ₹{Number(order.total_amount).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;