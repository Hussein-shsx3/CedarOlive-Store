import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 text-center">
        <Loader2
          className="animate-spin text-secondary mx-auto mb-4"
          size={48}
        />
        <h2 className="text-gray-700 text-lg font-semibold mb-2">
          Loading user data...
        </h2>
        <p className="text-gray-500 text-sm">
          Please wait while we verify your access
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
