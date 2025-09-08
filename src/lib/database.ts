import { Pose } from "@/types";

// This file will contain database-related functions.
// For example, it could include functions for connecting to a database,
// and for fetching and updating data.

// Example with Supabase
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getPoses = async (): Promise<Pose[]> => {
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
