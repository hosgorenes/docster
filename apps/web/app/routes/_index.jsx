import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Header,
  Sidebar,
  TabNavigation,
  ResultsPanel,
  Toast,
} from "../components";

export default function Index() {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("json");
  const [successMessage, setSuccessMessage] = useState("");
  const fetcher = useFetcher();

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";
  const responseData = fetcher.data?.data || fetcher.data;
  const hasResults = responseData && responseData.success;
  // Use server-provided data for both JSON and CSV
  const processedData = responseData?.data;
  const error =
    responseData && !responseData.success ? responseData.error : null;

  // Handle fetcher response and errors
  useEffect(() => {
    console.log("Fetcher state:", fetcher.state, "Raw data:", fetcher.data);
    console.log("Response data:", responseData);

    if (responseData) {
      if (responseData.success) {
        setSuccessMessage(
          responseData.message || "Files processed successfully!"
        );
        // Clear files after successful processing
        setFiles([]);

        // Clear success message after 5 seconds
        const timer = setTimeout(() => {
          setSuccessMessage("");
        }, 5000);

        return () => clearTimeout(timer);
      } else {
        console.error("Processing failed:", responseData.error);
      }
    }

    // Handle network or submission errors
    if (
      fetcher.state === "idle" &&
      fetcher.data === undefined &&
      files.length > 0
    ) {
      console.warn("Submission completed but no data received");
    }
  }, [fetcher.data, fetcher.state, responseData]);

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

    const formData = new FormData();
    files.forEach((fileData) => {
      formData.append("files", fileData.file);
    });

    fetcher.submit(formData, {
      method: "POST",
      action: "/api/upload",
      encType: "multipart/form-data",
    });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <Header />

      <Toast
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      <div className="gap-1 px-6 flex flex-1 justify-center py-5">
        <Sidebar
          files={files}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          onProcessFiles={handleProcessFiles}
          isProcessing={isLoading}
        />

        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

          <ResultsPanel
            hasResults={hasResults}
            isLoading={isLoading}
            data={processedData}
            activeTab={activeTab}
            error={error}
          />
        </div>
      </div>
    </>
  );
}
