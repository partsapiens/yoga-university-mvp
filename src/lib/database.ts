import { Pose } from "@/types";

// This file will contain database-related functions.
// For example, it could include functions for connecting to a database,
// and for fetching and updating data.

// Example with Supabase
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabase) return supabase;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase client not configured');
    return null;
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
};

export const getPoses = async (page: number, pageSize: number, search: string = ''): Promise<Pose[]> => {
  const client = getSupabase();
  if (!client) return [];

  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = client
    .from('poses')
    .select('*')
    .range(from, to);

  if (search) {
    query = query.or(`name.ilike.%${search}%,sanskritName.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching poses:', error);
    return [];
  }
  return data as Pose[];
};

export const getFlows = async () => {
  // TODO: Implement actual data fetching
  return [];
};
