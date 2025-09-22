import { NextResponse } from "next/server";
import { oa, isOpenAIAvailable } from "@/lib/openai";
import ErrorReporter from "@/lib/errorReporting";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const startTime = Date.now();
  let requestData: any;
  
  try {
    requestData = await req.json();
    const { userText, preferredDuration } = requestData;
    
    if (!isOpenAIAvailable()) {
      return NextResponse.json({ style: "Box Breathing", duration: 10, rationale: "Mock" });
    }

    const prompt = `
User request: "${userText}"
Pick one style from: Mindfulness, Box Breathing, Body Scan, Loving Kindness.
Pick duration from: 5, 10, 15 (fallback to ${preferredDuration ?? 10} if unclear).
Return STRICT JSON: {"style":"...","duration":number,"rationale":"..."}
`;

    const r = await oa!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are a concise meditation coach." },
                 { role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    
    const data = JSON.parse(r.choices[0].message.content!);
    
    // Log successful API call
    const duration = Date.now() - startTime;
    console.log(`[AI-Select] Success (${duration}ms):`, {
      userText: userText?.substring(0, 50) + (userText?.length > 50 ? '...' : ''),
      response: data
    });
    
    return NextResponse.json(data);
  } catch (error) {
    // Enhanced error logging and reporting
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error instanceof Error && 'code' in error ? error.code : 'UNKNOWN';
    
    // Report to error monitoring system
    const errorReporter = ErrorReporter.getInstance();
    errorReporter.reportError(error instanceof Error ? error : new Error(String(error)), '/api/ai-select', requestData);
    
    console.error('AI Select error details:', {
      message: errorMessage,
      code: errorCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      requestData: requestData ? {
        userText: requestData.userText?.substring(0, 50) + (requestData.userText?.length > 50 ? '...' : ''),
        preferredDuration: requestData.preferredDuration
      } : undefined,
      isOpenAIAvailable: isOpenAIAvailable(),
      nodeEnv: process.env.NODE_ENV
    });
    
    // Return specific error information in development, generic in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json({
      style: "Mindfulness",
      duration: requestData?.preferredDuration ?? 10,
      rationale: "A gentle mindfulness practice to help you find peace.",
      // Include error details in development only
      ...(isDevelopment && {
        _debugInfo: {
          error: errorMessage,
          fallbackMode: true,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        }
      })
    });
  }
}