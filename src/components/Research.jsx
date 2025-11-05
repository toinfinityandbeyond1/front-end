import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Research() {
  const [columns, setColumns] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [results, setResults] = useState([]);
  const [, setExcluded] = useState([]); // unused, avoid eslint error
  const [commonFactors, setCommonFactors] = useState({});
  const [excludedFactors, setExcludedFactors] = useState({});
  const [error, setError] = useState(null);

  // ---------------- Quick test fetch ----------------
  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log("Testing full table fetch...");
        const { data, error } = await supabase.from("ball_games").select("*").limit(5);
        if (error) throw error;
        console.log("Test fetch returned rows:", data);
      } catch (err) {
        console.error("Test fetch error:", err);
      }
    };
    testFetch();
  }, []);

  // ---------------- Load columns from RPC ----------------
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        console.log("Fetching columns from RPC...");
        const { data, error } = await supabase.rpc("get_table_columns", { tablename: "ball_games" });
        if (error) throw error;

        const filtered = data.filter(c => !["id", "date"].includes(c.column_name));
        console.log("Columns loaded:", filtered);
        setColumns(filtered);
      } catch (err) {
        console.error("Error fetching columns:", err);
        setError(err.message);
      }
    };
    fetchColumns();
  }, []);

  // ---------------- Add / update conditions ----------------
  const addCondition = () => {
    setConditions([...conditions, { logic: "AND", column: "", operator: "", value: "" }]);
  };

  const updateCondition = (index, key, value) => {
    const updated = [...conditions];
    updated[index][key] = value;
    setConditions(updated);
  };

  // ---------------- Reverse Engineer ----------------
  const handleReverseEngineer = async () => {
    console.log("=== Reverse Engineer started ===");
    console.log("Conditions:", conditions);

    if (!conditions.length) return;

    let includedGames = [];
    const numericTypes = ["numeric", "integer", "bigint", "smallint", "real", "double precision"];

    // Split into OR groups
    let orGroups = [];
    let currentGroup = [];
    conditions.forEach((cond, i) => {
      currentGroup.push(cond);
      if (cond.logic === "OR" || i === conditions.length - 1) {
        orGroups.push([...currentGroup]);
        currentGroup = [];
      }
    });
    console.log("OR groups:", orGroups);

    for (let [groupIndex, group] of orGroups.entries()) {
      let query = supabase.from("ball_games").select("*");
      console.log(`Processing group ${groupIndex + 1}:`, group);

      for (let cond of group) {
        if (!cond.column || cond.value === "") {
          console.warn("Skipping incomplete condition:", cond);
          continue;
        }

        const colType = columns.find(c => c.column_name === cond.column)?.data_type || "text";
        const val = numericTypes.some(t => colType.includes(t)) ? Number(cond.value) : cond.value;
        console.log(`Filtering ${cond.column} ${cond.operator} ${val} (type: ${colType})`);

        switch (cond.operator) {
          case ">": query = query.gt(cond.column, val); break;
          case "<": query = query.lt(cond.column, val); break;
          case "=": query = query.eq(cond.column, val); break;
          default: console.warn("Unknown operator:", cond.operator); break;
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase query error:", error);
        continue;
      }
      console.log("Query returned rows:", data?.length);
      data.forEach((g) => {
        if (!includedGames.some(i => i.id === g.id)) includedGames.push(g);
      });
    }

    console.log("Total included games:", includedGames.length);
    setResults(includedGames);

    // Fetch all games to compute excluded & common factors
    const { data: allGames, error: allError } = await supabase.from("ball_games").select("*");
    if (allError) {
      console.error("Error fetching all games:", allError);
      return;
    }

    const excludedGames = allGames.filter(g => !includedGames.some(i => i.id === g.id));
    console.log("Total excluded games:", excludedGames.length);
    setExcluded(excludedGames);

    // Compute common factors
    const factorCols = columns.map(c => c.column_name);
    const common = {};
    const excludedCommon = {};
    factorCols.forEach(col => {
      const includedVals = [...new Set(includedGames.map(g => g[col]))];
      if (includedVals.length === 1) common[col] = includedVals[0];

      const excludedVals = [...new Set(excludedGames.map(g => g[col]))];
      if (excludedVals.length === 1) excludedCommon[col] = excludedVals[0];
    });

    console.log("Common factors in included games:", common);
    console.log("Common factors in excluded games:", excludedCommon);

    setCommonFactors(common);
    setExcludedFactors(excludedCommon);

    console.log("=== Reverse Engineer complete ===");
  };

  // ---------------- JSX UI ----------------
  return (
    <div style={{ padding: "2rem", backgroundColor: "#f3f4f6", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
      <h2 style={{ color: "#111827" }}>Research</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{ marginBottom: "1rem" }}>
        {conditions.map((cond, idx) => {
          const colType = columns.find(c => c.column_name === cond.column)?.data_type || "text";
          const operators = colType.includes("numeric") || colType.includes("integer") ? [">","<","="] : ["=","contains"];

          return (
            <div key={idx} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {idx > 0 && (
                <select value={cond.logic} onChange={e => updateCondition(idx, "logic", e.target.value)}>
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              )}

              <select value={cond.column} onChange={e => updateCondition(idx, "column", e.target.value)}>
                <option value="">Select column</option>
                {columns.map(c => <option key={c.column_name} value={c.column_name}>{c.column_name}</option>)}
              </select>

              <select value={cond.operator} onChange={e => updateCondition(idx, "operator", e.target.value)}>
                <option value="">Select operator</option>
                {operators.map(op => <option key={op} value={op}>{op}</option>)}
              </select>

              <input
                type={colType.includes("numeric") || colType.includes("integer") ? "number" : "text"}
                value={cond.value}
                onChange={e => updateCondition(idx, "value", e.target.value)}
                placeholder="Value"
                style={{ width: "100px" }}
              />
            </div>
          );
        })}

        <button onClick={addCondition} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "1rem" }}>
          Add Condition
        </button>

        <button onClick={handleReverseEngineer} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Reverse Engineer
        </button>
      </div>

      <h3>Results ({results.length})</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Date</th>
            {columns.map(c => <th key={c.column_name} style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{c.column_name}</th>)}
          </tr>
        </thead>
        <tbody>
          {results.map(g => (
            <tr key={g.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{g.date}</td>
              {columns.map(c => (
                <td key={c.column_name} style={{
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                  backgroundColor: conditions.some(cond =>
                    cond.column === c.column_name &&
                    ((cond.operator === ">" && g[c.column_name] > Number(cond.value)) ||
                     (cond.operator === "<" && g[c.column_name] < Number(cond.value)) ||
                     (cond.operator === "=" && g[c.column_name] === (isNaN(Number(cond.value)) ? cond.value : Number(cond.value))))
                  ) ? "#d1fae5" : "transparent"
                }}>
                  {g[c.column_name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Common Factors in Results</h3>
      <ul>{Object.entries(commonFactors).map(([k,v]) => <li key={k}>{k}: {v}</li>)}</ul>

      <h3>Common Factors in Excluded Games</h3>
      <ul>{Object.entries(excludedFactors).map(([k,v]) => <li key={k}>{k}: {v}</li>)}</ul>
    </div>
  );
}
