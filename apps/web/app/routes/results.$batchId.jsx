import { useEffect, useMemo, useState } from "react";
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

    useEffect(() => {
        const apiBase = "http://localhost:4000";
        async function fetchResults() {
            setIsLoading(true);
            try {
                const res = await fetch(`${apiBase}/results/${batchId}`);
                const json = await res.json();

                if (json?.success) {
                    setResultsData({
                        json: json.json ?? [],
                        csv: json.csv ?? "",
                    });

                    if (Array.isArray(json.jobs)) {
                        setFiles(
                            json.jobs.map((job) => ({
                                name: job.fileName,
                                size: job.status ? `Status: ${job.status}` : "",
                            }))
                        );
                    }
                } else {
                    setError(json?.error || "Unable to fetch results");
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchResults();
    }, [batchId]);

    const hasResults = useMemo(
        () => Boolean(resultsData?.json?.length || resultsData?.csv),
        [resultsData]
    );

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
                    />
                </div>
            </div>
        </>
    );
}
