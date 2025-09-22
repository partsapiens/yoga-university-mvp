import { NextResponse } from "next/server";
import ErrorReporter from "@/lib/errorReporting";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Only allow in development or for authorized users in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isAuthorized = isDevelopment || process.env.DEBUG_MODE === 'true';

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'recent';
    const limit = parseInt(searchParams.get('limit') || '10');

    const errorReporter = ErrorReporter.getInstance();

    switch (action) {
      case 'recent':
        const recentErrors = errorReporter.getRecentErrors(limit);
        return NextResponse.json({
          action: 'recent',
          count: recentErrors.length,
          errors: recentErrors,
          timestamp: new Date().toISOString()
        });

      case 'stats':
        const stats = errorReporter.getErrorStats();
        return NextResponse.json({
          action: 'stats',
          stats,
          timestamp: new Date().toISOString()
        });

      case 'clear':
        errorReporter.clearErrors();
        return NextResponse.json({
          action: 'clear',
          message: 'Error history cleared',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          error: 'Invalid action',
          validActions: ['recent', 'stats', 'clear'],
          usage: {
            recent: '/api/debug/errors?action=recent&limit=10',
            stats: '/api/debug/errors?action=stats',
            clear: '/api/debug/errors?action=clear'
          }
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error monitoring endpoint failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get error information',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Allow POST for reporting errors from client-side (if needed)
export async function POST(request: Request) {
  // Only allow in development or for authorized users in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isAuthorized = isDevelopment || process.env.DEBUG_MODE === 'true';

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { error, endpoint, requestData, userAgent, sessionId } = body;

    if (!error || !endpoint) {
      return NextResponse.json(
        { error: 'Missing required fields: error, endpoint' },
        { status: 400 }
      );
    }

    const errorReporter = ErrorReporter.getInstance();
    errorReporter.reportError(error, endpoint, requestData, userAgent, sessionId);

    return NextResponse.json({
      message: 'Error reported successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to report error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to report error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}