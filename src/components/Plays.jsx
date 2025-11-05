import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Plays() {
  const [plays, setPlays] = useState([]);
  const [books, setBooks] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [newPlay, setNewPlay] = useState({
    book_id: "",
    metric_id: "",
    operator: ">",
    threshold: "",
    multiplier: 1,
    name: "",
  });
  const [error, setError] = useState(null);

  // Fetch existing plays, books, metrics
  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const { data, error } = await supabase.from("plays").select("*");
        if (error) throw error;
        setPlays(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchBooks = async () => {
      try {
        const { data } = await supabase.from("books").select("*");
        setBooks(data || []);
      } catch {}
    };

    const fetchMetrics = async () => {
      try {
        const { data } = await supabase.from("ball_games").select("*").limit(1);
        setMetrics(data?.length ? Object.keys(data[0]).filter(k => k !== "id" && k !== "date") : []);
      } catch {}
    };

    fetchPlays();
    fetchBooks();
    fetchMetrics();
  }, []);

  const handleAddPlay = async () => {
    if (!newPlay.name || !newPlay.book_id || !newPlay.metric_id || !newPlay.threshold) {
      setError("All fields are required.");
      return;
    }

    try {
      const { data, error } = await supabase.from("plays").insert([newPlay]);
      if (error) throw error;
      setPlays([...plays, ...data]);
      setNewPlay({ book_id: "", metric_id: "", operator: ">", threshold: "", multiplier: 1, name: "" });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Plays</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Add New Play */}
      <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
        <input
          placeholder="Play Name"
          value={newPlay.name}
          onChange={(e) => setNewPlay({ ...newPlay, name: e.target.value })}
        />
        <select value={newPlay.book_id} onChange={(e) => setNewPlay({ ...newPlay, book_id: e.target.value })}>
          <option value="">Select Book</option>
          {books.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={newPlay.metric_id} onChange={(e) => setNewPlay({ ...newPlay, metric_id: e.target.value })}>
          <option value="">Select Metric</option>
          {metrics.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={newPlay.operator} onChange={(e) => setNewPlay({ ...newPlay, operator: e.target.value })}>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value="=">=</option>
        </select>
        <input
          type="number"
          placeholder="Threshold"
          value={newPlay.threshold}
          onChange={(e) => setNewPlay({ ...newPlay, threshold: e.target.value })}
        />
        <input
          type="number"
          placeholder="Multiplier"
          value={newPlay.multiplier}
          step="0.01"
          onChange={(e) => setNewPlay({ ...newPlay, multiplier: parseFloat(e.target.value) })}
        />
        <button onClick={handleAddPlay} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Add Play
        </button>
      </div>

      {/* Plays Table */}
      <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Book</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Metric</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Operator</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Threshold</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Multiplier</th>
          </tr>
        </thead>
        <tbody>
          {plays.map((p) => (
            <tr key={p.id} style={{ textAlign: "center", borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{p.name}</td>
              <td style={{ padding: "0.5rem" }}>{books.find((b) => b.id === p.book_id)?.name || "-"}</td>
              <td style={{ padding: "0.5rem" }}>{p.metric_id}</td>
              <td style={{ padding: "0.5rem" }}>{p.operator}</td>
              <td style={{ padding: "0.5rem" }}>{p.threshold}</td>
              <td style={{ padding: "0.5rem" }}>{p.multiplier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
