import React from "react";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        <h2 className="text-xl font-semibold mt-4 text-gray-800">Loading...</h2>
        <p className="text-sm text-gray-600 mt-2">
          Please wait while we fetch your content
        </p>
      </div>
    </div>
  );
}
