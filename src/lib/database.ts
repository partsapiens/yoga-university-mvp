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

  // Select all columns to see what we get from the DB
  let query = client.from('poses').select('*').range(from, to);

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching poses:', error);
    return [];
  }

  // Manually map the data to our application's Pose type
  // This handles potential snake_case vs. camelCase mismatches
  // and ensures the returned data conforms to the type.
  const mappedPoses: Pose[] = data.map((p: any) => ({
    id: p.id as PoseId,
    name: p.name,
    sanskrit: p.sanskrit_name || p.sanskrit, // Handle potential DB column names
    defaultSeconds: p.default_seconds || p.defaultSeconds,
    icon: p.icon,
    intensity: p.intensity,
    groups: p.groups || [],
    family: p.family,
    description: p.description,
    benefits: p.benefits,
    cues: p.cues,
    plane: p.plane,
  }));

  return mappedPoses;
};

export const getFlows = async () => {
  // TODO: Implement actual data fetching
  return [];
};
