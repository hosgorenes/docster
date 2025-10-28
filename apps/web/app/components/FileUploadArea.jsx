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
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }

    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const validateFiles = (files) => {
    const validFiles = [];
    const maxFileSize = 10 * 1024 * 1024; // 10MB limit

    for (const file of files) {
      if (file.type !== "application/pdf") {
        alert(`"${file.name}" is not a PDF file and will be ignored.`);
        continue;
      }

      if (file.size > maxFileSize) {
        alert(`"${file.name}" is too large. Maximum file size is 10MB.`);
        continue;
      }

      if (file.size === 0) {
        alert(`"${file.name}" is empty and will be ignored.`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col p-4">
      <div
        className={`flex flex-col items-center gap-6 rounded-xl border-2 border-dashed px-6 py-14 cursor-pointer transition-colors ${isDragging
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
              : "Drag and drop PDF files here"}
          </p>
          <p className="text-[#101518] text-sm font-normal leading-normal max-w-[480px] text-center">
            Or click to browse (Max 10MB per file)
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
