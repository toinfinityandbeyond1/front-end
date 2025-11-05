import React from "react";

export default function NavBar({ activeTab, setActiveTab }) {
  const tabs = [
    { name: "Today's Games", path: "/todaysgames" },
    { name: "Plays", path: "/plays" },
    { name: "Trends", path: "/trends" },    
    { name: "Bots", path: "/bots" },
    { name: "Research", path: "/research" },
    { name: "Data", path: "/data" },
    { name: "Scrapers", path: "/scrapers" },
    { name: "Debug", path: "/debug" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "flex-start",
        backgroundColor: "#1f2937",
        padding: "0.5rem 2rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        flexWrap: "wrap",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => setActiveTab(tab.path)}
          style={{
            marginRight: "1rem",
            marginBottom: "0.5rem",
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: activeTab === tab.path ? "#3b82f6" : "#374151",
            color: activeTab === tab.path ? "white" : "#d1d5db",
            transition: "background-color 0.2s",
          }}
        >
          {tab.name}
        </button>
      ))}
    </nav>
  );
}
