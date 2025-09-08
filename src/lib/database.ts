import { Pose } from "@/types";

// This file will contain database-related functions.
// For example, it could include functions for connecting to a database,
// and for fetching and updating data.

// Example with Supabase
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Allow building without Supabase credentials by exporting `null` when missing.
// Production deployments should supply both env vars so `supabase` is a client.
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const getPoses = async (): Promise<Pose[]> => {
  if (!supabase) {
    console.warn('Supabase client not configured');
    return [];
  }
  const { data, error } = await supabase.from('poses').select('*');
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
