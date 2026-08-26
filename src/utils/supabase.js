import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars: set VITE_SUPABASE_URL and " +
      "VITE_SUPABASE_PUBLISHABLE_KEY in .env (see .env.example), " +
      "then restart the dev server.",
  );
}

// Reused across HMR reloads so dev never spawns a second client.
export const supabase =
  globalThis.__koncepta_supabase ??
  (globalThis.__koncepta_supabase = createClient(supabaseUrl, supabaseKey));
