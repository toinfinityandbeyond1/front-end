import { supabase } from "../supabaseClient";

export async function fetchColumns(tableName) {
  try {
    const { data, error } = await supabase.rpc("get_table_columns", { tablename: tableName });
    if (error) throw error;
    return data.filter(c => !["id", "date"].includes(c.column_name));
  } catch (err) {
    console.error(`Error fetching columns for ${tableName}:`, err);
    return [];
  }
}
