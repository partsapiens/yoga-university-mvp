import { Pose } from "@/types";
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

const POSES_PER_PAGE = 20;

export const getPoses = async ({ page = 0, searchQuery = '' }: { page?: number, searchQuery?: string }): Promise<Pose[]> => {
  const client = getSupabase();
  if (!client) return [];

  const from = page * POSES_PER_PAGE;
  const to = from + POSES_PER_PAGE - 1;

  let query = client.from('poses').select('*').range(from, to);

  if (searchQuery) {
    // Use ilike for case-insensitive search on the 'name' column
    query = query.ilike('name', `%${searchQuery}%`);
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
