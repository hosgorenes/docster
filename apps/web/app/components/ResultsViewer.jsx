export default function ResultsViewer({ data, format }) {
  const formatJsonData = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const parseCsvToTable = (csvString) => {
    if (!csvString || typeof csvString !== "string") return null;

    const lines = csvString.trim().split("\n");
    if (lines.length === 0) return null;

    // Parse CSV with basic comma splitting (handles simple cases)
    const parseRow = (row) => {
      const result = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseRow(lines[0]);
    const rows = lines.slice(1).map(parseRow);

    return { headers, rows };
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

  // For CSV, data is already a string from server-side conversion
  // For JSON, format it nicely
  const formattedData =
    format === "json" ? formatJsonData(displayData) : displayData; // CSV is already formatted as string

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
        {format === "csv" ? (
          // CSV Table Display
          (() => {
            const tableData = parseCsvToTable(formattedData);
            return tableData ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-auto max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {tableData.headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-auto max-h-96">
                <code className="text-gray-800 font-mono">{formattedData}</code>
              </pre>
            );
          })()
        ) : (
          // JSON Display
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-auto max-h-96 language-json">
            <code className="text-gray-800 font-mono">{formattedData}</code>
          </pre>
        )}
      </div>

      {/* Data Summary */}
      <div className="text-xs text-gray-500 border-t pt-3">
        <div className="flex justify-between">
          <span>Format: {format.toUpperCase()}</span>
          <span>Size: {new Blob([formattedData]).size} bytes</span>
        </div>
        {format === "json" && Array.isArray(displayData) && (
          <div className="mt-1">
            <span>Documents: {displayData.length}</span>
          </div>
        )}
        {format === "csv" && typeof displayData === "string" && (
          <div className="mt-1">
            <span>Rows: {Math.max(0, displayData.split("\n").length - 1)}</span>
            <span className="ml-2">
              Columns: {parseCsvToTable(displayData)?.headers?.length || 0}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
