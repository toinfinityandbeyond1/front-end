import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Scrapers from "./components/Scrapers";
import Data from "./components/Data";
import Research from "./components/Research";
import NavBar from "./components/NavBar"; // optional top nav

function App() {
  return (
    <div>
      <NavBar />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/scrapers" replace />} />
          <Route path="/scrapers" element={<Scrapers />} />
          <Route path="/data" element={<Data />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
