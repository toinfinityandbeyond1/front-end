import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Research from "./components/Research";
import Data from "./components/Data";
import Scrapers from "./components/Scrapers";
import Debug from "./components/Debug"; // <-- import Debug

export default function App() {
  const [activeTab, setActiveTab] = useState("/research");

  const renderTab = () => {
    switch (activeTab) {
      case "/research": return <Research />;
      case "/data": return <Data />;
      case "/scrapers": return <Scrapers />;
      case "/debug": return <Debug />; // <-- render Debug tab
      default: return <Research />;
    }
  };

  return (
    <div>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ padding: "1rem" }}>
        {renderTab()}
      </div>
    </div>
  );
}