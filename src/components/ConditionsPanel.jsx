import React from "react";

export default function ConditionsPanel({ columns, conditions, setConditions, onAnalyze }) {
  const addCondition = () => setConditions([...conditions, { logic: "AND", column: "", operator: "", value: "" }]);
  const updateCondition = (index, key, value) => {
    const updated = [...conditions];
    updated[index][key] = value;
    setConditions(updated);
  };

  return (
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
            <input type={colType.includes("numeric") || colType.includes("integer") ? "number" : "text"}
              value={cond.value}
              onChange={e => updateCondition(idx, "value", e.target.value)}
              placeholder="Value"
              style={{ width: "100px" }}
            />
          </div>
        );
      })}
      <button onClick={addCondition} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "1rem" }}>Add Condition</button>
      <button onClick={onAnalyze} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Analyze</button>
    </div>
  );
}
