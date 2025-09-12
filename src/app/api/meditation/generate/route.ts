import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

// // Ensure the API key is configured
// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("Missing OPENAI_API_KEY environment variable");
// }

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // System prompt to guide the AI
// const systemPrompt = `
// You are an expert meditation and mindfulness coach. Your goal is to generate a personalized, structured meditation script based on the user's stated mood and desired duration.

// The script must be divided into distinct phases:
// 1.  **Intro**: A welcoming message that acknowledges the user's mood.
// 2.  **Settle**: Gentle instructions to help the user find a comfortable position and begin to relax.
// 3.  **Breathing**: A guided breathing exercise. You can choose a common technique (like box breathing or 4-7-8) or a simple breath awareness exercise. Specify the breathing pattern clearly (e.g., "Inhale for 4, hold for 4, exhale for 4, hold for 4").
// 4.  **Main**: The core part of the meditation, guiding the user's focus. This should relate to their stated mood. For example, if they're stressed, focus on releasing tension. If they want focus, guide their attention to a single point.
// 5.  **Close**: A gentle closing to bring the user back to full awareness, feeling refreshed and calm.

// The total script length should be appropriate for the requested duration. A 5-minute meditation will have shorter phases than a 20-minute one.

// VERY IMPORTANT: Your response MUST be a valid JSON object with the following structure:
// {
//   "phases": {
//     "intro": "string",
//     "settle": "string",
//     "breathing": {
//       "technique": "string",
//       "pattern": "string", // e.g., "4-4-4-4" or "4-7-8"
//       "instructions": "string"
//     },
//     "main": "string",
//     "close": "string"
//   }
// }

// Do not include any text or formatting outside of this JSON object.
// `;

export async function POST(request: Request) {
  try {
    const { mood, duration } = await request.json();

    if (!mood || !duration) {
      return NextResponse.json({ error: 'Missing mood or duration' }, { status: 400 });
    }

    // MOCK RESPONSE
    const mockPhases = {
      intro: `Welcome to your ${duration}-minute meditation. You mentioned you're feeling '${mood}'. We'll work through that together.`,
      settle: "Find a comfortable position, either sitting or lying down. Gently close your eyes and take a deep breath in... and out.",
      breathing: {
        technique: "Box Breathing",
        pattern: "4-4-4-4",
        instructions: "We will now begin a simple breathing exercise. I will guide you. Inhale for a count of 4, hold for 4, exhale for 4, and hold for 4. Let's begin."
      },
      main: "Now, bring your attention to the present moment. Notice the sensation of the breath entering and leaving your body. If your mind wanders, gently guide it back to your breath. We will continue this for a few moments, allowing your body and mind to relax.",
      close: "As this session comes to a close, slowly bring your awareness back to the room. Wiggle your fingers and toes. When you're ready, gently open your eyes. Carry this sense of calm with you."
    };

    const fullScript = [
      mockPhases.intro,
      mockPhases.settle,
      `Now, let's practice ${mockPhases.breathing.technique}. ${mockPhases.breathing.instructions}`,
      mockPhases.main,
      mockPhases.close,
    ].join('\n\n');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ script: fullScript, phases: mockPhases });

    // REAL API CALL (commented out)
    /*
    const userMessage = `Generate a ${duration}-minute meditation script for someone who is feeling: "${mood}".`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106', // Good model for JSON mode
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseJson = completion.choices[0].message.content;

    if (!responseJson) {
      throw new Error("Received an empty response from the AI.");
    }

    const parsedScript = JSON.parse(responseJson);

    const fullScript = [
      parsedScript.phases.intro,
      parsedScript.phases.settle,
      `Now, let's practice ${parsedScript.phases.breathing.technique}. ${parsedScript.phases.breathing.instructions}`,
      parsedScript.phases.main,
      parsedScript.phases.close,
    ].join('\n\n');

    return NextResponse.json({ script: fullScript, phases: parsedScript.phases });
    */

  } catch (error) {
    console.error('Error generating meditation script:', error);

    let errorMessage = 'Failed to generate script';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
