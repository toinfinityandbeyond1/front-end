import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Research from "./components/Research";
import Data from "./components/Data";
import Scrapers from "./components/Scrapers";
import Debug from "./components/Debug";

// New components placeholders
import TodaysGames from "./components/TodaysGames";
import Trends from "./components/Trends";
import Plays from "./components/Plays";
import Bots from "./components/Bots";

export default function App() {
  const [activeTab, setActiveTab] = useState("/todaysgames");

  const renderTab = () => {
    switch (activeTab) {
      case "/todaysgames": return <TodaysGames />;
      case "/trends": return <Trends />;
      case "/plays": return <Plays />;
      case "/bots": return <Bots />;
      case "/research": return <Research />;
      case "/data": return <Data />;
      case "/scrapers": return <Scrapers />;
      case "/debug": return <Debug />;
      default: return <TodaysGames />;
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
