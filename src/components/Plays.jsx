import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Plays() {
  const [plays, setPlays] = useState([]);
  const [books, setBooks] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [newPlay, setNewPlay] = useState({
    play_name: "",
    book_id: "",
    metric_id: "",
    operator: ">",
    threshold: "",
    multiplier: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [rowData, setRowData] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch plays, books, metrics
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
        setMetrics(data?.length ? Object.keys(data[0]) : []);
      } catch {}
    };

    fetchPlays();
    fetchBooks();
    fetchMetrics();
  }, []);

  // Add new play
  const handleAddPlay = async () => {
    try {
      const { data, error } = await supabase.from("plays").insert([newPlay]).select();
      if (error) throw error;
      setPlays([...plays, ...data]);
      setNewPlay({ play_name: "", book_id: "", metric_id: "", operator: ">", threshold: "", multiplier: 1 });
      setSuccessMessage("Play added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit row
  const handleEdit = (play) => {
    setEditingId(play.id);
    setRowData(play);
  };

  // Save edited row
  const handleSave = async (id) => {
    try {
      const { data, error } = await supabase.from("plays").update(rowData).eq("id", id).select();
      if (error) throw error;
      setPlays(plays.map(p => (p.id === id ? data[0] : p)));
      setEditingId(null);
      setRowData({});
      setSuccessMessage("Play saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete play
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("plays").delete().eq("id", id);
      if (error) throw error;
      setPlays(plays.filter(p => p.id !== id));
      setSuccessMessage("Play deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Plays</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {/* Add Play Section */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          placeholder="Play Name"
          value={newPlay.play_name}
          onChange={(e) => setNewPlay({ ...newPlay, play_name: e.target.value })}
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
        <button onClick={handleAddPlay} style={{ backgroundColor: "#10b981", color: "white", padding: "0.5rem 1rem", borderRadius: "5px", border: "none" }}>
          Add Play
        </button>
      </div>

      {/* Plays Table */}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th>Name</th>
            <th>Book</th>
            <th>Metric</th>
            <th>Operator</th>
            <th>Threshold</th>
            <th>Multiplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plays.map((p) => (
            <tr key={p.id}>
              <td>
                {editingId === p.id ? (
                  <input value={rowData.play_name} onChange={(e) => setRowData({ ...rowData, play_name: e.target.value })} />
                ) : (
                  p.play_name
                )}
              </td>
              <td>
                {editingId === p.id ? (
                  <select value={rowData.book_id} onChange={(e) => setRowData({ ...rowData, book_id: e.target.value })}>
                    {books.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                ) : (
                  books.find((b) => b.id === p.book_id)?.name
                )}
              </td>
              <td>
                {editingId === p.id ? (
                  <select value={rowData.metric_id} onChange={(e) => setRowData({ ...rowData, metric_id: e.target.value })}>
                    {metrics.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                ) : (
                  p.metric_id
                )}
              </td>
              <td>
                {editingId === p.id ? (
                  <select value={rowData.operator} onChange={(e) => setRowData({ ...rowData, operator: e.target.value })}>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value="=">=</option>
                  </select>
                ) : (
                  p.operator
                )}
              </td>
              <td>
                {editingId === p.id ? (
                  <input type="number" value={rowData.threshold} onChange={(e) => setRowData({ ...rowData, threshold: e.target.value })} />
                ) : (
                  p.threshold
                )}
              </td>
              <td>
                {editingId === p.id ? (
                  <input type="number" step="0.01" value={rowData.multiplier} onChange={(e) => setRowData({ ...rowData, multiplier: parseFloat(e.target.value) })} />
                ) : (
                  p.multiplier
                )}
              </td>
              <td style={{ display: "flex", gap: "0.5rem" }}>
                {editingId === p.id ? (
                  <button onClick={() => handleSave(p.id)} style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "0.3rem 0.6rem", borderRadius: "4px" }}>Save Changes</button>
                ) : (
                  <button onClick={() => handleEdit(p)} style={{ backgroundColor: "#f59e0b", color: "white", border: "none", padding: "0.3rem 0.6rem", borderRadius: "4px" }}>Edit</button>
                )}
                <button onClick={() => handleDelete(p.id)} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "0.3rem 0.6rem", borderRadius: "4px" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
