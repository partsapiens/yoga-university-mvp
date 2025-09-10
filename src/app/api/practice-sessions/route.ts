import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date();
  const sessions = Array.from({ length: 10 }, (_, i) => ({
    id: `${i}`,
    flowName: `Flow ${i + 1}`,
    duration: 30,
    completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - i).toISOString(),
  }));
  return NextResponse.json(sessions);
}
