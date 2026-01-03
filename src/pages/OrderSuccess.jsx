import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";

const OrderSuccess = () => {
  const reloadCart = useCartStore((state) => state.loadCart);
  const soundPlayedRef = useRef(false);

  // Play success sound using Web Audio API
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

  // Reload cart and play success sound when this page loads
  useEffect(() => {
    reloadCart();
    playSuccessSound();
  }, [reloadCart, playSuccessSound]);

  // Fallback: play sound on first click if autoplay was blocked
  const handlePageClick = useCallback(() => {
    if (!soundPlayedRef.current) {
      playSuccessSound();
    }
  }, [playSuccessSound]);

  return (
    <div 
      className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4"
      onClick={handlePageClick}
    >
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
            className="inline-block w-full px-4 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all text-center"
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

