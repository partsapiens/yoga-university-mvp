import { NextRequest, NextResponse } from 'next/server';
import { openai, isOpenAIAvailable } from '@/lib/openai';
import { getManifest, readChapter } from '@/lib/manual';

// POST /api/ai/manual-chat - AI-powered Q&A about yoga philosophy and manual content
export async function POST(request: NextRequest) {
  try {
    const { message, context = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (!isOpenAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service is currently unavailable' },
        { status: 503 }
      );
    }

    // Get manual content for context
    const manifest = getManifest();
    const philosophyChapters = manifest.chapters.filter(
      chapter => chapter.group === 'History and Philosophy'
    );

    // Build context from relevant manual content
    let manualContext = '';
    try {
      // Get key philosophy chapters for context
      const keyChapters = ['yoga-sutras-of-patanjali', 'yamas-and-niyamas', 'pranayama', 'chakras'];
      for (const slug of keyChapters) {
        try {
          const chapter = readChapter(slug);
          manualContext += `\n\n## ${chapter.frontMatter.title}\n${chapter.content.substring(0, 2000)}`;
        } catch (error) {
          // Skip if chapter not found
          continue;
        }
      }
    } catch (error) {
      console.warn('Could not load manual context:', error);
    }

    // Create conversation history
    const conversationHistory = context.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    const systemPrompt = `You are an expert yoga teacher and philosopher, specializing in helping students understand yoga philosophy, Sanskrit concepts, and spiritual practices. You have access to the Yoga Teacher Training Manual content.

Key areas you can help with:
- Yoga Sutras of Patanjali and their meaning
- The eight-limbed path (Ashtanga Yoga)
- Yamas and Niyamas (ethical guidelines)
- Sanskrit terminology and pronunciation
- Pranayama (breathing practices)
- Chakras and energy work
- Meditation and mindfulness practices
- Teaching methodology and alignment

Guidelines:
- Provide clear, accessible explanations suitable for yoga students
- Reference specific sutras, concepts, or practices when relevant
- Encourage deeper practice and study
- Avoid medical claims or therapeutic advice
- Keep responses focused on yoga philosophy and practice
- Use Sanskrit terms appropriately with English explanations

Manual Context:
${manualContext}

Respond with wisdom, compassion, and clarity.`;

    const completion = await openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || '';

    // Filter content for safety
    const filteredResponse = filterYogaContent(response);

    return NextResponse.json({
      response: filteredResponse,
      context: [
        ...context,
        { role: 'user', content: message },
        { role: 'assistant', content: filteredResponse }
      ]
    });

  } catch (error) {
    console.error('Manual chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process your question. Please try again.' },
      { status: 500 }
    );
  }
}

// Filter content to ensure appropriate yoga guidance
function filterYogaContent(content: string): string {
  // Remove any potential medical claims
  let filtered = content.replace(/\b(cure|treat|heal|therapy|medical|diagnosis|disease)\b/gi, 'support');
  
  // Ensure appropriate spiritual language
  filtered = filtered.replace(/\b(prescription|medicine|drug)\b/gi, 'practice');
  
  return filtered.trim();
}