import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function useSupabaseTable(tableName, options = {}) {
  const { filter = null, limit = null } = options;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase.from(tableName).select("*");
        if (filter) {
          Object.entries(filter).forEach(([col, val]) => {
            query = query.eq(col, val);
          });
        }
        if (limit) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        setData(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, JSON.stringify(filter), limit]);

  return { data, error, loading };
}
