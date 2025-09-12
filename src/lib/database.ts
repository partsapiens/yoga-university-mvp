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
  // Map level to difficulty
  const difficulty = dbPose.level === 'beginner' ? 'beginner' : 
                    dbPose.level === 'advanced' ? 'advanced' : 'intermediate';
  
  // Map intensity to a scale of 1-10 (default to 5 if not set)
  const intensity = dbPose.intensity || 5;
  
  return {
    id: dbPose.id,
    name: dbPose.name,
    sanskritName: dbPose.sanskrit || '',
    description: dbPose.instructions || '',
    imageUrl: dbPose.image_url || dbPose.thumbnail_url || '',
    videoUrl: undefined, // Not in current schema
    difficulty,
    categories: dbPose.category ? [dbPose.category as any] : ['standing'], // Default category
    intensity,
    isUnilateral: dbPose.sides === 'left' || dbPose.sides === 'right', // Check if unilateral
    benefits: dbPose.benefits || [],
    contraindications: dbPose.contraindications ? [dbPose.contraindications] : [],
  };
}

export const getPosesFromDatabase = async (): Promise<DatabasePose[]> => {
  try {
    console.log('Using fallback pose data for development...');
    
    // Import the existing POSES data and convert it to DatabasePose format
    const { POSES, EXTENDED_POSES } = await import('./yoga-data');
    
    // Convert POSES to DatabasePose format (with id field)
    const posesWithIds = POSES.map((pose, index) => ({
      ...pose,
      id: pose.id || `pose-original-${index + 1}` // Use existing id or generate one
    }));
    
    // Convert EXTENDED_POSES to match POSES format (add id field)
    const extendedPosesWithIds = EXTENDED_POSES.map((pose, index) => ({
      ...pose,
      id: `pose-extended-${index + 1}` // Generate unique id for extended poses
    }));
    
    // Combine both pose collections
    const allPoses = [...posesWithIds, ...extendedPosesWithIds];
    
    // Convert to DatabasePose format 
    const samplePoses: DatabasePose[] = allPoses.map((pose, index) => ({
      id: pose.id || `pose-${index + 1}`,
      slug: pose.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: pose.name,
      sanskrit: pose.sanskrit,
      category: pose.family.toLowerCase(),
      level: pose.intensity <= 2 ? 'beginner' : pose.intensity >= 4 ? 'advanced' : 'intermediate',
      plane: pose.plane.toLowerCase(),
      thumbnail_url: `/images/poses/${pose.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`,
      icon: pose.icon,
      meta: {},
      cues: [`Hold for ${pose.defaultSeconds} seconds`, 'Focus on breathing', 'Maintain alignment'],
      benefits: [`Targets ${pose.groups.join(', ')}`, `${pose.intensity}/5 intensity level`, `${pose.chakra} chakra activation`],
      created_at: new Date().toISOString(),
      hold_time: pose.defaultSeconds,
      image_url: `/images/poses/${pose.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`,
      instructions: `Practice ${pose.name} (${pose.sanskrit}) focusing on ${pose.groups.join(', ')}.`,
      modifications: pose.intensity >= 3 ? 'Use props for support if needed' : 'Can be held longer for deeper stretch',
      contraindications: pose.intensity >= 4 ? 'Avoid if you have injuries in target areas' : 'Generally safe for most practitioners',
      anatomical_focus: pose.groups,
      other_side_slug: null,
      intensity: pose.intensity,
      sort_order: index + 1,
      family: pose.family.toLowerCase(),
      sides: 'both',
      aka: [pose.sanskrit],
      related_next_slugs: [],
      counterpose_slugs: [],
      transitions_in: [],
      transitions_out: []
    }));
    
    console.log(`Returning ${samplePoses.length} poses converted from yoga-data.ts (${POSES.length} original + ${EXTENDED_POSES.length} extended)`);
    return samplePoses;
  } catch (error) {
    console.error('Error in getPosesFromDatabase:', error);
    return [];
  }
};

// Test connection to Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Supabase connection...');
    
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables not configured:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
      });
      return false;
    }
    
    console.log('Environment variables check passed');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
    
    // Test connection by getting count of poses
    const { data, error } = await supabase
      .from('poses')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
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

// Debug function to help diagnose database issues
export const debugDatabaseConnection = async (): Promise<void> => {
  console.log('=== Database Connection Debug ===');
  
  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const connectionWorking = await testSupabaseConnection();
    console.log('Connection working:', connectionWorking);
    
    if (!connectionWorking) {
      console.log('❌ Connection failed - check environment variables and network');
      return;
    }
    
    // Test poses table existence and structure
    console.log('2. Testing poses table...');
    const { data: poses, error: posesError } = await supabase
      .from('poses')
      .select('*')
      .limit(1);
      
    if (posesError) {
      console.error('❌ Poses table query failed:', posesError);
      return;
    }
    
    if (!poses || poses.length === 0) {
      console.log('⚠️ Poses table is empty');
      
      // Check total count
      const { count, error: countError } = await supabase
        .from('poses')
        .select('*', { count: 'exact', head: true });
        
      if (!countError) {
        console.log('Total poses in table:', count);
      }
    } else {
      console.log('✅ Poses table accessible');
      console.log('Sample pose structure:', Object.keys(poses[0]));
      console.log('Sample pose data:', poses[0]);
    }
    
    // Test ordering
    console.log('3. Testing ordering...');
    const { data: orderedPoses, error: orderError } = await supabase
      .from('poses')
      .select('id, name, sort_order')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('name')
      .limit(3);
      
    if (orderError) {
      console.error('❌ Ordering query failed:', orderError);
    } else {
      console.log(`✅ Found ${orderedPoses?.length || 0} poses with ordering`);
      if (orderedPoses && orderedPoses.length > 0) {
        console.log('Sample ordered poses:', orderedPoses);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug function failed:', error);
  }
  
  console.log('=== End Debug ===');
};
