import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Trends() {
  const [trends, setTrends] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const { data, error } = await supabase
          .from("trends")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        setTrends(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTrends();
  }, []);

  const handleFindPatterns = async () => {
    // Placeholder for ad-hoc pattern detection logic
    console.log("Finding patterns...");
    // You can implement variance analysis / ROI-based detection here
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Trends</h2>
      <button
        onClick={handleFindPatterns}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
      >
        Find Patterns
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Trend Name</th>
            <th>Play ID</th>
            <th>ROI</th>
            <th>Hit Rate</th>
            <th>Variance</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {trends.map((t) => (
            <tr key={t.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.trend_name}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.play_id}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.roi}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.hit_rate}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.variance}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
