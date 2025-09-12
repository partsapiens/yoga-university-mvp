import { NextRequest, NextResponse } from 'next/server';
import { openai, isOpenAIAvailable } from '@/lib/openai';
import { getManifest, readChapter } from '@/lib/manual';

// POST /api/ai/manual-explain - Explain complex yoga concepts in detail
export async function POST(request: NextRequest) {
  try {
    const { 
      concept, 
      level = 'intermediate', // beginner, intermediate, advanced
      context = ''
    } = await request.json();

    if (!concept || typeof concept !== 'string') {
      return NextResponse.json(
        { error: 'Concept is required and must be a string' },
        { status: 400 }
      );
    }

    if (!isOpenAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service is currently unavailable' },
        { status: 503 }
      );
    }

    // Get relevant manual content for context
    const manifest = getManifest();
    let relevantContent = '';

    // Search for content related to the concept
    const conceptLower = concept.toLowerCase();
    const relevantChapters = manifest.chapters.filter(chapter => {
      return (
        chapter.title.toLowerCase().includes(conceptLower) ||
        chapter.group.toLowerCase().includes(conceptLower) ||
        (chapter.summary && chapter.summary.toLowerCase().includes(conceptLower))
      );
    });

    // If no direct matches, look in philosophy and anatomy sections
    if (relevantChapters.length === 0) {
      const fallbackChapters = manifest.chapters.filter(chapter =>
        ['History and Philosophy', 'Anatomy'].includes(chapter.group)
      );
      relevantChapters.push(...fallbackChapters.slice(0, 2));
    }

    // Load content from relevant chapters
    for (const chapterMeta of relevantChapters.slice(0, 3)) {
      try {
        const chapter = readChapter(chapterMeta.slug);
        relevantContent += `\n\n## ${chapter.frontMatter.title}\n${chapter.content.substring(0, 2000)}`;
      } catch (error) {
        continue;
      }
    }

    const levelDescriptions = {
      beginner: 'someone new to yoga with basic understanding',
      intermediate: 'a yoga student with some experience and knowledge',
      advanced: 'an experienced practitioner or teacher seeking deeper understanding'
    };

    const systemPrompt = `You are an expert yoga teacher and scholar specializing in making complex yoga concepts accessible. Explain the concept "${concept}" for ${levelDescriptions[level as keyof typeof levelDescriptions]}.

Your explanation should include:
1. **Definition**: Clear, concise definition of the concept
2. **Etymology**: Sanskrit origins and meaning (if applicable)
3. **Context**: How it fits into yoga philosophy or practice
4. **Practical Application**: How this applies to yoga practice or teaching
5. **Common Misconceptions**: What students often misunderstand
6. **Deeper Insights**: Additional wisdom for reflection

Adapt your language and depth to the ${level} level:
- Beginner: Simple language, basic concepts, practical examples
- Intermediate: Some Sanskrit terms, connections between concepts
- Advanced: Complex philosophical ideas, nuanced understanding, teaching applications

Additional context provided: ${context}

Reference material from Yoga Teacher Training Manual:
${relevantContent}

Provide a comprehensive yet accessible explanation that helps the student truly understand this concept.`;

    const completion = await openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt }
      ],
      temperature: 0.6,
      max_tokens: 1200,
    });

    const explanation = completion.choices[0]?.message?.content || '';

    // Filter content for safety
    const filteredExplanation = filterYogaContent(explanation);

    // Find related concepts for further exploration
    const relatedConcepts = findRelatedConcepts(concept, manifest);

    return NextResponse.json({
      concept,
      explanation: filteredExplanation,
      level,
      relatedConcepts,
      suggestedReading: relevantChapters.slice(0, 3).map(ch => ({
        title: ch.title,
        slug: ch.slug,
        group: ch.group
      }))
    });

  } catch (error) {
    console.error('Concept explanation error:', error);
    return NextResponse.json(
      { error: 'Failed to explain the concept. Please try again.' },
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

// Find related concepts based on the query
function findRelatedConcepts(concept: string, manifest: any): string[] {
  const conceptLower = concept.toLowerCase();
  const relatedConcepts: Set<string> = new Set();

  // Common yoga concept relationships
  const conceptMap: { [key: string]: string[] } = {
    'ahimsa': ['satya', 'asteya', 'yamas', 'non-violence'],
    'pranayama': ['breath', 'prana', 'breathing', 'energy'],
    'asana': ['posture', 'poses', 'alignment', 'body'],
    'dharana': ['concentration', 'meditation', 'dhyana', 'samadhi'],
    'chakra': ['energy', 'chakras', 'prana', 'meditation'],
    'mantra': ['om', 'chanting', 'sound', 'vibration'],
    'bandha': ['energy', 'locks', 'prana', 'core'],
    'vinyasa': ['flow', 'breath', 'movement', 'sequence']
  };

  // Add direct relationships
  Object.entries(conceptMap).forEach(([key, related]) => {
    if (conceptLower.includes(key) || key.includes(conceptLower)) {
      related.forEach(r => relatedConcepts.add(r));
    }
  });

  // Add concepts from chapter titles that might be related
  manifest.chapters.forEach((chapter: any) => {
    const titleWords = chapter.title.toLowerCase().split(/\s+/);
    if (titleWords.some((word: string) => conceptLower.includes(word) || word.includes(conceptLower))) {
      titleWords.forEach((word: string) => {
        if (word.length > 3 && !['yoga', 'the', 'and', 'of', 'in', 'for'].includes(word)) {
          relatedConcepts.add(word);
        }
      });
    }
  });

  return Array.from(relatedConcepts).slice(0, 5);
}