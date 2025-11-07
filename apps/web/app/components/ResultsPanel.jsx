import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import ResultsViewer from "./ResultsViewer";

export default function ResultsPanel({
  hasResults,
  isLoading,
  data,
  activeTab,
  error,
  children,
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col px-4 py-6">
        <div className="flex flex-col items-center gap-6 py-12">
          <LoadingSpinner size="large" message="Processing your documents..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col px-4 py-6">
        <div className="flex flex-col items-center gap-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.88-.833-2.65 0L3.732 19c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="font-semibold text-red-900">Processing Failed</h3>
            </div>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hasResults) {
    return (
      <div className="flex flex-col px-4 py-6">
        <ResultsViewer data={data} format={activeTab} />
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
            No conversion results yet
          </p>
          <p className="text-[#101518] text-sm font-normal leading-normal max-w-[480px] text-center">
            Upload PDF files and click "Process Files" to see the structured
            data here.
          </p>
        </div>
      </div>
    </div>
  );
}
