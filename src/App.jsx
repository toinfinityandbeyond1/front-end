import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Plays from "./components/Plays";
import Trends from "./components/Trends";
import Bots from "./components/Bots";
import TodaysGames from "./components/TodaysGames";
import Research from "./components/Research";
import Data from "./components/Data";
import Scrapers from "./components/Scrapers";
import Debug from "./components/Debug";

export default function App() {
  const [activeTab, setActiveTab] = useState("/plays");

  const renderTab = () => {
    switch (activeTab) {
      case "/plays":
        return <Plays />;
      case "/trends":
        return <Trends />;
      case "/bots":
        return <Bots />;
      case "/todays-games":
        return <TodaysGames />;
      case "/research":
        return <Research />;
      case "/data":
        return <Data />;
      case "/scrapers":
        return <Scrapers />;
      case "/debug":
        return <Debug />;
      default:
        return <Plays />;
    }
  };

  return (
    <div>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ padding: "1rem" }}>{renderTab()}</div>
    </div>
  );
}
