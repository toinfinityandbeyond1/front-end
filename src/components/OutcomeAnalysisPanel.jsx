import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function OutcomeAnalysisPanel({ columns, allGames, savedRules, setSavedRules }) {
  const [analysisOutcome, setAnalysisOutcome] = useState({ column: "", operator: ">", value: "" });
  const [patterns, setPatterns] = useState([]);

  const runAnalysis = () => {
    if (!analysisOutcome.column || analysisOutcome.value === "") return;

    const numericTypes = ["numeric", "integer", "bigint", "smallint", "real", "double precision"];
    const colType = columns.find(c => c.column_name === analysisOutcome.column)?.data_type || "text";
    const val = numericTypes.some(t => colType.includes(t)) ? Number(analysisOutcome.value) : analysisOutcome.value;

    const filteredGames = allGames.filter(g => {
      switch (analysisOutcome.operator) {
        case ">": return g[analysisOutcome.column] > val;
        case "<": return g[analysisOutcome.column] < val;
        case "=": return g[analysisOutcome.column] === val;
        default: return false;
      }
    });

    const patternSummary = columns.map(c => {
      const colVals = filteredGames.map(g => g[c.column_name]);
      const counts = {};
      colVals.forEach(v => counts[v] = (counts[v] || 0) + 1);
      const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      const percentage = mostCommon && filteredGames.length > 0 ? ((mostCommon[1] / filteredGames.length) * 100).toFixed(1) : 0;
      return { column: c.column_name, value: mostCommon?.[0], percentage: Number(percentage) };
    }).filter(p => p.percentage > 0);

    setPatterns(patternSummary);
  };

  const savePattern = async (pattern) => {
    try {
      const { data, error } = await supabase.from("saved_rules").insert([{
        column: pattern.column,
        value: pattern.value,
        percentage: pattern.percentage
      }]);
      if (error) throw error;
      setSavedRules([...savedRules, ...data]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#f9fafb" }}>
      <h3 style={{ marginBottom: "1rem", color: "#111827" }}>Outcome Analysis</h3>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
        <select
          value={analysisOutcome.column}
          onChange={e => setAnalysisOutcome({ ...analysisOutcome, column: e.target.value })}
        >
          <option value="">Select column</option>
          {columns.map(c => <option key={c.column_name} value={c.column_name}>{c.column_name}</option>)}
        </select>

        <select
          value={analysisOutcome.operator}
          onChange={e => setAnalysisOutcome({ ...analysisOutcome, operator: e.target.value })}
        >
          <option value=">">{">"}</option>
          <option value="<">{"<"}</option>
          <option value="=">{"="}</option>
        </select>

        <input
          type="number"
          placeholder="Value"
          value={analysisOutcome.value}
          onChange={e => setAnalysisOutcome({ ...analysisOutcome, value: e.target.value })}
        />

        <button
          onClick={runAnalysis}
          style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer" }}
        >
          Analyze
        </button>
      </div>

      <h4 style={{ marginTop: "1rem" }}>Discovered Patterns</h4>
      <ul>
        {patterns.map((p, i) => (
          <li key={i} style={{ marginBottom: "0.3rem" }}>
            {p.column}: {p.value} ({p.percentage}%)
            <button
              onClick={() => savePattern(p)}
              style={{ marginLeft: "0.5rem", backgroundColor: "#10b981", color: "white", border: "none", padding: "0.2rem 0.5rem", borderRadius: "4px", cursor: "pointer" }}
            >
              Save
            </button>
          </li>
        ))}
      </ul>

      <h4 style={{ marginTop: "1rem" }}>Saved Rules</h4>
      <ul>
        {savedRules.map((r, i) => (
          <li key={i}>{r.column}: {r.value} ({r.percentage}%)</li>
        ))}
      </ul>
    </div>
  );
}
