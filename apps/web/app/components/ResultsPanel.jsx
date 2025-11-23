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
  processingMessage,
  processingMessageDetail,
  resultsUrl,
  processingStatus,
  jobs,
}) {
  // Show processing status UI (similar to results screen)
  if (processingStatus) {
    const { message, jobCount, completedCount, failedCount, waitingCount } = processingStatus;
    const remainingCount = waitingCount || (jobCount - completedCount - failedCount);
    const progressPercentage = jobCount > 0 ? Math.round((completedCount / jobCount) * 100) : 0;

    // Show job details if available
    const hasJobDetails = jobs && Array.isArray(jobs) && jobs.length > 0;

    return (
      <div className="flex flex-col px-4 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <LoadingSpinner size="medium" />
            <h3 className="text-xl font-semibold text-blue-900">{message}</h3>
          </div>

          <div className="mt-6 space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-semibold text-blue-700">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{jobCount}</div>
                <div className="text-sm text-gray-600 mt-1">Total Jobs</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-700">{completedCount}</div>
                <div className="text-sm text-green-600 mt-1">Completed</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">{remainingCount}</div>
                <div className="text-sm text-yellow-600 mt-1">Remaining</div>
              </div>
              {failedCount > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{failedCount}</div>
                  <div className="text-sm text-red-600 mt-1">Failed</div>
                </div>
              )}
            </div>

            {/* Job Details List */}
            {hasJobDetails && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">File Status:</h4>
                <div className="space-y-2">
                  {jobs.map((job, index) => {
                    const statusColor =
                      job.status === "completed" ? "text-green-600 bg-green-50" :
                        job.status === "failed" ? "text-red-600 bg-red-50" :
                          "text-yellow-600 bg-yellow-50";

                    return (
                      <div key={job.jobId || index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-sm text-gray-700 truncate">{job.fileName || `Job ${index + 1}`}</span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}>
                          {job.status === "completed" ? "✓ Completed" :
                            job.status === "failed" ? "✗ Failed" :
                              job.status === "waiting" ? "⏳ Waiting" :
                                job.status || "Processing"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col px-4 py-6">
        <div className="flex flex-col items-center gap-6 py-12">
          <LoadingSpinner size="large" message={processingMessage || "Processing your documents..."} />
          {processingMessageDetail && (
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-gray-600 text-sm">{processingMessageDetail}</p>
              {resultsUrl && (
                <a
                  href={resultsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                >
                  {resultsUrl}
                </a>
              )}
            </div>
          )}
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
