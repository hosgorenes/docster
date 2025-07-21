import React from "react";

export default function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "json", label: "JSON" },
    { id: "csv", label: "CSV" },
  ];

  return (
    <div className="pb-3">
      <div className="flex border-b border-[#d4dce2] justify-between">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 flex-1 cursor-pointer ${
              activeTab === tab.id
                ? "border-b-[#dce8f3] text-[#101518]"
                : "border-b-transparent text-[#5c748a]"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <p
              className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                activeTab === tab.id ? "text-[#101518]" : "text-[#5c748a]"
              }`}
            >
              {tab.label}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
