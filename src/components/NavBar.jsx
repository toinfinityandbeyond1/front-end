import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav style={{ padding: "1rem", background: "#f0f0f0" }}>
      {["Scrapers", "Data", "Research"].map((tab) => (
        <NavLink
          key={tab}
          to={`/${tab.toLowerCase()}`}
          style={({ isActive }) => ({
            marginRight: "1rem",
            textDecoration: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            backgroundColor: isActive ? "#007BFF" : "#EEE",
            color: isActive ? "white" : "black",
          })}
        >
          {tab}
        </NavLink>
      ))}
    </nav>
  );
}
