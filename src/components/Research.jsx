import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Research() {
  const [query, setQuery] = useState(""); // user input like "ats_margin > 14"
  const [results, setResults] = useState([]);
  const [commonFactors, setCommonFactors] = useState({});
  const [excludedFactors, setExcludedFactors] = useState({});

  // Fetch all games initially
  const fetchAllGames = async () => {
    const { data, error } = await supabase.from("games").select("*");
    if (error) {
      console.error(error);
    } else {
      return data;
    }
  };

  const handleSearch = async () => {
    const allGames = await fetchAllGames();

    // Parse user query
    // Example: "ats_margin > 14" → simple dynamic filter
    let filteredGames = [];
    try {
      filteredGames = allGames.filter((game) => {
        // Unsafe eval for demo purposes
        return eval(`game.${query}`);
      });
    } catch (e) {
      console.error("Error parsing query:", e);
      return;
    }
    setResults(filteredGames);

    // Find common factors
    const allKeys = Object.keys(allGames[0] || {});
    const common = {};
    const excluded = {};

    allKeys.forEach((key) => {
      if (key === "id" || key === "date") return; // skip irrelevant
      const valuesInIncluded = filteredGames.map((g) => g[key]);
      const valuesInExcluded = allGames
        .filter((g) => !filteredGames.includes(g))
        .map((g) => g[key]);

      // Common in included
      const uniqueIncluded = [...new Set(valuesInIncluded)];
      if (uniqueIncluded.length === 1) common[key] = uniqueIncluded[0];

      // Common in excluded
      const uniqueExcluded = [...new Set(valuesInExcluded)];
      if (uniqueExcluded.length === 1) excluded[key] = uniqueExcluded[0];
    });

    setCommonFactors(common);
    setExcludedFactors(excluded);
  };

  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ color: "#111827" }}>Research</h2>
      <p style={{ color: "#374151" }}>
        Enter a query like <code>ats_margin &gt; 14</code> or <code>ats_margin &lt; -14</code>
      </p>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. ats_margin > 14"
        style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Search
      </button>

      <h3>Results ({results.length})</h3>
      <ul>
        {results.map((game) => (
          <li key={game.id}>
            {game.date}: ATS Margin = {game.ats_margin}, PPG = {game.ppg}, PPG Ranking = {game.ppg_ranking}
          </li>
        ))}
      </ul>

      <h3>Common Factors in Results</h3>
      <ul>
        {Object.entries(commonFactors).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>

      <h3>Common Factors in Excluded Games</h3>
      <ul>
        {Object.entries(excludedFactors).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
}