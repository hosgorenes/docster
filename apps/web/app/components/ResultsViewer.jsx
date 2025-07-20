import React from "react";

export default function ResultsViewer({ data, format }) {
  const formatJsonData = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const formatCsvData = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return "No data available";
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvRows = [
      headers.join(","), // Header row
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in CSV values
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ];

    return csvRows.join("\n");
  };

  // Extract the correct data based on format
  const displayData = data && data[format] ? data[format] : null;

  if (!displayData) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <p className="text-gray-500">
          No data available for {format.toUpperCase()} format
        </p>
      </div>
    );
  }

  const formattedData =
    format === "json"
      ? formatJsonData(displayData)
      : formatCsvData(displayData);

  const handleDownload = () => {
    const blob = new Blob([formattedData], {
      type: format === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted-data.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedData);
      // You could add a toast notification here
      console.log("Data copied to clipboard");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download {format.toUpperCase()}
        </button>
      </div>

      {/* Data Display */}
      <div className="relative">
        <pre
          className={`bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-auto max-h-96 ${
            format === "json" ? "language-json" : "language-csv"
          }`}
        >
          <code className="text-gray-800 font-mono">{formattedData}</code>
        </pre>
      </div>

      {/* Data Summary */}
      <div className="text-xs text-gray-500 border-t pt-3">
        <div className="flex justify-between">
          <span>Format: {format.toUpperCase()}</span>
          <span>Size: {new Blob([formattedData]).size} bytes</span>
        </div>
        {format === "json" && displayData.documents && (
          <div className="mt-1">
            <span>Documents: {displayData.documents.length}</span>
          </div>
        )}
        {format === "csv" && Array.isArray(displayData) && (
          <div className="mt-1">
            <span>Records: {displayData.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
