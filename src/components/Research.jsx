import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Research() {
  const [columns, setColumns] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [results, setResults] = useState([]);
  const [excluded, setExcluded] = useState([]);
  const [commonFactors, setCommonFactors] = useState({});
  const [excludedFactors, setExcludedFactors] = useState({});

  // -------- Load columns from table metadata --------
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const { data, error } = await supabase
          .from("information_schema.columns")
          .select("column_name")
          .eq("table_name", "games");

        if (error) throw error;

        // filter out system columns
        const cols = data
          .map((c) => c.column_name)
          .filter((c) => c !== "id" && c !== "date");
        setColumns(cols);
      } catch (err) {
        console.error("Error fetching columns:", err);
      }
    };

    fetchColumns();
  }, []);

  // -------- Add / update conditions --------
  const addCondition = () => {
    setConditions([...conditions, { logic: "AND", column: "", operator: ">", value: "" }]);
  };

  const updateCondition = (index, key, value) => {
    const newConditions = [...conditions];
    newConditions[index][key] = value;
    setConditions(newConditions);
  };

  // -------- Run query with conditions --------
  const handleReverseEngineer = async () => {
    if (conditions.length === 0) return;

    let includedGames = [];

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

    for (let group of orGroups) {
      let query = supabase.from("games").select("*");
      group.forEach(({ column, operator, value }) => {
        if (!column || value === "") return;
        switch (operator) {
          case ">":
            query = query.gt(column, value);
            break;
          case "<":
            query = query.lt(column, value);
            break;
          case "=":
            query = query.eq(column, value);
            break;
          default:
            break;
        }
      });

      const { data, error } = await query;
      if (error) continue;
      data.forEach((g) => {
        if (!includedGames.some((i) => i.id === g.id)) includedGames.push(g);
      });
    }

    setResults(includedGames);

    // Fetch all games to compute excluded & common factors
    const { data: allGames, error: allError } = await supabase.from("games").select("*");
    if (allError) return console.error(allError);
    const excludedGames = allGames.filter((g) => !includedGames.some((i) => i.id === g.id));
    setExcluded(excludedGames);

    // Compute common factors
    const factorCols = columns;
    const common = {};
    const excludedCommon = {};
    factorCols.forEach((col) => {
      const includedValues = [...new Set(includedGames.map((g) => g[col]))];
      if (includedValues.length === 1) common[col] = includedValues[0];
      const excludedValues = [...new Set(excludedGames.map((g) => g[col]))];
      if (excludedValues.length === 1) excludedCommon[col] = excludedValues[0];
    });
    setCommonFactors(common);
    setExcludedFactors(excludedCommon);
  };

  // -------- JSX UI --------
  return (
    <div style={{ padding: "2rem", backgroundColor: "#f3f4f6", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
      <h2 style={{ color: "#111827" }}>Research</h2>

      <div style={{ marginBottom: "1rem" }}>
        {conditions.map((cond, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {idx > 0 && (
              <select value={cond.logic} onChange={(e) => updateCondition(idx, "logic", e.target.value)}>
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            )}

            <select value={cond.column} onChange={(e) => updateCondition(idx, "column", e.target.value)}>
              <option value="">Select column</option>
              {columns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>

            <select value={cond.operator} onChange={(e) => updateCondition(idx, "operator", e.target.value)}>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value="=">=</option>
            </select>

            <input
              type="number"
              value={cond.value}
              onChange={(e) => updateCondition(idx, "value", e.target.value)}
              placeholder="Value"
              style={{ width: "100px" }}
            />
          </div>
        ))}

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
            {columns.map((col) => <th key={col} style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {results.map((g) => (
            <tr key={g.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{g.date}</td>
              {columns.map((col) => (
                <td key={col} style={{
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                  backgroundColor: conditions.some(c => c.column === col && (
                    (c.operator === ">" && g[col] > Number(c.value)) ||
                    (c.operator === "<" && g[col] < Number(c.value)) ||
                    (c.operator === "=" && g[col] === Number(c.value))
                  )) ? "#d1fae5" : "transparent"
                }}>
                  {g[col]}
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
