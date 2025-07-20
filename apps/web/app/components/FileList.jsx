import React from 'react';
import FileListItem from './FileListItem';

export default function FileList({ files, onRemoveFile }) {
  return (
    <div className="flex flex-col">
      {files.map((file, index) => (
        <FileListItem
          key={index}
          fileName={file.name}
          fileSize={file.size}
          onRemove={onRemoveFile}
        />
      ))}
    </div>
  );
}
