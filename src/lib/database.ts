import { createClient } from '@supabase/supabase-js'
import { Pose } from '@/types'

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Transforms a pose object from the database to match the TypeScript type.
 * @param dbPose - The pose object from the database.
 * @returns The transformed pose object.
 */
function transformPose(dbPose: any): Pose {
  return {
    id: dbPose.id,
    name: dbPose.name,
    sanskritName: dbPose.sanskrit_name,
    description: dbPose.description,
    imageUrl: dbPose.image_url,
    videoUrl: dbPose.video_url,
    difficulty: dbPose.difficulty,
    category: dbPose.category,
    benefits: dbPose.benefits || [],
    contraindications: dbPose.contraindications || [],
  }
}

/**
 * Fetches all poses from the database.
 * @returns A promise that resolves to an array of poses.
 */
export async function getPoses(): Promise<Pose[]> {
  const { data, error } = await supabase.from('poses').select('*')

  if (error) {
    console.error('Error fetching poses:', error)
    return []
  }

  return data.map(transformPose)
}

/**
 * Searches for poses by name or Sanskrit name.
 * @param query - The search query.
 * @returns A promise that resolves to an array of matching poses.
 */
export async function searchPoses(query: string): Promise<Pose[]> {
  const { data, error } = await supabase
    .from('poses')
    .select('*')
    .or(`name.ilike.%${query}%,sanskrit_name.ilike.%${query}%`)

  if (error) {
    console.error('Error searching poses:', error)
    return []
  }

  return data.map(transformPose)
}
