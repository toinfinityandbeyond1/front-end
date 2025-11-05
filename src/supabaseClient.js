import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://YOUR_SUPABASE_PROJECT_ID.supabase.co";
const supabaseKey = "YOUR_ANON_KEY"; // safe for client read operations
export const supabase = createClient(supabaseUrl, supabaseKey);