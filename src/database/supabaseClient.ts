import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Asegúrate de configurar estas variables de entorno en .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
