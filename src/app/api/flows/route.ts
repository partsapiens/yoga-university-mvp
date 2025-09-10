import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

// GET /api/flows - List flows for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch flows with their sequences
    const { data: flows, error: flowsError } = await supabase
      .from('flows')
      .select(`
        *,
        flow_sequences (
          id,
          pose_id,
          order_index,
          duration,
          instructions,
          transition_notes,
          poses (
            id,
            name,
            sanskrit_name,
            category,
            difficulty,
            image_url,
            description
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (flowsError) {
      console.error('Error fetching flows:', flowsError);
      return NextResponse.json({ error: 'Failed to fetch flows' }, { status: 500 });
    }

    return NextResponse.json({ flows });
  } catch (error) {
    console.error('Flows API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/flows - Create a new flow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      user_id, 
      name, 
      description, 
      duration, 
      difficulty, 
      style, 
      focus_areas, 
      is_public = false,
      is_ai_generated = false,
      tags = [],
      poses = [] // Array of { pose_id, order_index, duration, instructions }
    } = body;

    if (!user_id || !name || !duration || !difficulty || !style) {
      return NextResponse.json({ 
        error: 'Missing required fields: user_id, name, duration, difficulty, style' 
      }, { status: 400 });
    }

    // Create the flow
    const { data: flow, error: flowError } = await supabase
      .from('flows')
      .insert({
        user_id,
        name,
        description,
        duration,
        difficulty,
        style,
        focus_areas,
        is_public,
        is_ai_generated,
        tags
      })
      .select()
      .single();

    if (flowError) {
      console.error('Error creating flow:', flowError);
      return NextResponse.json({ error: 'Failed to create flow' }, { status: 500 });
    }

    // Create flow sequences if poses are provided
    if (poses.length > 0) {
      const sequences = poses.map((pose: any, index: number) => ({
        flow_id: flow.id,
        pose_id: pose.pose_id,
        order_index: pose.order_index ?? index,
        duration: pose.duration ?? 30,
        instructions: pose.instructions,
        transition_notes: pose.transition_notes
      }));

      const { error: sequenceError } = await supabase
        .from('flow_sequences')
        .insert(sequences);

      if (sequenceError) {
        console.error('Error creating flow sequences:', sequenceError);
        // Clean up the flow if sequences failed
        await supabase.from('flows').delete().eq('id', flow.id);
        return NextResponse.json({ error: 'Failed to create flow sequences' }, { status: 500 });
      }
    }

    return NextResponse.json({ flow }, { status: 201 });
  } catch (error) {
    console.error('Create flow API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}