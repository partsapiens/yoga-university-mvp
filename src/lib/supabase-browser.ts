import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function supabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Supabase URL or key is missing. Supabase client not created for build process.");
    return null;
  }

  return createClient(url, key, { auth: { persistSession: false } });
}
