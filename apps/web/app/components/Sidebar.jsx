import React, { useState } from "react";
import FileUploadArea from "./FileUploadArea";
import FileList from "./FileList";
import ProfileSelector from "./ProfileSelector";

export default function Sidebar({
  files = [],
  onFileUpload,
  onRemoveFile,
  onProcessFiles,
  isProcessing = false,
  selectedProfile,
  onProfileChange,
  readOnly = false,
}) {
  const [profile, setProfile] = useState(selectedProfile || "Proposal");

  // Update local state when prop changes
  React.useEffect(() => {
    if (selectedProfile) {
      setProfile(selectedProfile);
    }
  }, [selectedProfile]);

  // Notify parent when profile changes
  const handleProfileChange = (newProfile) => {
    if (readOnly) return;
    setProfile(newProfile);
    if (onProfileChange) {
      onProfileChange(newProfile);
    }
  };
  return (
    <div className="layout-content-container flex flex-col w-80">
      <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Uploaded Files
      </h2>

      <div className="px-4 pb-4">
        <ProfileSelector
          value={profile}
          onChange={handleProfileChange}
          disabled={readOnly}
        />
      </div>

      {!readOnly && <FileUploadArea onFileUpload={onFileUpload} />}

      {files.length > 0 ? (
        <FileList files={files} onRemoveFile={onRemoveFile} />
      ) : (
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm text-center">
            No files uploaded yet. Use the upload area above to add PDF files.
          </p>
        </div>
      )}

      {!readOnly && (
        <div className="flex px-4 py-3">
          <button
            className={`flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded h-10 px-4 flex-1 text-sm font-bold leading-normal tracking-[0.015em] transition-colors ${files.length === 0 || isProcessing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#dce8f3] text-[#101518] cursor-pointer hover:bg-[#c5d8ef]"
              }`}
            onClick={onProcessFiles}
            disabled={files.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <span className="truncate">Processing...</span>
              </div>
            ) : (
              <span className="truncate">Process Files</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
