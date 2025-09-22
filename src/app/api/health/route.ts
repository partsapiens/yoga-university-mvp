import { NextResponse } from "next/server";
import { checkOpenAIHealth } from "@/lib/openai";

export async function GET() {
  try {
    const health = await checkOpenAIHealth();
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Enhanced health check with environment information
    const healthInfo = {
      status: health.ok ? 'healthy' : 'unhealthy',
      openai: health.ok,
      timestamp: new Date().toISOString(),
      // Never expose the actual API key or error details in production
      ...(health.error && !health.ok ? { message: 'API unavailable' } : {}),
      // Include debug information in development only
      ...(isDevelopment && {
        debugInfo: {
          hasApiKey: !!process.env.OPENAI_API_KEY,
          useMock: process.env.USE_MOCK === "true",
          nodeEnv: process.env.NODE_ENV,
          netlifyContext: process.env.CONTEXT || 'unknown',
          error: health.error
        }
      })
    };
    
    // Log health check details for debugging (server-side only)
    console.log('Health check result:', {
      ...healthInfo,
      // Additional server-side logging
      timestamp: new Date().toISOString(),
      netlifyDeploy: process.env.DEPLOY_ID || 'local',
      buildId: process.env.BUILD_ID || 'local'
    });
    
    return NextResponse.json(healthInfo);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Health check error details:', {
      message: errorMessage,
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      netlifyContext: process.env.CONTEXT || 'unknown'
    });
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json({
      status: 'unhealthy',
      openai: false,
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      // Include error details in development only
      ...(isDevelopment && {
        debugInfo: {
          error: errorMessage,
          hasApiKey: !!process.env.OPENAI_API_KEY,
          useMock: process.env.USE_MOCK === "true"
        }
      })
    }, { status: 503 });
  }
}