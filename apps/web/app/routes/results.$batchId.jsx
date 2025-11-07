import { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";
import { Header, Sidebar, TabNavigation, ResultsPanel } from "../components";

export default function ResultsByBatch() {
    const { batchId } = useParams();
    const [activeTab, setActiveTab] = useState("json");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resultsData, setResultsData] = useState(null);

    useEffect(() => {
        const apiBase = "http://localhost:4000";
        async function fetchResults() {
            try {
                const res = await fetch(`${apiBase}/results/${batchId}`);
                const json = await res.json();
                if (json?.success && json.jobs?.length > 0) {
                    const firstOutput = json.jobs[0].output;
                    const parsed = firstOutput ? JSON.parse(firstOutput) : null;
                    setResultsData(parsed);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchResults();
    }, [batchId]);

    return (
        <>
            <Header />
            <div className="gap-1 px-6 flex flex-1 justify-center py-5">
                <Sidebar
                    files={[]}
                    onFileUpload={() => { }}
                    onRemoveFile={() => { }}
                    onProcessFiles={() => { }}
                    isProcessing={false}
                    selectedProfile="Statement"
                    onProfileChange={() => { }}
                />
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                    <ResultsPanel
                        hasResults={Boolean(resultsData)}
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
