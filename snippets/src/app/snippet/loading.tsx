import React from "react";

export function LoadingSpinner() {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center">
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 h-12 w- 12" />
    </div>
  );
}
export default LoadingSpinner;
