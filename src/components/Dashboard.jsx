import React from "react";
import Scrapers from "./Scrapers";
import Data from "./Data";
import Research from "./Research";

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sports Dashboard</h1>
      <nav>
        <ul>
          <li>Scrapers</li>
          <li>Data</li>
          <li>Research</li>
        </ul>
      </nav>

      <hr />

      <Scrapers />
      <Data />
      <Research />
    </div>
  );
}
