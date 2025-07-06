// error wrapper component  util file to show in frontend

import React from "react";

const ErrorWrapper = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r-lg">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
    </div>
  );
};

export default ErrorWrapper;
