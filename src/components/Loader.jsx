const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Spider-Man Web Spinner */}
      <div className="relative w-24 h-24">
        {/* Central Spider Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg spider-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              <circle cx="12" cy="12" r="2" fill="white"/>
              <path d="M12 8l-3 3m6 0l-3-3m-3 6l3 3m0 0l3-3" stroke="white" strokeWidth="0.5"/>
            </svg>
          </div>
        </div>

        {/* Animated Web Threads */}
        <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
          {/* Web strands radiating out */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={angle}
              x1="50"
              y1="50"
              x2={50 + 45 * Math.cos((angle * Math.PI) / 180)}
              y2={50 + 45 * Math.sin((angle * Math.PI) / 180)}
              stroke="url(#webGradient)"
              strokeWidth="1"
              className="web-line"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          
          {/* Circular web rings */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="url(#webGradient)"
            strokeWidth="0.5"
            className="web-ring"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="url(#webGradient)"
            strokeWidth="0.5"
            className="web-ring"
            style={{ animationDelay: '0.2s' }}
          />

          <defs>
            <linearGradient id="webGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#dc2626" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin">
          <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-red-500 rounded-full shadow-glow"></div>
        </div>
        <div className="absolute inset-0 animate-spin-reverse">
          <div className="absolute bottom-0 left-1/2 -ml-1 w-2 h-2 bg-red-600 rounded-full shadow-glow"></div>
        </div>
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-1/2 right-0 -mt-1 w-2 h-2 bg-red-400 rounded-full shadow-glow"></div>
        </div>
      </div>

      Loading Text with Web Effect
      <div className="relative">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-pulse">
          Loading
        </h3>
        <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent web-line-bottom"></div>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-red-600 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes spider-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes web-fade {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes slide-web {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }

        .spider-pulse {
          animation: spider-pulse 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }

        .web-line {
          animation: web-fade 2s ease-in-out infinite;
        }

        .web-ring {
          animation: web-fade 3s ease-in-out infinite;
        }

        .web-line-bottom {
          animation: slide-web 1.5s ease-in-out infinite;
        }

        .shadow-glow {
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Loader;
