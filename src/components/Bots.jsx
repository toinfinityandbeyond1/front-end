import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Bots() {
  const [bots, setBots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const { data, error } = await supabase.from("bots").select("*");
        if (error) throw error;
        setBots(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBots();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Bots</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Wallet</th>
            <th>Tracked Trends</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((b) => (
            <tr key={b.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{b.name}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{b.wallet_balance}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{b.tracked_trends}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{b.performance_metrics}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
