
import { getPosesFromDatabase } from "@/lib/database";
import { AIGenerationParams } from "@/types/ai";
import { Flow, FlowPose } from "@/types";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Filters poses based on user parameters to create a curated list for AI context.
 * This prevents context window overflow by providing only relevant poses.
 */
const getCuratedPoses = async (params: AIGenerationParams) => {
  const allPoses = await getPosesFromDatabase();
  if (!allPoses || allPoses.length === 0) {
    throw new Error("No poses found in the database. Cannot generate a flow.");
  }

  // Filter poses based on difficulty level
  let filteredPoses = allPoses.filter(pose => {
    // If pose doesn't have a level, include it for beginners and intermediate
    if (!pose.level) return params.difficulty !== 'advanced';
    
    switch (params.difficulty) {
      case 'beginner':
        return pose.level === 'beginner';
      case 'intermediate':
        return pose.level === 'beginner' || pose.level === 'intermediate';
      case 'advanced':
        return true; // Advanced practitioners can do all poses
      default:
        return true;
    }
  });

  // Filter by focus area if it matches anatomical focus or category
  if (params.focusArea) {
    const focusAreaFiltered = filteredPoses.filter(pose => {
      const anatomicalFocus = pose.anatomical_focus || [];
      const category = pose.category || pose.family || '';
      
      return anatomicalFocus.some(focus => 
        focus.toLowerCase().includes(params.focusArea.toLowerCase())
      ) || category.toLowerCase().includes(params.focusArea.toLowerCase());
    });
    
    // If we have focus-specific poses, use them, otherwise keep all filtered poses
    if (focusAreaFiltered.length > 0) {
      filteredPoses = focusAreaFiltered;
    }
  }

  // Limit to a maximum of 50 poses to keep context manageable
  // Sort by sort_order if available, otherwise by name
  filteredPoses.sort((a, b) => {
    if (a.sort_order && b.sort_order) {
      return a.sort_order - b.sort_order;
    }
    return a.name.localeCompare(b.name);
  });

  return filteredPoses.slice(0, 50);
};

/**
 * Generates a yoga flow using AI based on user-defined parameters.
 * @param params The parameters for the AI generation (e.g., duration, difficulty).
 * @returns A promise that resolves to the generated yoga flow.
 */
export const generateFlow = async (params: AIGenerationParams): Promise<Partial<Flow>> => {
  console.log("Generating flow with params:", params);

  try {
    // 1. Get curated poses based on user parameters to avoid context window issues
    const curatedPoses = await getCuratedPoses(params);
    console.log(`Using ${curatedPoses.length} curated poses for AI context`);
    
    // Create a concise pose list for the AI
    const poseContext = curatedPoses.map(p => `${p.slug}: ${p.name} (${p.level || 'beginner'})`).join(", ");

    // 2. Construct a detailed prompt for the AI
    const prompt = `
      You are an expert yoga instructor. Create a well-structured and safe yoga flow based on the user's requirements.
      The output must be a valid JSON object. Do not include any text or markdown formatting before or after the JSON.

      User Requirements:
      - Duration: ${params.duration} minutes
      - Difficulty: ${params.difficulty}
      - Style: ${params.practiceStyle}
      - Focus Area: ${params.focusArea}
      - Include Warm-up: ${params.includeWarmup}
      - Include Cool-down: ${params.includeCooldown}

      Available poses for this flow: ${poseContext}

      JSON Output Structure:
      {
        "name": "A creative and descriptive name for the flow",
        "description": "A brief, encouraging description of the flow's purpose and benefits.",
        "difficulty": "${params.difficulty}",
        "style": "${params.practiceStyle}",
        "poses": [
          {"poseId": "pose-slug", "duration": 30}
        ]
      }

      Instructions:
      - Use ONLY poses from the available list above
      - The total duration of all poses should roughly match the user's requested duration
      - Select a sequence of poses that logically and safely flow together
      - Start with a warm-up and end with a cool-down if requested
      - Each pose should have a "poseId" (use the slug from available poses) and "duration" in seconds
      - The number and duration of poses should be appropriate for the requested difficulty and style
    `;

    // 3. Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI returned an empty response.");
    }

    // 4. Parse the JSON response
    const parsedFlow = JSON.parse(content);

    // 5. Validate and transform the generated flow to match our schema
    if (!parsedFlow.name || !parsedFlow.poses || !Array.isArray(parsedFlow.poses)) {
        throw new Error("AI returned an invalid flow structure.");
    }

    const validPoseSlugs = new Set(curatedPoses.map(p => p.slug));
    const transformedPoses: FlowPose[] = parsedFlow.poses.map((pose: any, index: number) => {
        if (!pose.poseId || typeof pose.duration !== 'number' || !validPoseSlugs.has(pose.poseId)) {
            console.warn(`AI returned an invalid or unknown pose object at index ${index}:`, pose);
            return null;
        }
        return {
            poseId: pose.poseId,
            duration: pose.duration,
            order: index,
        };
    }).filter((p: FlowPose | null): p is FlowPose => p !== null); // Filter out any nulls from invalid poses

    const finalFlow: Partial<Flow> = {
        name: parsedFlow.name,
        description: parsedFlow.description,
        difficulty: parsedFlow.difficulty,
        style: parsedFlow.style,
        poses: transformedPoses,
    };

    console.log("Successfully generated and transformed flow:", finalFlow.name);
    return finalFlow;

  } catch (error) {
    console.error("Error generating AI flow:", error);
    // Throw an error to be caught by the API route handler
    throw new Error("We couldn't generate a flow at this time. Please try again later.");
  }
};