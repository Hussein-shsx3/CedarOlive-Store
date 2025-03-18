import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <AlertTriangle size={100} className="text-red-500 animate-bounce" />
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-6">
          Oops! The page you're looking for seems to have wandered off into the
          digital wilderness.
        </p>

        <Link
          to="/"
          className="inline-flex items-center bg-secondary text-white px-6 py-3 rounded-full hover:bg-[#c1855a] transition-colors duration-300 shadow-md"
        >
          <Home className="mr-2" size={20} />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
