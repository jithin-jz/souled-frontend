import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../utils/api";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [verified, setVerified] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await api.get(`/orders/verify-payment/?session_id=${sessionId}`);
        setVerified(true);
      } catch (err) {
        setVerified(false);
      }
    };

    if (sessionId) verifyPayment();

    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-slate-900 px-4">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-800 rounded-xl p-8 shadow-lg max-w-md w-full text-center"
      >
        <CheckCircle2 size={64} className="mx-auto text-green-400 mb-4" />

        <h1 className="text-3xl font-bold text-green-300 mb-2">
          {verified ? "Payment Successful" : "Processing Payment..."}
        </h1>

        <p className="text-gray-300 mb-4">
          {verified
            ? "Your order has been confirmed and is being processed."
            : "Please wait while we verify your payment."}
        </p>

        <p className="text-xs text-gray-400 mb-6">
          Payment Reference: {sessionId}
        </p>

        {verified && (
          <Link
            to="/orders"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md"
          >
            View Orders
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
