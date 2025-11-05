// src/components/Debug.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Debug() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        console.log("Testing Supabase connection...");

        const { data: colData, error: colError } = await supabase
          .from("information_schema.columns")
          .select("column_name")
          .eq("table_schema", "public")
          .eq("table_name", "games");

        if (colError) setError(colError.message);
        else setColumns(colData.map((c) => c.column_name));

        const { data: rowData, error: rowError } = await supabase
          .from("games")
          .select("*")
          .limit(1);

        if (rowError) setError(rowError.message);
        else setRows(rowData);
      } catch (err) {
        setError(err.message);
      }
    };

    testSupabase();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Debug Supabase Connection</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <h3>Columns:</h3>
      <ul>{columns.length ? columns.map((c) => <li key={c}>{c}</li>) : <li>No columns loaded</li>}</ul>


      <h3>First Row Data:</h3>
      <pre>{rows.length ? JSON.stringify(rows[0], null, 2) : "No rows fetched"}</pre>
    </div>
  );
}
