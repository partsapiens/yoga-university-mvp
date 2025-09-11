import { NextResponse } from "next/server";
import { oa } from "@/lib/openai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { style, duration, mood } = await req.json();

  try {
    if (process.env.USE_MOCK === "true") {
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

    const r = await oa.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      response_format: { type: "json_object" }
    });
    return NextResponse.json(JSON.parse(r.choices[0].message.content!));
  } catch (error) {
    console.error('AI Script error:', error);
    // Fallback response
    return NextResponse.json({
      intro: `Welcome to this ${style || 'mindfulness'} practice. Find a comfortable position and allow yourself to settle.`,
      loopCue: "Breathe naturally and stay present with each breath.",
      outro: "Gently return your awareness to your surroundings. Take your time."
    });
  }
}