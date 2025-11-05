import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function TodaysGames() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodaysGames = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("ball_games")
          .select("*")
          .eq("date", today);

        if (error) throw error;
        setGames(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTodaysGames();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Todays Games</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>ATS Margin</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{g.date}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{g.home_team}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{g.away_team}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{g.ats_margin}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{g.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
