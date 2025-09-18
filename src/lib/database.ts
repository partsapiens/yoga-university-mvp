import { DatabasePose, Pose } from "@/types";
import { supabase } from "@/utils/supabaseClient";

// This file will contain database-related functions.
// For example, it could include functions for connecting to a database,
// and for fetching and updating data.

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(supabaseUrl && supabaseAnonKey);
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
  // Static sample data to avoid import issues - moved to top for proper scoping
  const samplePoses: DatabasePose[] = [
      {
        id: 'butterfly-pose',
        slug: 'butterfly-pose',
        name: 'Butterfly Pose',
        sanskrit: 'Baddha Konasana',
        category: 'seated',
        level: 'beginner',
        plane: 'sagittal',
        thumbnail_url: '/images/poses/placeholder.svg',
        icon: '🦋',
        meta: {},
        cues: ['Hold for 60 seconds', 'Focus on breathing', 'Maintain alignment'],
        benefits: ['Targets Hips, Groin', '2/5 intensity level', 'Sacral chakra activation'],
        created_at: new Date().toISOString(),
        hold_time: 60,
        image_url: '/images/poses/placeholder.svg',
        instructions: 'Practice Butterfly Pose (Baddha Konasana) focusing on Hips, Groin.',
        modifications: 'Can be held longer for deeper stretch',
        contraindications: 'Generally safe for most practitioners',
        anatomical_focus: ['Hips', 'Groin'],
        other_side_slug: null,
        intensity: 2,
        sort_order: 1,
        family: 'seated',
        sides: 'both',
        aka: ['Baddha Konasana'],
        related_next_slugs: [],
        counterpose_slugs: [],
        transitions_in: [],
        transitions_out: []
      },
      {
        id: 'standing-forward-fold',
        slug: 'standing-forward-fold',
        name: 'Standing Forward Fold',
        sanskrit: 'Uttanāsana',
        category: 'standing',
        level: 'beginner',
        plane: 'sagittal',
        thumbnail_url: '/images/poses/placeholder.svg',
        icon: '🧎',
        meta: {},
        cues: ['Hold for 60 seconds', 'Focus on breathing', 'Maintain alignment'],
        benefits: ['Targets Hamstrings, Spine', '2/5 intensity level', 'Root chakra activation'],
        created_at: new Date().toISOString(),
        hold_time: 60,
        image_url: '/images/poses/placeholder.svg',
        instructions: 'Practice Standing Forward Fold (Uttanāsana) focusing on Hamstrings, Spine.',
        modifications: 'Can be held longer for deeper stretch',
        contraindications: 'Generally safe for most practitioners',
        anatomical_focus: ['Hamstrings', 'Spine'],
        other_side_slug: null,
        intensity: 2,
        sort_order: 2,
        family: 'standing',
        sides: 'both',
        aka: ['Uttanāsana'],
        related_next_slugs: [],
        counterpose_slugs: [],
        transitions_in: [],
        transitions_out: []
      },
      {
        id: 'downward-facing-dog',
        slug: 'downward-facing-dog',
        name: 'Downward Facing Dog',
        sanskrit: 'Adho Mukha Svanasana',
        category: 'inversion',
        level: 'intermediate',
        plane: 'sagittal',
        thumbnail_url: '/images/poses/placeholder.svg',
        icon: '🐶',
        meta: {},
        cues: ['Hold for 45 seconds', 'Focus on breathing', 'Maintain alignment'],
        benefits: ['Targets Shoulders, Hamstrings, Spine', '3/5 intensity level', 'Heart chakra activation'],
        created_at: new Date().toISOString(),
        hold_time: 45,
        image_url: '/images/poses/placeholder.svg',
        instructions: 'Practice Downward Facing Dog (Adho Mukha Svanasana) focusing on Shoulders, Hamstrings, Spine.',
        modifications: 'Use props for support if needed',
        contraindications: 'Generally safe for most practitioners',
        anatomical_focus: ['Shoulders', 'Hamstrings', 'Spine'],
        other_side_slug: null,
        intensity: 3,
        sort_order: 3,
        family: 'inversion',
        sides: 'both',
        aka: ['Adho Mukha Svanasana'],
        related_next_slugs: [],
        counterpose_slugs: [],
        transitions_in: [],
        transitions_out: []
      },
      {
        id: 'warrior-1-right',
        slug: 'warrior-1-right',
        name: 'Warrior I (Right)',
        sanskrit: 'Virabhadrāsana I',
        category: 'standing',
        level: 'intermediate',
        plane: 'sagittal',
        thumbnail_url: '/images/poses/placeholder.svg',
        icon: '🛡️',
        meta: {},
        cues: ['Hold for 45 seconds', 'Focus on breathing', 'Maintain alignment'],
        benefits: ['Targets Hips, Quads, Core', '3/5 intensity level', 'Solar Plexus chakra activation'],
        created_at: new Date().toISOString(),
        hold_time: 45,
        image_url: '/images/poses/placeholder.svg',
        instructions: 'Practice Warrior I (Right) (Virabhadrāsana I) focusing on Hips, Quads, Core.',
        modifications: 'Use props for support if needed',
        contraindications: 'Generally safe for most practitioners',
        anatomical_focus: ['Hips', 'Quads', 'Core'],
        other_side_slug: null,
        intensity: 3,
        sort_order: 4,
        family: 'standing',
        sides: 'both',
        aka: ['Virabhadrāsana I'],
        related_next_slugs: [],
        counterpose_slugs: [],
        transitions_in: [],
        transitions_out: []
      }
    ];
  
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - using sample data');
      return samplePoses; // Return sample data when no database connection
    }

    // Try to fetch from the actual database first
    try {
      const { data: poses, error } = await supabase
        .from('poses')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.warn('Supabase query error:', error.message, '- using sample data');
        return samplePoses;
      }
      
      if (poses && poses.length > 0) {
        console.log(`Loaded ${poses.length} poses from Supabase`);
        return poses as DatabasePose[];
      }
    } catch (dbError) {
      console.warn('Database connection failed:', dbError, '- using sample data');
    }
    
    // Return sample data as fallback
    console.warn('No poses in database - using sample data');
    return samplePoses;
  } catch (error) {
    console.error('Error in getPosesFromDatabase:', error);
    return samplePoses; // Return sample data instead of empty array
  }
};

// Test connection to Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Check if environment variables are set
    if (!isSupabaseConfigured()) {
      return false;
    }
    
    // Only test connection in development mode to avoid production errors
    if (process.env.NODE_ENV === 'production') {
      return false;
    }
    
    // Test connection by getting count of poses with shorter timeout
    const { data, error } = await supabase
      .from('poses')
      .select('count', { count: 'exact', head: true });
    
    return !error;
  } catch (error) {
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
