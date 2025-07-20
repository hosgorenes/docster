import React, { useState, useRef } from "react";

export default function FileUploadArea({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length > 0) {
      onFileUpload(pdfFiles);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length > 0) {
      onFileUpload(pdfFiles);
    }

    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col p-4">
      <div
        className={`flex flex-col items-center gap-6 rounded-xl border-2 border-dashed px-6 py-14 cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-[#d4dce2] hover:border-blue-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
            {isDragging
              ? "Drop your PDF files here"
              : "Drag and drop a PDF here"}
          </p>
          <p className="text-[#101518] text-sm font-normal leading-normal max-w-[480px] text-center">
            Or click to browse
          </p>
        </div>
        <button
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#eaedf1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <span className="truncate">Upload PDF</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
