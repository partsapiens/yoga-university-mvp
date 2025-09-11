import { NextResponse } from "next/server";
import { checkOpenAIHealth } from "@/lib/openai";

export async function GET() {
  try {
    const health = await checkOpenAIHealth();
    
    return NextResponse.json({
      status: health.ok ? 'healthy' : 'unhealthy',
      openai: health.ok,
      timestamp: new Date().toISOString(),
      // Never expose the actual API key or error details
      ...(health.error && !health.ok ? { message: 'API unavailable' } : {})
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      openai: false,
      timestamp: new Date().toISOString(),
      message: 'Health check failed'
    }, { status: 503 });
  }
}