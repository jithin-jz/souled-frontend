import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h1 className="text-9xl font-bold text-red-500 animate-bounce">
                404
            </h1>
            <div className="mt-8 space-y-4">
                <h2 className="text-4xl font-semibold text-white">
                    Oops! Page Not Found
                </h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
            </div>
            
            <Link 
                to="/" 
                className="mt-10 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
            >
                <Home size={20} />
                Back to Home
            </Link>

            <div className="absolute top-1/4 -z-10 blur-3xl opacity-20">
                <div className="w-96 h-96 bg-red-600 rounded-full"></div>
            </div>
        </div>
    );
};

export default NotFound;
