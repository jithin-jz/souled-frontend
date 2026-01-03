import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import useCartStore from "../store/useCartStore";
import { Check } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reloadCart = useCartStore((state) => state.loadCart);

  const [statusMessage, setStatusMessage] = useState("Verifying payment...");
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const sessionId = searchParams.get("session_id");
  const executedRef = useRef(false);
  const soundPlayedRef = useRef(false);

  // Play success sound using Web Audio API with proper async handling
  const playSuccessSound = useCallback(async () => {
    if (soundPlayedRef.current) return;
    soundPlayedRef.current = true;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context if suspended (required for autoplay policies)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Wait a tiny bit to ensure context is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create a pleasant success chime
      const playTone = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        // Smooth envelope for pleasant sound
        const attackTime = 0.02;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.5, startTime + attackTime);
        gainNode.gain.setValueAtTime(0.5, startTime + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;
      
      // Play a pleasant success chord (C major arpeggio ascending)
      playTone(523.25, now, 0.25);         // C5
      playTone(659.25, now + 0.12, 0.25);  // E5
      playTone(783.99, now + 0.24, 0.35);  // G5
      playTone(1046.50, now + 0.36, 0.5);  // C6 (octave higher for finale)
      
      console.log("Success sound played!");
      
    } catch (err) {
      console.log("Could not play success sound:", err);
    }
  }, []);

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    if (!sessionId) {
      toast.error("Missing payment session ID.");
      navigate("/");
      return;
    }

    const verifyPayment = async () => {
      try {
        await reloadCart();
      } catch (err) {
        console.error("Error reloading cart:", err);
      }

      try {
        const res = await api.get(`/orders/verify-payment/?session_id=${sessionId}`);
        const { payment_verified, status } = res.data;

        if (status === "processing" || status === "paid" || payment_verified) {
          setStatusMessage("Payment successful! Your order is confirmed.");
          setIsSuccess(true);
          playSuccessSound();
        } else {
          setStatusMessage("Order created. Payment is being processed...");
          setIsSuccess(false);
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setStatusMessage("Order created successfully. Check your orders for details.");
        setIsSuccess(true);
        playSuccessSound();
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, reloadCart, playSuccessSound]);

  // Play sound when success state is confirmed and loading is done
  useEffect(() => {
    if (!loading && isSuccess) {
      playSuccessSound();
    }
  }, [loading, isSuccess, playSuccessSound]);

  // Fallback: play sound on first click if autoplay was blocked
  const handlePageClick = useCallback(() => {
    if (isSuccess && !soundPlayedRef.current) {
      playSuccessSound();
    }
  }, [isSuccess, playSuccessSound]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-slate-900 flex items-center justify-center p-4"
      onClick={handlePageClick}
    >
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-scaleIn shadow-2xl">
              <Check className="w-14 h-14 text-white" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className={`text-3xl font-bold ${
            isSuccess ? "text-green-400" : "text-yellow-400"
          }`}>
            {isSuccess ? "Order Confirmed!" : "Processing..."}
          </h1>
          
          <p className="text-slate-300 text-lg">
            {statusMessage}
          </p>
          
          <p className="text-slate-500 text-sm">
            You'll receive an email confirmation shortly
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigate("/orders")}
            className="w-full px-4 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Animation */}
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
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
