import { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "@remix-run/react";
import { Header, Sidebar, TabNavigation, ResultsPanel } from "../components";

export default function ResultsByBatch() {
    const { batchId } = useParams();
    const [activeTab, setActiveTab] = useState("json");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resultsData, setResultsData] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState("Statement");
    const [processingStatus, setProcessingStatus] = useState(null);
    const [jobs, setJobs] = useState([]);
    const intervalRef = useRef(null);

    useEffect(() => {
        const apiBase = "http://localhost:4000";

        async function fetchResults() {
            setIsLoading(true);
            try {
                const res = await fetch(`${apiBase}/results/${batchId}`);
                const json = await res.json();

                if (json?.success) {
                    // Store jobs array
                    if (Array.isArray(json.jobs)) {
                        setJobs(json.jobs);
                        setFiles(
                            json.jobs.map((job) => ({
                                name: job.fileName,
                                size: job.status ? `Status: ${job.status}` : "",
                            }))
                        );
                    }

                    // Calculate counts from jobs array if not provided
                    const jobCount = json.jobCount || json.jobs?.length || 0;
                    const completedCount = json.completedCount || json.jobs?.filter((j) => j.status === "completed").length || 0;
                    const failedCount = json.failedCount || json.jobs?.filter((j) => j.status === "failed").length || 0;
                    const waitingCount = json.waitingCount || json.jobs?.filter((j) => j.status === "waiting").length || 0;
                    const remainingCount = waitingCount || (jobCount - completedCount - failedCount);

                    // Check if still processing: only show processing UI if remaining > 0
                    const hasResults = (json.json && json.json.length > 0) || (json.csv && json.csv.length > 0);
                    const allJobsFinished = json.jobs?.every(
                        (job) => job.status === "completed" || job.status === "failed"
                    ) ?? false;

                    // Show processing UI only if there are remaining jobs (remaining > 0)
                    if ((json.status === "processing" || (!hasResults && json.jobs && json.jobs.length > 0)) && remainingCount > 0) {
                        setProcessingStatus({
                            message: json.message || "Your files are still being processed",
                            jobCount,
                            completedCount,
                            failedCount,
                            waitingCount,
                        });
                        setResultsData(null); // Clear results if empty
                        setIsLoading(false); // Don't show loading spinner, show processing UI

                        // Start polling if not already polling and jobs not all finished
                        if (!allJobsFinished && !intervalRef.current) {
                            intervalRef.current = setInterval(fetchResults, 5000); // Poll every 5 seconds
                        }
                    } else {
                        // All jobs finished (remaining === 0) or has results, show results
                        setProcessingStatus(null);

                        // Always set results data if json or csv exists (even if empty array)
                        const resultsJson = Array.isArray(json.json) ? json.json : [];
                        const resultsCsv = json.csv || "";

                        setResultsData({
                            json: resultsJson,
                            csv: resultsCsv,
                        });
                        setIsLoading(false);
                        // Stop polling
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }

                        // Debug: Log what we received
                        console.log("✅ Results ready:", {
                            jsonLength: resultsJson.length,
                            jsonSample: resultsJson.slice(0, 2),
                            csvLength: resultsCsv.length,
                            csvPreview: resultsCsv.substring(0, 100),
                            jobs: json.jobs?.length,
                            allJobsFinished,
                            resultsData: { json: resultsJson, csv: resultsCsv }
                        });
                    }
                } else {
                    setError(json?.error || "Unable to fetch results");
                    setIsLoading(false);
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                }
            } catch (e) {
                setError(e.message);
                setIsLoading(false);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        }

        fetchResults();

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [batchId]);

    const hasResults = useMemo(() => {
        // Show results if we have actual data
        if (!resultsData) {
            console.log("hasResults: no resultsData");
            return false;
        }

        const hasJsonData = Array.isArray(resultsData.json) && resultsData.json.length > 0;
        const hasCsvData = resultsData.csv && typeof resultsData.csv === "string" && resultsData.csv.length > 0;
        const hasData = resultsData !== null;


        console.log("hasResults check:", {
            hasJsonData,
            hasCsvData,
            hasData,
            jsonLength: resultsData.json?.length,
            csvLength: resultsData.csv?.length,
            jsonType: Array.isArray(resultsData.json) ? "array" : typeof resultsData.json,
            csvType: typeof resultsData.csv,
            resultsDataKeys: Object.keys(resultsData)
        });

        return hasData;
    }, [resultsData]);

    return (
        <>
            <Header />
            <div className="gap-1 px-6 flex flex-1 justify-center py-5">
                <Sidebar
                    files={files}
                    onFileUpload={undefined}
                    onRemoveFile={undefined}
                    onProcessFiles={undefined}
                    isProcessing={false}
                    selectedProfile={selectedProfile}
                    onProfileChange={setSelectedProfile}
                    readOnly
                />
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                    <ResultsPanel
                        hasResults={hasResults}
                        isLoading={isLoading}
                        data={resultsData}
                        activeTab={activeTab}
                        error={error}
                        processingStatus={processingStatus}
                        jobs={jobs}
                    />
                </div>
            </div>
        </>
    );
}
