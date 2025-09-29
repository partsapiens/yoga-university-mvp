import { AIGenerationParams, Flow, Pose } from "@/types";
import { getPosesFromDatabase } from "@/lib/database";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a yoga flow using AI based on user-defined parameters.
 * @param params The parameters for the AI generation (e.g., duration, difficulty).
 * @returns A promise that resolves to the generated yoga flow.
 */
export const generateFlow = async (params: AIGenerationParams): Promise<Partial<Flow>> => {
  console.log("Generating flow with params:", params);

  try {
    // 1. Fetch all available poses from the database to give the AI context
    const allPoses = await getPosesFromDatabase();
    if (!allPoses || allPoses.length === 0) {
      throw new Error("No poses found in the database. Cannot generate a flow.");
    }
    const poseNames = allPoses.map(p => p.slug).join(", ");

    // 2. Construct a detailed prompt for the AI
    const prompt = `
      You are an expert yoga instructor. Your task is to create a well-structured and safe yoga flow based on the user's requirements.
      The output must be a valid JSON object. Do not include any text or markdown formatting before or after the JSON.

      User Requirements:
      - Duration: ${params.duration} minutes
      - Difficulty: ${params.difficulty}
      - Style: ${params.practiceStyle}
      - Focus Area: ${params.focusArea}
      - Include Warm-up: ${params.includeWarmup}
      - Include Cool-down: ${params.includeCooldown}

      Available Poses (use only these slugs):
      ${poseNames}

      JSON Output Structure:
      {
        "name": "A creative and descriptive name for the flow",
        "description": "A brief, encouraging description of the flow's purpose and benefits.",
        "difficulty": "${params.difficulty}",
        "style": "${params.practiceStyle}",
        "poses": [
          { "slug": "pose-slug-from-list", "duration": 60 },
          { "slug": "another-pose-slug", "duration": 90 }
        ]
      }

      Instructions:
      - The total duration of all poses should roughly match the user's requested duration.
      - Select a sequence of poses that logically and safely flow together.
      - Start with a warm-up and end with a cool-down if requested.
      - The number and duration of poses should be appropriate for the requested difficulty and style.
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
    const generatedFlow = JSON.parse(content);

    // 5. Validate the generated flow to ensure it matches our schema
    if (!generatedFlow.name || !generatedFlow.poses || !Array.isArray(generatedFlow.poses)) {
        throw new Error("AI returned an invalid flow structure.");
    }

    console.log("Successfully generated flow:", generatedFlow.name);
    return generatedFlow;

  } catch (error) {
    console.error("Error generating AI flow:", error);
    // Return a structured error or a fallback flow
    return {
      name: "Error Generating Flow",
      description: "We couldn't generate a flow at this time. Please try again later.",
      difficulty: params.difficulty,
      style: params.practiceStyle,
      poses: [],
    };
  }
};