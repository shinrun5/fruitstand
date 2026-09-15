import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
    );
  }

  client = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseAdmin(), prop, receiver);
  },
});
