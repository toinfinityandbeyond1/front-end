import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Scrapers from "./components/Scrapers";
import Data from "./components/Data";
import Research from "./components/Research";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load last tab from localStorage, default to '/scrapers'
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem("activeTab");
    return saved || "/scrapers";
  });

  // Sync activeTab with URL
  useEffect(() => {
    if (location.pathname !== activeTab) {
      navigate(activeTab, { replace: true });
    }
  }, [activeTab]);

  // Save tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to={activeTab} replace />} />
          <Route path="/scrapers" element={<Scrapers />} />
          <Route path="/data" element={<Data />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </div>
    </div>
  );
}
