import React from "react";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">TaskNest</h1>
          <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
        </div>

        {/* 404 Error */}
        <div className="mb-8">
          <h2 className="text-6xl font-light text-gray-300 mb-4">404</h2>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Page Not Found
          </h3>
          <p className="text-gray-500 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home size={18} />
            Return Home
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}