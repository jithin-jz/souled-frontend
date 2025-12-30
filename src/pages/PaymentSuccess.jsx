import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import useCartStore from "../store/useCartStore";
import Confetti from "react-confetti";
import { Check, Package, ArrowRight, Clock } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reloadCart = useCartStore((state) => state.loadCart);

  const [statusMessage, setStatusMessage] = useState("Verifying payment...");
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sessionId = searchParams.get("session_id");
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    if (!sessionId) {
      toast.error("Missing payment session ID.");
      navigate("/");
      return;
    }

    const verifyPayment = async () => {
      // Reload cart from backend
      try {
        await reloadCart();
      } catch (err) {
        console.error("Error reloading cart:", err);
      }

      // Verify payment status
      try {
        const res = await api.get(`/orders/verify-payment/?session_id=${sessionId}`);
        const { payment_verified, status } = res.data;

        if (status === "processing" || status === "paid" || payment_verified) {
          setStatusMessage("Payment successful! Your order is confirmed.");
          setIsSuccess(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        } else {
          setStatusMessage("Order created. Payment is being processed...");
          setIsSuccess(false);
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setStatusMessage("Order created successfully. Check your orders for details.");
        setIsSuccess(true);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, reloadCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <Clock className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Processing your payment...</h2>
          <p className="text-slate-400">Please wait while we verify your transaction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700/50">
            
            {/* Icon Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Pulsing rings */}
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse"></div>
                
                {/* Main icon */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-scaleIn">
                  <Check className="w-14 h-14 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div className="text-center space-y-4 mb-8">
              <h1 className={`text-3xl md:text-4xl font-bold ${
                isSuccess 
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent" 
                  : "bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
              }`}>
                {statusMessage}
              </h1>
              
              <p className="text-slate-300 text-lg max-w-md mx-auto">
                {isSuccess 
                  ? "Thank you for your purchase! Your order has been confirmed and will be processed shortly."
                  : "We're still processing your payment. You'll receive a confirmation once it's complete."}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">Track Your Order</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Monitor your order status and estimated delivery in real-time
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white">Order Confirmed</h3>
                </div>
                <p className="text-sm text-slate-400">
                  You'll receive an email confirmation with order details
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/orders")}
                className="w-full group bg-red-600 hover:bg-red-700 text-white py-2.5 px-5 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>View My Orders</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-5 rounded-lg font-semibold transition-all hover:scale-105"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Thank you note */}
          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm">
              Questions? Contact our{" "}
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline">
                customer support
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes scaleIn {
          0% { 
            transform: scale(0); 
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% { 
            transform: scale(1); 
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
