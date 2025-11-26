const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-20 h-20">
        {/* Core Spider */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center shadow-lg spider-pulse">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <circle cx="12" cy="12" r="2" fill="white" />
              <path
                d="M12 8l-3 3m6 0l-3-3m-3 6l3 3m0 0l3-3"
                stroke="white"
                strokeWidth="0.6"
              />
            </svg>
          </div>
        </div>

        {/* Web */}
        <svg
          className="absolute inset-0 w-full h-full spin-slow"
          viewBox="0 0 100 100"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={angle}
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
              y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
              className={`web-line delay-${i}`}
              stroke="url(#grad)"
              strokeWidth="1"
            />
          ))}

          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="0.7"
            className="web-ring"
          />

          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting Dots */}
        <div className="absolute inset-0 spin">
          <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-red-500 rounded-full glow" />
        </div>

        <div className="absolute inset-0 spin-reverse">
          <div className="absolute bottom-0 left-1/2 -ml-1 w-2 h-2 bg-red-600 rounded-full glow" />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 15px rgba(220, 38, 38, 0.6);
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 0 25px rgba(220, 38, 38, 1);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes fade {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        .spider-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .spin {
          animation: rotate 4s linear infinite;
        }

        .spin-slow {
          animation: rotate 7s linear infinite;
        }

        .spin-reverse {
          animation: rotateReverse 5s linear infinite;
        }

        .web-line {
          animation: fade 2s ease-in-out infinite;
        }

        .web-ring {
          animation: fade 3s ease-in-out infinite;
        }

        /* Delay classes for web-line */
        ${[0, 1, 2, 3, 4, 5, 6, 7]
          .map(
            i =>
              `.delay-${i} { animation-delay: ${i * 0.15}s; }`
          )
          .join("")}

        .glow {
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.9);
        }
      `}</style>
    </div>
  );
};

export default Loader;
