import { NextResponse } from "next/server";
import { oa, isOpenAIAvailable } from "@/lib/openai";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { style, duration, feelingNote } = await req.json();

  try {
    if (!isOpenAIAvailable()) {
      return NextResponse.json({ recap: "You practiced calmly.", suggestion: "Try 10 min tomorrow." });
    }

    const r = await oa!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Summarize in ≤40 words and suggest a gentle next step. No medical advice.
STYLE=${style}, DURATION=${duration}, NOTE=${feelingNote ?? "none"}`
      }]
    });
    const text = r.choices[0].message.content ?? "";
    const [recap, suggestion] = text.split("Suggestion:").map(s => s.trim());
    return NextResponse.json({ recap, suggestion: suggestion || "Return tomorrow for a short session." });
  } catch (error) {
    console.error('AI Recap error:', error);
    // Fallback response
    return NextResponse.json({
      recap: "You completed your meditation session. Well done.",
      suggestion: "Continue practicing regularly to deepen your experience."
    });
  }
}