import { Pose, PoseId } from "@/types/yoga"; // Corrected import path
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

  // Select only the columns required by the Pose type, aliasing snake_case to camelCase
  const selectColumns = `
    id,
    name,
    sanskrit:sanskrit_name,
    defaultSeconds:default_seconds,
    icon,
    intensity,
    groups,
    family,
    description,
    benefits,
    cues,
    plane
  `;

  let query = client.from('poses').select(selectColumns).range(from, to);

  if (searchQuery) {
    // Apply search filter on the 'name' column
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching poses:', error);
    return [];
  }

  // The data returned by Supabase should now match the Pose[] type directly
  // thanks to the column aliasing in the select statement.
  return data as Pose[];
};

export const getFlows = async () => {
  // TODO: Implement actual data fetching
  return [];
};
