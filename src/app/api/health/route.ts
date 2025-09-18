import { NextResponse } from "next/server";
import { checkOpenAIHealth } from "@/lib/openai";

export async function GET() {
  try {
    const health = await checkOpenAIHealth();
    
    return NextResponse.json({
      status: health.ok ? 'healthy' : 'unhealthy',
      openai: health.ok,
      mode: health.mode || 'unknown',
      timestamp: new Date().toISOString(),
      // Never expose the actual API key or error details
      ...(health.error && health.mode !== 'api' ? { message: health.error } : {})
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      openai: false,
      mode: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed'
    }, { status: 503 });
  }
}