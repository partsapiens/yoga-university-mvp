import { DatabasePose, Pose } from "@/types";
import { supabase } from "@/utils/supabaseClient";

// This file will contain database-related functions.
// For example, it could include functions for connecting to a database,
// and for fetching and updating data.

// Example with Supabase
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseClient) return supabaseClient;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase client not configured');
    return null;
  }
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
};

// Transform database pose to legacy pose format for backward compatibility
function transformDatabasePoseToLegacy(dbPose: DatabasePose): Pose {
  return {
    id: dbPose.id,
    name: dbPose.name,
    sanskritName: dbPose.sanskrit_name || '',
    description: dbPose.description,
    imageUrl: dbPose.image_url || '',
    videoUrl: dbPose.video_url || undefined,
    difficulty: dbPose.difficulty,
    categories: [dbPose.category as any], // Map category to categories array
    intensity: dbPose.energy_level === 'low' ? 3 : dbPose.energy_level === 'medium' ? 5 : 7,
    isUnilateral: false, // Default value
    benefits: dbPose.benefits,
    contraindications: dbPose.contraindications,
  };
}

export const getPosesFromDatabase = async (): Promise<DatabasePose[]> => {
  try {
    console.log('Attempting to fetch poses from Supabase...');
    const { data, error } = await supabase
      .from('poses')
      .select('*')
      .eq('is_published', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching poses from Supabase:', error);
      return [];
    }
    
    console.log(`Successfully fetched ${data?.length || 0} poses from Supabase`);
    return data as DatabasePose[];
  } catch (error) {
    console.error('Error in getPosesFromDatabase:', error);
    return [];
  }
};

// Test connection to Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('poses')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

export const getPoses = async (): Promise<Pose[]> => {
  const dbPoses = await getPosesFromDatabase();
  return dbPoses.map(transformDatabasePoseToLegacy);
};

export const getFlows = async () => {
  // TODO: Implement actual data fetching
  return [];
};
