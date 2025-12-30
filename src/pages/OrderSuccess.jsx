import { useEffect } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";

const OrderSuccess = () => {
  const reloadCart = useCartStore((state) => state.loadCart);

  // Reload cart when this page loads (backend already cleared it)
  useEffect(() => {
    reloadCart();
  }, [reloadCart]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-10 text-center shadow-xl space-y-6">

        {/* Animated success icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-scaleIn shadow-lg shadow-green-500/30">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-green-400">
          Order Placed Successfully!
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed">
          Your Cash On Delivery order has been placed successfully.  
          You will receive updates once your order is processed.
        </p>

        <div className="pt-4">
          <a
            href="/orders"
            className="inline-block w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
          >
            View My Orders
          </a>
        </div>

        <a
          href="/"
          className="text-slate-400 text-sm hover:text-gray-200 transition"
        >
          Continue Shopping →
        </a>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.3); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default OrderSuccess;
