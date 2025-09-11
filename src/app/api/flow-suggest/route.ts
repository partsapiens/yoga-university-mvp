import { NextResponse } from "next/server";
import { oa, isOpenAIAvailable } from "@/lib/openai";
import { supabase } from "@/utils/supabaseClient";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { goal, time, difficulty, equipment } = await req.json();

    if (!isOpenAIAvailable()) {
      return NextResponse.json({
        sequence: [1, 2, 3],
        cuesByPose: {
          "1": "Start in mountain pose",
          "2": "Flow into downward dog",
          "3": "Settle into child's pose"
        }
      });
    }

    // Fetch poses from database based on criteria
    let query = supabase
      .from('poses')
      .select('id, name, category, difficulty, intensity, related_poses')
      .eq('is_published', true);

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data: poses, error } = await query.limit(50);
    
    if (error || !poses) {
      throw new Error('Failed to fetch poses');
    }

    // Use AI to generate sequence and cues
    const prompt = `
Create a yoga flow for:
GOAL: ${goal}
TIME: ${time} minutes
DIFFICULTY: ${difficulty}
EQUIPMENT: ${equipment}

Available poses: ${poses.map(p => `${p.id}:${p.name}`).join(', ')}

Build a skeleton sequence using pose IDs, then provide natural cues.
Return JSON: {"sequence": [id1, id2, ...], "cuesByPose": {"id1": "cue text", ...}}
Keep cues encouraging and anatomically safe.
`;

    const r = await oa!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Experienced yoga instructor. Focus on safe transitions and encouraging cues." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(r.choices[0].message.content!);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Flow suggestion error:', error);
    return NextResponse.json({ error: 'Failed to generate flow suggestion' }, { status: 500 });
  }
}