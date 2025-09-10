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
    
    // Test connection first
    const connectionTest = await testSupabaseConnection();
    
    if (!connectionTest) {
      console.log('Supabase connection test failed, falling back to sample data for testing');
      
      // Return sample data for testing when connection fails
      const samplePoses: DatabasePose[] = [
        {
          id: 'sample-1',
          name: 'Mountain Pose',
          sanskrit_name: 'Tadasana',
          category: 'standing',
          difficulty: 'beginner',
          description: 'A foundational standing pose that teaches grounding and alignment.',
          benefits: ['Improves posture', 'Strengthens legs', 'Promotes focus'],
          contraindications: ['None for most practitioners'],
          instructions: ['Stand tall with feet hip-width apart', 'Engage leg muscles', 'Reach crown of head toward ceiling'],
          image_url: '/images/poses/mountain-pose.jpg',
          video_url: null,
          anatomy_focus: ['Legs', 'Core', 'Spine'],
          energy_level: 'low',
          is_published: true,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sample-2',
          name: 'Downward Dog',
          sanskrit_name: 'Adho Mukha Svanasana',
          category: 'inversion',
          difficulty: 'beginner',
          description: 'An energizing inversion that strengthens the whole body.',
          benefits: ['Strengthens arms and legs', 'Stretches hamstrings', 'Energizes the body'],
          contraindications: ['Wrist injuries', 'High blood pressure'],
          instructions: ['Start on hands and knees', 'Tuck toes and lift hips', 'Straighten legs as much as possible'],
          image_url: '/images/poses/downward-dog.jpg',
          video_url: null,
          anatomy_focus: ['Arms', 'Legs', 'Back'],
          energy_level: 'medium',
          is_published: true,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sample-3',
          name: 'Child\'s Pose',
          sanskrit_name: 'Balasana',
          category: 'restorative',
          difficulty: 'beginner',
          description: 'A restful pose that calms the mind and gently stretches the back.',
          benefits: ['Calms the nervous system', 'Stretches back and hips', 'Relieves stress'],
          contraindications: ['Knee injuries'],
          instructions: ['Kneel on the floor', 'Sit back on heels', 'Fold forward with arms extended'],
          image_url: '/images/poses/childs-pose.jpg',
          video_url: null,
          anatomy_focus: ['Back', 'Hips', 'Shoulders'],
          energy_level: 'low',
          is_published: true,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      console.log(`Returning ${samplePoses.length} sample poses for testing`);
      return samplePoses;
    }
    
    const { data, error } = await supabase
      .from('poses')
      .select('*')
      .eq('is_published', true)
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
      console.warn('2. There are poses with is_published = true');
      console.warn('3. The database connection is working properly');
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
      console.log('⚠️ Poses table is empty or no published poses found');
      
      // Check if table exists but no published poses
      const { data: allPoses, error: allPosesError } = await supabase
        .from('poses')
        .select('count', { count: 'exact', head: true });
        
      if (!allPosesError) {
        console.log('Total poses in table (including unpublished):', allPoses);
      }
    } else {
      console.log('✅ Poses table accessible');
      console.log('Sample pose structure:', Object.keys(poses[0]));
    }
    
    // Test published poses specifically
    console.log('3. Testing published poses filter...');
    const { data: publishedPoses, error: publishedError } = await supabase
      .from('poses')
      .select('*')
      .eq('is_published', true)
      .limit(1);
      
    if (publishedError) {
      console.error('❌ Published poses query failed:', publishedError);
    } else {
      console.log(`✅ Found ${publishedPoses?.length || 0} published poses`);
    }
    
  } catch (error) {
    console.error('❌ Debug function failed:', error);
  }
  
  console.log('=== End Debug ===');
};
