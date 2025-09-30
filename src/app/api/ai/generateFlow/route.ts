import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateFlow } from '@/lib/ai';

export async function POST(request: Request) {
  const supabase = createClient();

  // 1. Check if the user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse and validate the request body
  let params: AIGenerationParams;
  try {
    params = await request.json();
    // Basic validation
    if (!params.duration || !params.difficulty || !params.practiceStyle || !params.focusArea) {
      throw new Error('Missing required parameters.');
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    // 3. Call the AI generation logic
    const flow = await generateFlow(params);

    // 4. Return the successful response
    return NextResponse.json(flow);

  } catch (error) {
    console.error('[API /generateFlow] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred while generating the flow.' 
    }, { status: 500 });
  }
}