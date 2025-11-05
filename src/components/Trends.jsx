import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Trends() {
  const [plays, setPlays] = useState([]);
  const [trends, setTrends] = useState([]);
  const [customTrend, setCustomTrend] = useState({ metric: "", operator: ">", threshold: "" });
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const operatorMap = { ">": "gt", "<": "lt", "=": "eq" };

  useEffect(() => {
    const fetchPlays = async () => { const { data } = await supabase.from("plays").select("*"); setPlays(data || []); };
    const fetchColumns = async () => { const { data } = await supabase.from("ball_games").select("*").limit(1); if(data?.length) setColumns(Object.keys(data[0])); };
    const fetchTrends = async () => { const { data } = await supabase.from("trends").select("*"); setTrends(data || []); };

    fetchPlays(); fetchColumns(); fetchTrends();
  }, []);

  const runPlayTrend = async (play) => {
    setLoading(true); setMessage(null);
    try {
      const query = supabase.from("ball_games").select("*");
      const operatorFn = operatorMap[play.operator]; if(!operatorFn) throw new Error("Invalid operator");
      const { data, error } = await query[operatorFn](play.metric_id, Number(play.threshold)); if(error) throw error;

      const trendName = `Trend: ${play.play_name}`;
      const { data: trendData, error: trendError } = await supabase.from("trends").insert([{ play_id: play.id, trend_name: trendName, results_count: data.length }]);
      if(trendError) throw trendError;

      setTrends([...trends, ...trendData]);
      setMessage(`Trend found and saved: ${trendName} (${data.length} rows)`);
    } catch(err) { console.error(err); setMessage(`Error: ${err.message}`); }
    setLoading(false);
  };

  const runCustomTrend = async () => {
    setLoading(true); setMessage(null);
    try {
      if(!customTrend.metric || !customTrend.operator || !customTrend.threshold) throw new Error("Please fill all fields for custom trend.");
      const query = supabase.from("ball_games").select("*");
      const operatorFn = operatorMap[customTrend.operator];
      const { data, error } = await query[operatorFn](customTrend.metric, Number(customTrend.threshold));
      if(error) throw error;

      const trendName = `Custom Trend: ${customTrend.metric} ${customTrend.operator} ${customTrend.threshold}`;
      const { data: trendData, error: trendError } = await supabase.from("trends").insert([{ play_id: null, trend_name: trendName, results_count: data.length }]);
      if(trendError) throw trendError;

      setTrends([...trends, ...trendData]);
      setMessage(`Custom trend saved: ${trendName} (${data.length} rows)`);
    } catch(err) { console.error(err); setMessage(`Error: ${err.message}`); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Trends</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {loading && <p>Processing...</p>}

      <div style={{ marginBottom: "1rem" }}>
        <h3>Custom Trend</h3>
        <select value={customTrend.metric} onChange={(e) => setCustomTrend({ ...customTrend, metric: e.target.value })}>
          <option value="">Select Metric</option>
          {columns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={customTrend.operator} onChange={(e) => setCustomTrend({ ...customTrend, operator: e.target.value })}>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value="=">=</option>
        </select>
        <input type="number" placeholder="Threshold" value={customTrend.threshold} onChange={(e) => setCustomTrend({ ...customTrend, threshold: e.target.value })} />
        <button onClick={runCustomTrend} style={{ marginLeft: "0.5rem" }}>Run Custom Trend</button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <h3>Suggested Trends</h3>
        {plays.map(play => (
          <div key={play.id} style={{ marginBottom: "0.5rem" }}>
            <span>{play.play_name} ({play.metric_id} {play.operator} {play.threshold})</span>
            <button onClick={() => runPlayTrend(play)} style={{ marginLeft: "0.5rem" }}>Look for Trend</button>
          </div>
        ))}
      </div>

      <div>
        <h3>Current Trends</h3>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Trend Name</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Play ID</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Results Count</th>
            </tr>
          </thead>
          <tbody>
            {trends.map(t => (
              <tr key={t.id}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.trend_name}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.play_id || "-"}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.results_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
