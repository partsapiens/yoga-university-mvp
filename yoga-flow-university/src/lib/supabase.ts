import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Anon Key is not defined. Please check your .env.local file or Netlify environment variables.");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  { auth: { persistSession: false } }
);
