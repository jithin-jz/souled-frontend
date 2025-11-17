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
        // backend MUST expose this route: /api/orders/my/
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
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                  order.status === "pending"
                    ? "bg-yellow-500/10 text-yellow-300 border border-yellow-400"
                    : order.status === "paid"
                    ? "bg-green-500/10 text-green-300 border border-green-400"
                    : order.status === "processing"
                    ? "bg-blue-500/10 text-blue-300 border border-blue-400"
                    : "bg-slate-500/10 text-slate-300 border border-slate-400"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* Address */}
            <div className="mb-4">
              <h4 className="text-md font-semibold">Shipping Address</h4>
              <div className="text-gray-300 text-sm mt-1 leading-relaxed">
                <p>{order.address.full_name}</p>
                <p>{order.address.phone}</p>
                <p>
                  {order.address.street}, {order.address.city} -{" "}
                  {order.address.pincode}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="mb-4">
              <h4 className="text-md font-semibold">Payment</h4>
              <p className="text-gray-300 text-sm capitalize">
                {order.payment_method}
              </p>
            </div>

            {/* Items */}
            <div className="border-t border-slate-600 pt-4">
              <h4 className="font-semibold mb-3">Items</h4>

              <div className="divide-y divide-slate-700">
                {order.items.map((item) => (
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
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-slate-700 pt-4 text-right">
              <p className="text-gray-300 text-sm">
                Subtotal:{" "}
                <span className="text-white font-semibold">
                  ₹{order.total_amount.toFixed(2)}
                </span>
              </p>
              <p className="text-gray-300 text-sm">
                Shipping: <span className="text-green-400">Free</span>
              </p>
              <p className="text-xl font-bold mt-2 text-white">
                Total: ₹{order.total_amount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
