import { Pose } from "@/types";

// This file will contain database-related functions.
// For example, it could include functions for connecting to a database,
// and for fetching and updating data.

// Example with Supabase
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const mockPoses: Pose[] = [
    { id: '1', name: 'Downward-Facing Dog', sanskritName: 'Adho Mukha Svanasana', description: 'An inverted V-shape from your hands and feet on the floor.', imageUrl: 'https://via.placeholder.com/300', difficulty: 'beginner', categories: ['standing', 'forward-bend'], intensity: 3, isUnilateral: false, benefits: ['Stretches the hamstrings, calves, and spine', 'Builds strength in the arms and legs'], contraindications: ['Carpal tunnel syndrome', 'High blood pressure'] },
    { id: '2', name: 'Warrior II', sanskritName: 'Virabhadrasana II', description: 'A standing pose that strengthens the legs and opens the hips and chest.', imageUrl: 'https://via.placeholder.com/300', difficulty: 'intermediate', categories: ['standing', 'hip-opener'], intensity: 5, isUnilateral: true, benefits: ['Strengthens the legs and ankles', 'Stretches the groins, chest, and shoulders'], contraindications: ['High blood pressure', 'Neck problems'] },
    { id: '3', name: 'Tree Pose', sanskritName: 'Vrksasana', description: 'A balancing pose that improves focus and concentration.', imageUrl: 'https://via.placeholder.com/300', difficulty: 'beginner', categories: ['standing'], intensity: 4, isUnilateral: true, benefits: ['Improves balance and stability in the legs', 'Strengthens the thighs, calves, ankles, and spine'], contraindications: ['High blood pressure', 'Headache'] },
    { id: '4', name: 'Triangle Pose', sanskritName: 'Trikonasana', description: 'A standing pose that stretches the hamstrings, groins, and hips.', imageUrl: 'https://via.placeholder.com/300', difficulty: 'beginner', categories: ['standing', 'hip-opener'], intensity: 4, isUnilateral: true, benefits: ['Stretches and strengthens the thighs, knees, and ankles', 'Stretches the hips, groins, hamstrings, and calves'], contraindications: ['Low blood pressure', 'Neck problems'] },
];

export const getPoses = async (): Promise<Pose[]> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPoses;
};

export const getFlows = async () => {
  // TODO: Implement actual data fetching
  return [];
};
