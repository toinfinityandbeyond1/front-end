import React, { useState, useEffect } from "react";
import Scrapers from "./Scrapers";
import Data from "./Data";
import Research from "./Research";

export default function Dashboard() {
  // Load saved tab from localStorage, or default to "Scrapers"
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("activeTab") || "Scrapers"
  );

  // Save whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case "Scrapers":
        return <Scrapers />;
      case "Data":
        return <Data />;
      case "Research":
        return <Research />;
      default:
        return <Scrapers />;
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Sports Dashboard</h1>

      <nav style={{ marginBottom: "1rem" }}>
        {["Scrapers", "Data", "Research"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              marginRight: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === tab ? "#007BFF" : "#EEE",
              color: activeTab === tab ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <hr />
      {renderTab()}
    </div>
  );
}
