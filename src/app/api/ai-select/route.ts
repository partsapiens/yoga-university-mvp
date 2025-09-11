import { NextResponse } from "next/server";
import { oa } from "@/lib/openai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { userText, preferredDuration } = await req.json();
  
  try {
    if (process.env.USE_MOCK === "true") {
      return NextResponse.json({ style: "Box Breathing", duration: 10, rationale: "Mock" });
    }

    const prompt = `
User request: "${userText}"
Pick one style from: Mindfulness, Box Breathing, Body Scan, Loving Kindness.
Pick duration from: 5, 10, 15 (fallback to ${preferredDuration ?? 10} if unclear).
Return STRICT JSON: {"style":"...","duration":number,"rationale":"..."}
`;

    const r = await oa.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are a concise meditation coach." },
                 { role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const data = JSON.parse(r.choices[0].message.content!);
    return NextResponse.json(data);
  } catch (error) {
    console.error('AI Select error:', error);
    // Fallback response
    return NextResponse.json({
      style: "Mindfulness",
      duration: preferredDuration ?? 10,
      rationale: "A gentle mindfulness practice to help you find peace."
    });
  }
}