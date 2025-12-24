import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || ""; // Gunakan SERVICE_ROLE_KEY atau ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };