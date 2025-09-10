import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_sessions: 0,
    total_practice_time: 0,
    sessions_this_week: 0,
    current_streak: 0,
  });
}
