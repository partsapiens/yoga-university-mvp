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
    console.log('Attempting to fetch poses from Supabase...');
    
    // Test connection first
    const connectionTest = await testSupabaseConnection();
    
    if (!connectionTest) {
      console.log('Supabase connection test failed, falling back to sample data for testing');
      
      // Return sample data for testing when connection fails, using correct schema
      const samplePoses: DatabasePose[] = [
        {
          id: 'sample-1',
          slug: 'mountain-pose',
          name: 'Mountain Pose',
          sanskrit: 'Tadasana',
          category: 'standing',
          level: 'beginner',
          plane: 'frontal',
          thumbnail_url: '/images/poses/mountain-pose.jpg',
          icon: '🏔️',
          meta: {},
          cues: ['Stand tall', 'Ground through feet', 'Reach crown up'],
          benefits: ['Improves posture', 'Strengthens legs', 'Promotes focus'],
          created_at: new Date().toISOString(),
          hold_time: 30,
          image_url: '/images/poses/mountain-pose.jpg',
          instructions: 'Stand tall with feet hip-width apart. Engage leg muscles. Reach crown of head toward ceiling.',
          modifications: 'Use wall for support if needed',
          contraindications: 'None for most practitioners',
          anatomical_focus: ['Legs', 'Core', 'Spine'],
          other_side_slug: null,
          intensity: 2,
          sort_order: 1,
          family: 'standing',
          sides: 'both',
          aka: ['Samasthiti'],
          related_next_slugs: ['forward-fold'],
          counterpose_slugs: ['childs-pose'],
          transitions_in: [],
          transitions_out: ['forward-fold']
        },
        {
          id: 'sample-2',
          slug: 'downward-dog',
          name: 'Downward Dog',
          sanskrit: 'Adho Mukha Svanasana',
          category: 'inversion',
          level: 'beginner',
          plane: 'sagittal',
          thumbnail_url: '/images/poses/downward-dog.jpg',
          icon: '🐕',
          meta: {},
          cues: ['Start on hands and knees', 'Tuck toes', 'Lift hips up'],
          benefits: ['Strengthens arms and legs', 'Stretches hamstrings', 'Energizes the body'],
          created_at: new Date().toISOString(),
          hold_time: 60,
          image_url: '/images/poses/downward-dog.jpg',
          instructions: 'Start on hands and knees. Tuck toes and lift hips. Straighten legs as much as possible.',
          modifications: 'Bend knees if hamstrings are tight',
          contraindications: 'Wrist injuries, High blood pressure',
          anatomical_focus: ['Arms', 'Legs', 'Back'],
          other_side_slug: null,
          intensity: 3,
          sort_order: 2,
          family: 'inversion',
          sides: 'both',
          aka: ['Down Dog'],
          related_next_slugs: ['plank'],
          counterpose_slugs: ['childs-pose'],
          transitions_in: ['plank'],
          transitions_out: ['plank', 'low-lunge']
        },
        {
          id: 'sample-3',
          slug: 'childs-pose',
          name: 'Child\'s Pose',
          sanskrit: 'Balasana',
          category: 'restorative',
          level: 'beginner',
          plane: 'sagittal',
          thumbnail_url: '/images/poses/childs-pose.jpg',
          icon: '🧘',
          meta: {},
          cues: ['Kneel on floor', 'Sit back on heels', 'Fold forward'],
          benefits: ['Calms the nervous system', 'Stretches back and hips', 'Relieves stress'],
          created_at: new Date().toISOString(),
          hold_time: 90,
          image_url: '/images/poses/childs-pose.jpg',
          instructions: 'Kneel on the floor. Sit back on heels. Fold forward with arms extended.',
          modifications: 'Place pillow between calves and thighs if knees are tight',
          contraindications: 'Knee injuries',
          anatomical_focus: ['Back', 'Hips', 'Shoulders'],
          other_side_slug: null,
          intensity: 1,
          sort_order: 3,
          family: 'restorative',
          sides: 'both',
          aka: ['Balasana'],
          related_next_slugs: ['table-top'],
          counterpose_slugs: ['camel'],
          transitions_in: ['downward-dog'],
          transitions_out: ['table-top']
        }
      ];
      
      console.log(`Returning ${samplePoses.length} sample poses for testing`);
      return samplePoses;
    }
    
    // Query all poses from the table (no is_published filter since it's not in schema)
    const { data, error } = await supabase
      .from('poses')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('name');
    
    if (error) {
      console.error('Error fetching poses from Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }
    
    console.log(`Successfully fetched ${data?.length || 0} poses from Supabase`);
    if (data && data.length > 0) {
      console.log('Sample pose structure:', JSON.stringify(data[0], null, 2));
    } else {
      console.warn('No poses found in database. Check if:');
      console.warn('1. The poses table exists and has data');
      console.warn('2. The database connection is working properly');
      console.warn('3. The table schema matches expectations');
    }
    
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
