import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import ResultsViewer from "./ResultsViewer";

export default function ResultsPanel({
  hasResults,
  isLoading,
  data,
  activeTab,
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
            Process the uploaded files to see the structured data here.
          </p>
        </div>
      </div>
    </div>
  );
}
