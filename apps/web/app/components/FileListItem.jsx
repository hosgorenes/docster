import React from 'react';

export default function FileListItem({ fileName, fileSize, onRemove }) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2 justify-between">
      <div className="flex items-center gap-4">
        <div
          className="text-[#101518] flex items-center justify-center rounded bg-[#eaedf1] shrink-0 size-12"
          data-icon="File"
          data-size="24px"
          data-weight="regular"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[#101518] text-base font-medium leading-normal line-clamp-1">
            {fileName}
          </p>
          <p className="text-[#5c748a] text-sm font-normal leading-normal line-clamp-2">
            {fileSize}
          </p>
        </div>
      </div>
      <div className="shrink-0">
        <button
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-8 px-4 bg-[#eaedf1] text-[#101518] text-sm font-medium leading-normal w-fit"
          onClick={() => onRemove(fileName)}
        >
          <span className="truncate">Remove</span>
        </button>
      </div>
    </div>
  );
}
