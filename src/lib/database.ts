import { Pose } from "@/types/yoga"; // Corrected import path
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

  // Fetch all columns to avoid mismatches with the Supabase schema
  let query = client.from('poses').select('*').range(from, to);

  if (searchQuery) {
    // Apply search filter on the 'name' column
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error('Error fetching poses:', error);
    return [];
  }

  // Map raw rows to the Pose type, providing fallbacks for optional fields
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    sanskrit: p.sanskrit ?? p.sanskrit_name ?? '',
    defaultSeconds: p.default_seconds ?? p.defaultSeconds ?? 60,
    icon: p.icon ?? '🧘',
    intensity: p.intensity ?? 1,
    groups: p.groups ?? [],
    family: p.family ?? '',
    description: p.description ?? '',
    benefits: p.benefits ?? [],
    cues: p.cues ?? [],
    plane: p.plane ?? null,
  })) as Pose[];
};

export const getFlows = async () => {
  // TODO: Implement actual data fetching
  return [];
};
