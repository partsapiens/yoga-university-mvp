import { NextRequest, NextResponse } from 'next/server';
import { openai, isOpenAIAvailable } from '@/lib/openai';
import { getManifest, readChapter } from '@/lib/manual';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

// POST /api/ai/manual-quiz - Generate practice quizzes from manual content
export async function POST(request: NextRequest) {
  try {
    const { 
      topic, 
      difficulty = 'intermediate', 
      questionCount = 5,
      chapterSlug 
    } = await request.json();

    if (!isOpenAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service is currently unavailable' },
        { status: 503 }
      );
    }

    // Get content for quiz generation
    let sourceContent = '';
    const manifest = getManifest();

    if (chapterSlug) {
      // Generate quiz from specific chapter
      try {
        const chapter = readChapter(chapterSlug);
        sourceContent = `Chapter: ${chapter.frontMatter.title}\n\n${chapter.content}`;
      } catch (error) {
        return NextResponse.json(
          { error: 'Chapter not found' },
          { status: 404 }
        );
      }
    } else if (topic) {
      // Generate quiz from topic area
      const relevantChapters = manifest.chapters.filter(chapter => {
        const topicLower = topic.toLowerCase();
        return (
          chapter.title.toLowerCase().includes(topicLower) ||
          chapter.group.toLowerCase().includes(topicLower) ||
          (chapter.summary && chapter.summary.toLowerCase().includes(topicLower))
        );
      });

      if (relevantChapters.length === 0) {
        return NextResponse.json(
          { error: 'No content found for the specified topic' },
          { status: 404 }
        );
      }

      // Use first few relevant chapters for context
      const chaptersToUse = relevantChapters.slice(0, 3);
      for (const chapterMeta of chaptersToUse) {
        try {
          const chapter = readChapter(chapterMeta.slug);
          sourceContent += `\n\n## ${chapter.frontMatter.title}\n${chapter.content.substring(0, 1500)}`;
        } catch (error) {
          continue;
        }
      }
    } else {
      // Default to philosophy content
      const philosophyChapters = ['yoga-sutras-of-patanjali', 'yamas-and-niyamas'];
      for (const slug of philosophyChapters) {
        try {
          const chapter = readChapter(slug);
          sourceContent += `\n\n## ${chapter.frontMatter.title}\n${chapter.content.substring(0, 1500)}`;
        } catch (error) {
          continue;
        }
      }
    }

    if (!sourceContent.trim()) {
      return NextResponse.json(
        { error: 'No content available for quiz generation' },
        { status: 404 }
      );
    }

    const systemPrompt = `You are an expert yoga teacher creating educational quizzes for yoga students. Generate ${questionCount} multiple-choice questions based on the provided content.

Difficulty Level: ${difficulty}
- Beginner: Basic concepts, definitions, simple recall
- Intermediate: Application of concepts, relationships between ideas
- Advanced: Deep understanding, synthesis, complex scenarios

Format your response as a JSON array of questions with this exact structure:
[
  {
    "id": "q1",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Clear explanation of why this is correct",
    "difficulty": "${difficulty}",
    "topic": "Main topic this question covers"
  }
]

Guidelines:
- Make questions educational and thought-provoking
- Include questions about Sanskrit terms with proper explanations
- Cover key concepts from the content
- Ensure explanations help students learn
- Avoid overly obscure details for beginner level
- Make options plausible but clearly distinguishable

Content to base questions on:
${sourceContent.substring(0, 4000)}

Return only the JSON array, no additional text.`;

    const completion = await openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent quiz format
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content || '';
    
    // Try to parse the JSON response
    let questions: QuizQuestion[];
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseContent.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseContent;
      questions = JSON.parse(jsonString);
      
      // Validate the structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid quiz format');
      }

      // Ensure each question has required fields
      questions = questions.map((q, index) => ({
        id: q.id || `q${index + 1}`,
        question: q.question || 'Question text missing',
        options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: q.explanation || 'Explanation not provided',
        difficulty: q.difficulty || difficulty,
        topic: q.topic || topic || 'Yoga Philosophy'
      }));

    } catch (error) {
      console.error('Failed to parse quiz JSON:', error, responseContent);
      // Fallback quiz
      questions = [
        {
          id: 'q1',
          question: 'What does the Sanskrit word "yoga" mean?',
          options: ['To bend', 'To unite or yoke', 'To breathe', 'To meditate'],
          correctAnswer: 1,
          explanation: 'Yoga comes from the Sanskrit root "yuj" meaning to unite or yoke, referring to the union of mind, body, and spirit.',
          difficulty: difficulty as any,
          topic: 'Yoga Philosophy'
        }
      ];
    }

    return NextResponse.json({
      questions: questions.slice(0, questionCount),
      metadata: {
        totalQuestions: questions.length,
        difficulty,
        topic: topic || chapterSlug || 'Yoga Philosophy',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz. Please try again.' },
      { status: 500 }
    );
  }
}