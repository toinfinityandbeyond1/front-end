import React, { useState } from "react";

export default function Simulator({ columns, allGames }) {
  const [analysisOutcome, setAnalysisOutcome] = useState({ column: "", operator: ">", value: "" });
  const [teamAnalysis, setTeamAnalysis] = useState([]);
  const [offRankAnalysis, setOffRankAnalysis] = useState([]);

  const Simulate = () => {
    if (!analysisOutcome.column || analysisOutcome.value === "") return;

    const val = Number(analysisOutcome.value);
    const op = analysisOutcome.operator;

    // Filter games based on outcome
    const filteredGames = allGames.filter(g => {
      switch (op) {
        case ">": return g[analysisOutcome.column] > val;
        case "<": return g[analysisOutcome.column] < val;
        case "=": return g[analysisOutcome.column] === val;
        default: return false;
      }
    });

    // ---- Top 30 Teams Analysis ----
    const teamMap = {};
    allGames.forEach(g => {
      [g.home_team, g.away_team].forEach(team => {
        if (!teamMap[team]) teamMap[team] = { total: 0, matched: 0 };
      });
    });

    filteredGames.forEach(g => {
      if (teamMap[g.home_team]) teamMap[g.home_team].matched++;
      if (teamMap[g.away_team]) teamMap[g.away_team].matched++;
    });

    allGames.forEach(g => {
      if (teamMap[g.home_team]) teamMap[g.home_team].total++;
      if (teamMap[g.away_team]) teamMap[g.away_team].total++;
    });

    const teamResults = Object.entries(teamMap).map(([team, data]) => ({
      team,
      percentage: data.total ? ((data.matched / data.total) * 100).toFixed(1) : 0,
      total: data.total,
      matched: data.matched
    })).sort((a, b) => b.percentage - a.percentage);

    setTeamAnalysis(teamResults.slice(0, 30)); // top 30 teams

    // ---- By Offensive Rank Analysis (ppg_rank) ----
    const rankMap = {};
    allGames.forEach(g => {
      const rank = g.ppg_rank;
      if (rank != null) {
        if (!rankMap[rank]) rankMap[rank] = { total: 0, matched: 0 };
        rankMap[rank].total++;
      }
    });

    filteredGames.forEach(g => {
      const rank = g.ppg_rank;
      if (rank != null && rankMap[rank]) rankMap[rank].matched++;
    });

    const rankResults = Object.entries(rankMap).map(([rank, data]) => ({
      rank,
      percentage: data.total ? ((data.matched / data.total) * 100).toFixed(1) : 0,
      total: data.total,
      matched: data.matched
    })).sort((a, b) => b.percentage - a.percentage);

    setOffRankAnalysis(rankResults);
  };

  // Columns to exclude from pattern analysis
  const excludedColumns = ["created_at", "game_date"];

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Simulator</h3>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <select
          value={analysisOutcome.column}
          onChange={e => setAnalysisOutcome({ ...analysisOutcome, column: e.target.value })}
        >
          <option value="">Select column</option>
          {columns.filter(c => !excludedColumns.includes(c.column_name)).map(c => (
            <option key={c.column_name} value={c.column_name}>{c.column_name}</option>
          ))}
        </select>
        <select
          value={analysisOutcome.operator}
          onChange={e => setAnalysisOutcome({ ...analysisOutcome, operator: e.target.value })}
        >
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value="=">=</option>
        </select>
        <input
          type="number"
          placeholder="Value"
          value={analysisOutcome.value}
          onChange={e => setAnalysisOutcome({ ...analysisOutcome, value: e.target.value })}
        />
        <button
          onClick={Simulate}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Analyze
        </button>
      </div>

      {/* Top 30 Teams */}
      <div style={{
        border: "2px solid #10b981",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        width: "48%"
      }}>
        <h4>Top 30 Teams</h4>
        <ul>
          {teamAnalysis.map((t, i) => (
            <li key={i}>{t.team}: {t.percentage}% ({t.matched}/{t.total})</li>
          ))}
        </ul>
      </div>

      {/* Offensive Rank */}
      <div style={{
        border: "2px solid #f59e0b",
        borderRadius: "8px",
        padding: "1rem",
        width: "48%"
      }}>
        <h4>By Offensive Rank (ppg_rank)</h4>
        <ul>
          {offRankAnalysis.map((r, i) => (
            <li key={i}>Rank {r.rank}: {r.percentage}% ({r.matched}/{r.total})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
