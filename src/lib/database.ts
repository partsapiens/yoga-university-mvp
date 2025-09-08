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

export const getPoses = async (): Promise<Pose[]> => {
  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client.from('poses').select('*');
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
