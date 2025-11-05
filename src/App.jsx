import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Scrapers from "./components/Scrapers";
import Data from "./components/Data";
import Research from "./components/Research";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load last tab from localStorage, default to "/research"
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "/research";
  });

  // Sync URL with activeTab
  useEffect(() => {
    if (location.pathname !== activeTab) {
      navigate(activeTab, { replace: true });
    }
  }, [activeTab]);

  // Save active tab in localStorage
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to={activeTab} replace />} />
          <Route path="/research" element={<Research />} />
          <Route path="/data" element={<Data />} />
          <Route path="/scrapers" element={<Scrapers />} />
        </Routes>
      </div>
    </div>
  );
}
