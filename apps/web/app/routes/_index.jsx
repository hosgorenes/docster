import { useState } from "react";
import {
  Header,
  Sidebar,
  TabNavigation,
  ResultsPanel,
} from "../components";

export default function Index() {
  const [files, setFiles] = useState([
    { name: "Document 1.pdf", size: "2.5 MB" },
    { name: "Report 2024.pdf", size: "1.8 MB" },
  ]);
  const [activeTab, setActiveTab] = useState("json");
  const [hasResults, setHasResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState(null);

  const handleFileUpload = (newFiles) => {
    // Convert File objects to our file format and add to existing files
    const fileData = newFiles.map((file) => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      file: file, // Keep reference to actual File object
    }));

    setFiles((prevFiles) => [...prevFiles, ...fileData]);
    console.log("Files uploaded:", fileData);
  };

  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleProcessFiles = () => {
    if (files.length === 0) return;

    setIsLoading(true);
    setHasResults(false);

    // Simulate file processing logic
    console.log("Processing files:", files);

    // Simulate processing with a timeout
    setTimeout(() => {
      // Mock processed data based on uploaded files
      const mockData = {
        documents: files.map((file, index) => ({
          id: index + 1,
          title: file.name.replace(".pdf", ""),
          content: `This is the extracted content from ${file.name}`,
          metadata: {
            pages: Math.floor(Math.random() * 20) + 1,
            created: new Date().toISOString().split("T")[0],
            size: file.size,
          },
        })),
      };

      setProcessedData(mockData);
      setIsLoading(false);
      setHasResults(true);
    }, 2000);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <Header />

      <div className="gap-1 px-6 flex flex-1 justify-center py-5">
        <Sidebar
          files={files}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          onProcessFiles={handleProcessFiles}
          isProcessing={isLoading}
        />

        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <ResultsPanel
            hasResults={hasResults}
            isLoading={isLoading}
            data={processedData}
            activeTab={activeTab}
          />
        </div>
      </div>
    </>
  );
}
