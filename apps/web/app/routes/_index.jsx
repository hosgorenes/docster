import { useState, useEffect } from "react";
import { useFetcher, useNavigate } from "@remix-run/react";
import {
  Header,
  Sidebar,
  TabNavigation,
  ResultsPanel,
} from "../components";

const BATCH_PROFILE_KEY_PREFIX = "docster:batchProfile:";

const saveBatchProfile = (batchId, profile) => {
  if (!batchId || !profile || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      `${BATCH_PROFILE_KEY_PREFIX}${batchId}`,
      profile
    );
  } catch {
    // ignore storage errors
  }
};

export default function Index() {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("json");
  const [selectedProfile, setSelectedProfile] = useState("Statement");
  const [isProcessingPolling, setIsProcessingPolling] = useState(false);
  const [currentBatchId, setCurrentBatchId] = useState("");
  const [resultsData, setResultsData] = useState(null);
  const [isreadytoredirect, setIsreadytoredirect] = useState(false);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [processingMessageDetail, setProcessingMessageDetail] = useState(null);
  const [resultsUrl, setResultsUrl] = useState(null);
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isLoading = fetcher.state === "submitting" || fetcher.state === "loading";
  const responseData = fetcher.data?.data || fetcher.data;
  const hasResults = responseData && responseData.success;
  // Use server-provided data for both JSON and CSV
  const processedData = responseData?.data;
  const error =
    responseData && !responseData.success ? responseData.error : null;

  // Handle fetcher response and errors
  useEffect(() => {
    if (responseData) {
      if (responseData.success) {
        // Clear files after successful processing
        setFiles([]);
      } else {
        console.error("Processing failed:", responseData.error);
      }
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
  };

  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((fileData) => {
      formData.append("files", fileData.file);
    });
    formData.append("profile", selectedProfile.toLowerCase());

    const apiBase = process.env.DOCSTER_API_BASE_URL ?? "http://localhost:4000";

    try {
      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (json?.success) {
        if (json.batchId) {
          saveBatchProfile(json.batchId, selectedProfile);
          setCurrentBatchId(json.batchId);
          setIsProcessingPolling(true);
          setIsreadytoredirect(false);
          setResultsData(null);
          // Store backend messages and URL
          setProcessingMessage(
            json.message || "Your results are being processed..."
          );
          setProcessingMessageDetail(
            json.messageDetail || "You can view them here when ready:"
          );
          setResultsUrl(
            json.resultsUrl || `${apiBase}/results/${json.batchId}`
          );
          return;
        }

        // Fallback: no batchId returned
        setFiles([]);
      } else {
        console.error("Processing failed:", json?.error || res.statusText);
      }
    } catch (err) {
      console.error("Network error while uploading:", err);
    }
  };

  // Prefer polling results endpoint every 10s while processing
  useEffect(() => {
    if (!isProcessingPolling || !currentBatchId) return;

    const apiBase = process.env.DOCSTER_API_BASE_URL ?? "http://localhost:4000";

    const fetchResults = async () => {
      try {
        const res = await fetch(`${apiBase}/results/${currentBatchId}`);
        const json = await res.json();

        if (json?.success && Array.isArray(json.jobs)) {
          const jobs = json.jobs;
          const allCompleted = jobs.length > 0 && jobs.every((j) => j.status === "completed");
          const anyFailed = jobs.some((j) => j.status === "failed");

          if (allCompleted) {
            setResultsData({
              json: json.json ?? [],
              csv: json.csv ?? "",
            });
            console.log("✅ All jobs completed.");

            setIsProcessingPolling(false);
            setIsreadytoredirect(true);

            // Redirect to results page after 3 seconds
            setTimeout(() => {
              navigate(`/results/${currentBatchId}`);
            }, 5000);

          } else if (anyFailed) {
            console.error("❌ One or more jobs failed:", jobs.filter((j) => j.status === "failed"));
            setIsProcessingPolling(false);
          }
        } else if (json?.success === false) {
          console.error("❌ Processing failed (backend returned error):", json.error);
          setIsProcessingPolling(false);
        }
      } catch (e) {
        console.error("Polling error:", e);
        setIsProcessingPolling(false);
      }
    };

    fetchResults();
    const intervalId = setInterval(fetchResults, 10000);
    return () => clearInterval(intervalId);
  }, [isProcessingPolling, currentBatchId]);

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
          selectedProfile={selectedProfile}
          onProfileChange={setSelectedProfile}
        />

        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

          {isreadytoredirect ? (
            <div className="text-center p-6 text-green-600 font-semibold">
              Results ready — you will be redirected in 5 seconds...
            </div>
          ) : (
            <ResultsPanel
              hasResults={Boolean(resultsData) || hasResults}
              isLoading={isLoading || isProcessingPolling}
              data={resultsData || processedData}
              activeTab={activeTab}
              error={error}
              processingMessage={processingMessage}
              processingMessageDetail={processingMessageDetail}
              resultsUrl={resultsUrl}
            />
          )}
        </div>
      </div>
    </>
  );
}
