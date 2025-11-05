import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Research from "./components/Research";
import Data from "./components/Data";
import Scrapers from "./components/Scrapers";
import Debug from "./components/Debug";
import Plays from "./components/Plays";
import Trends from "./components/Trends";
import TodaysGames from "./components/TodaysGames";

export default function App() {
  const [activeTab, setActiveTab] = useState("/research");

  const renderTab = () => {
    switch (activeTab) {
      case "/research": return <Research />;
      case "/data": return <Data />;
      case "/scrapers": return <Scrapers />;
      case "/debug": return <Debug />;
      case "/plays": return <Plays />;
      case "/trends": return <Trends />;
      case "/todays-games": return <TodaysGames />;
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
