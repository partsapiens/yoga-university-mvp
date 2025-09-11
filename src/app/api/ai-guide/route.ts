import { NextResponse } from "next/server";
import { oa, isOpenAIAvailable } from "@/lib/openai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages } = await req.json(); // [{role:'user'|'assistant'|'system', content:string}]
  
  try {
    if (!isOpenAIAvailable()) {
      return NextResponse.json({ reply: "Mock: try box breathing for 5 minutes." });
    }
    
    const r = await oa!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "Helpful yoga/mindfulness assistant. No medical advice." }, ...messages]
    });
    return NextResponse.json({ reply: r.choices[0].message.content });
  } catch (error) {
    console.error('AI Guide error:', error);
    // Fallback response
    return NextResponse.json({ 
      reply: "I'm here to help with your yoga and mindfulness practice. Try asking about breathing techniques, meditation styles, or yoga poses." 
    });
  }
}