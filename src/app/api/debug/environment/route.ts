import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  // Only allow in development or for specific authorized users in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isAuthorized = isDevelopment || process.env.DEBUG_MODE === 'true';

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    // Collect non-sensitive environment information for debugging
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      netlify: process.env.NETLIFY === 'true',
      context: process.env.CONTEXT || 'unknown',
      deployId: process.env.DEPLOY_ID || 'local',
      buildId: process.env.BUILD_ID || 'local',
      timestamp: new Date().toISOString(),
      
      // OpenAI configuration (without exposing actual keys)
      openai: {
        hasApiKey: !!process.env.OPENAI_API_KEY,
        apiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
        apiKeyPrefix: process.env.OPENAI_API_KEY ? 
          process.env.OPENAI_API_KEY.substring(0, 8) + '...' : 'none',
        useMock: process.env.USE_MOCK === 'true',
        mockEnvVar: process.env.USE_MOCK || 'undefined'
      },
      
      // Runtime information
      runtime: {
        platform: process.platform,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      },
      
      // Request information
      headers: {
        userAgent: 'server-side',
        host: 'server-side'
      }
    };

    // Log this information server-side for debugging
    console.log('Environment Debug Info requested:', {
      timestamp: envInfo.timestamp,
      hasApiKey: envInfo.openai.hasApiKey,
      context: envInfo.context
    });

    return NextResponse.json(envInfo);
  } catch (error) {
    console.error('Environment debug error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get environment info',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}