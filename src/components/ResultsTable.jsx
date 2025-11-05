import React from "react";

export default function ResultsTable({ columns, conditions, results, commonFactors, excludedFactors }) {
  return (
    <>
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
    </>
  );
}
