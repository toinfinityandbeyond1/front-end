import React from "react";

export default function NavBar({ activeTab, setActiveTab }) {
  const tabs = [
    { name: "Scrapers", path: "/scrapers" },
    { name: "Data", path: "/data" },
    { name: "Research", path: "/research" },
  ];

  return (
    <nav style={{ padding: "1rem", background: "#f0f0f0" }}>
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => setActiveTab(tab.path)}
          style={{
            marginRight: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            backgroundColor: activeTab === tab.path ? "#007BFF" : "#EEE",
            color: activeTab === tab.path ? "white" : "black",
          }}
        >
          {tab.name}
        </button>
      ))}
    </nav>
  );
}
