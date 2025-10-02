import { NextResponse } from "next/server";
import { oa, isOpenAIAvailable } from "@/lib/openai";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { style, duration, mood } = await req.json();

  try {
    if (!isOpenAIAvailable()) {
      return NextResponse.json({
        intro: "Welcome. Settle in…",
        loopCue: "Inhale… Exhale…",
        outro: "Gently open your eyes when you're ready."
      });
    }

    const sys = "You are a friendly meditation instructor. No medical claims.";
    const user = `
Generate a meditation for STYLE=${style}, DURATION=${duration} minutes, MOOD=${mood ?? "neutral"}.
Constraints:
- Keep timing deterministic (intro ≤60s, loop cue 5–10s, outro ≤45s).
- Neutral, inclusive, calming language.
Return STRICT JSON:
{"intro":"...", "loopCue":"...", "outro":"..."}
`;

    const r = await oa!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      response_format: { type: "json_object" }
    });
    return NextResponse.json(JSON.parse(r.choices[0].message.content!));
  } catch (error) {
    // Enhanced error logging for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error instanceof Error && 'code' in error ? error.code : 'UNKNOWN';
    
    console.error('AI Script error details:', {
      message: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString(),
      requestData: { style, duration, mood },
      isOpenAIAvailable: isOpenAIAvailable(),
      nodeEnv: process.env.NODE_ENV
    });
    
    // Return specific error information in development, generic in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json({
      intro: `Welcome to this ${style || 'mindfulness'} practice. Find a comfortable position and allow yourself to settle.`,
      loopCue: "Breathe naturally and stay present with each breath.",
      outro: "Gently return your awareness to your surroundings. Take your time.",
      // Include error details in development only
      ...(isDevelopment && {
        _debugInfo: {
          error: errorMessage,
          fallbackMode: true,
          timestamp: new Date().toISOString()
        }
      })
    });
  }
}