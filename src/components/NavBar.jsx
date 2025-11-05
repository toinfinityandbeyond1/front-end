import React from "react";

export default function NavBar({ activeTab, setActiveTab }) {
  const tabs = [
    { label: "Plays", path: "/plays" },
    { label: "Trends", path: "/trends" },
    { label: "Bots", path: "/bots" },
    { label: "Today's Games", path: "/todays-games" },
    { label: "Research", path: "/research" },
    { label: "Data", path: "/data" },
    { label: "Scrapers", path: "/scrapers" },
    { label: "Debug", path: "/debug" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        gap: "0.5rem",
        padding: "1rem",
        backgroundColor: "#111827",
        color: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderRadius: "0 0 8px 8px",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => setActiveTab(tab.path)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === tab.path ? "#3b82f6" : "transparent",
            color: activeTab === tab.path ? "white" : "#d1d5db",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.path) e.target.style.backgroundColor = "#1f2937";
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.path) e.target.style.backgroundColor = "transparent";
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
