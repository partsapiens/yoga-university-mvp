import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion, filterContent } from '@/lib/openai';
import { AIScriptInput, AIScriptOutput, MeditationScript, MeditationPhase, BreathingPattern } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const body: AIScriptInput = await request.json();
    const { 
      style, 
      duration, 
      userPreferences, 
      sessionHistory = [], 
      userContext 
    } = body;

    // Validate inputs
    if (!style || !duration || !userPreferences) {
      return NextResponse.json({ 
        error: 'style, duration, and userPreferences are required' 
      }, { status: 400 });
    }

    // Build context for AI prompt
    const historyText = sessionHistory.length > 0 
      ? sessionHistory.map(s => `${s.scriptId} (${s.completed ? 'completed' : 'incomplete'}${s.rating ? `, rated ${s.rating}/5` : ''})`).join(', ')
      : 'No previous sessions';

    const averageRating = sessionHistory.length > 0 
      ? sessionHistory.filter(s => s.rating).reduce((sum, s) => sum + (s.rating || 0), 0) / sessionHistory.filter(s => s.rating).length 
      : 0;

    // Get recent phrases to avoid repetition (simplified for now)
    const recentPhrases = ['breathe deeply', 'let go', 'find peace']; // This would come from actual history

    // Enhanced prompt template
    const scriptPrompt = `Generate personalized ${style} meditation for ${duration} minutes.

User Profile:
- Prefers ${userPreferences.voiceTone} guidance at ${userPreferences.guidanceLevel} level
- Resonates with: ${userPreferences.personalTouchpoints.join(', ')}
- Previous scripts rated: ${averageRating || 'N/A'}/5
- Session history: ${historyText}
${userContext ? `- Current context: ${userContext}` : ''}

Requirements:
1. Welcoming intro (45-60 seconds) that acknowledges their current state
2. Core meditation with breathing cues synchronized to the breathing pattern
3. Smooth transitions between phases
4. Supportive outro with gentle return to awareness
5. Avoid phrases used in recent sessions: ${recentPhrases.join(', ')}

Style Guidelines:
- Use present-tense, inclusive language
- Incorporate sensory details (${userPreferences.personalTouchpoints.join(', ')})
- Maintain consistent pacing for ${duration} minutes
- No medical claims or therapeutic advice

Structure as JSON with precise timing for each segment:
{
  "scriptId": "unique_id",
  "intro": "welcoming introduction text",
  "breathingCues": [
    {"phase": "inhale", "text": "guidance text", "duration": seconds},
    {"phase": "exhale", "text": "guidance text", "duration": seconds}
  ],
  "transitions": ["transition text 1", "transition text 2"],
  "outro": "closing guidance text",
  "backgroundMusicSuggestion": "music style description",
  "estimatedWords": approximate_word_count
}`;

    // Generate AI response
    const aiResponse = await generateCompletion(scriptPrompt, 'medium', 0.7);
    const filteredResponse = filterContent(aiResponse);

    // Parse JSON response
    let scriptOutput: AIScriptOutput;
    try {
      // Extract JSON from response
      const jsonMatch = filteredResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : filteredResponse;
      const parsed = JSON.parse(jsonStr);
      
      scriptOutput = {
        scriptId: parsed.scriptId || `script_${Date.now()}`,
        intro: parsed.intro || generateFallbackIntro(style, userPreferences.voiceTone),
        breathingCues: Array.isArray(parsed.breathingCues) ? parsed.breathingCues : [],
        transitions: Array.isArray(parsed.transitions) ? parsed.transitions : [],
        outro: parsed.outro || generateFallbackOutro(userPreferences.voiceTone),
        backgroundMusicSuggestion: parsed.backgroundMusicSuggestion || 'Gentle nature sounds or soft ambient music',
        estimatedWords: parsed.estimatedWords || Math.floor(duration * 120) // ~120 words per minute
      };
    } catch (parseError) {
      console.error('Failed to parse AI script response:', parseError);
      
      // Fallback script generation
      scriptOutput = generateFallbackScript(style, duration, userPreferences);
    }

    // Convert to MeditationScript format for compatibility
    const meditationScript = convertToMeditationScript(scriptOutput, style, duration);

    return NextResponse.json({
      ...scriptOutput,
      meditationScript // Include both formats for flexibility
    });

  } catch (error) {
    console.error('AI Script error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate meditation script' 
    }, { status: 500 });
  }
}

// Fallback script generation when AI fails
function generateFallbackScript(
  style: string, 
  duration: number, 
  userPreferences: AIScriptInput['userPreferences']
): AIScriptOutput {
  const scriptId = `fallback_${Date.now()}`;
  
  const styleIntros = {
    mindfulness: "Welcome to this mindfulness practice. Find a comfortable position and gently close your eyes.",
    breathing: "Let's begin this breathing practice together. Settle into a position that feels supportive.",
    'body-scan': "Welcome to this body scan meditation. Allow yourself to fully arrive in this moment.",
    'loving-kindness': "Welcome to this practice of loving-kindness. Let's cultivate compassion together.",
    sleep: "Welcome to this calming practice designed to prepare you for rest.",
    focus: "Welcome to this focus meditation. We'll strengthen your attention together."
  };

  const styleOutros = {
    mindfulness: "Gently return your awareness to your surroundings. When you're ready, slowly open your eyes.",
    breathing: "Take a moment to appreciate your breath. Slowly return to your day with this sense of calm.",
    'body-scan': "Notice the relaxation throughout your body. Carry this awareness with you.",
    'loving-kindness': "May this loving-kindness extend to all beings. Gently return to your day.",
    sleep: "Allow this peaceful state to carry you into restful sleep.",
    focus: "Your attention is strengthened. Carry this focused awareness into your activities."
  };

  return {
    scriptId,
    intro: styleIntros[style as keyof typeof styleIntros] || styleIntros.mindfulness,
    breathingCues: [
      { phase: 'inhale', text: 'Breathe in slowly and deeply', duration: 4 },
      { phase: 'exhale', text: 'Release the breath gently', duration: 4 }
    ],
    transitions: [
      "Now, let's deepen our practice...",
      "Continue to follow your breath...",
      "Allow yourself to settle even deeper..."
    ],
    outro: styleOutros[style as keyof typeof styleOutros] || styleOutros.mindfulness,
    backgroundMusicSuggestion: 'Soft nature sounds or gentle ambient music',
    estimatedWords: duration * 120
  };
}

function generateFallbackIntro(style: string, tone: string): string {
  const toneAdjectives = {
    gentle: 'gently',
    confident: 'with confidence',
    warm: 'warmly'
  };
  
  const adjective = toneAdjectives[tone as keyof typeof toneAdjectives] || 'gently';
  
  return `Welcome ${adjective} to this ${style} practice. Take a moment to settle into this space you've created for yourself.`;
}

function generateFallbackOutro(tone: string): string {
  const closings = {
    gentle: 'Take your time returning to the world around you. You are peaceful and centered.',
    confident: 'You have successfully completed this practice. Carry this strength with you.',
    warm: 'Thank you for this time together. May you feel supported and at peace.'
  };
  
  return closings[tone as keyof typeof closings] || closings.gentle;
}

// Convert AIScriptOutput to MeditationScript for compatibility
function convertToMeditationScript(
  scriptOutput: AIScriptOutput, 
  style: string, 
  duration: number
): MeditationScript {
  const totalDuration = duration * 60; // Convert to seconds
  
  const phases: MeditationPhase[] = [
    {
      id: 'intro',
      name: 'intro',
      duration: Math.floor(totalDuration * 0.15),
      script: scriptOutput.intro,
      voiceSettings: { pace: 'slow', tone: 'gentle' }
    },
    {
      id: 'main',
      name: 'main',
      duration: Math.floor(totalDuration * 0.7),
      script: scriptOutput.transitions.join(' '),
      voiceSettings: { pace: 'normal', tone: 'neutral' }
    },
    {
      id: 'close',
      name: 'close',
      duration: Math.floor(totalDuration * 0.15),
      script: scriptOutput.outro,
      voiceSettings: { pace: 'slow', tone: 'gentle' }
    }
  ];

  const breathingPattern: BreathingPattern | undefined = 
    style === 'breathing' ? {
      name: 'Natural Breathing',
      inhale: 4,
      exhale: 4,
      description: 'Natural, comfortable breathing rhythm'
    } : undefined;

  return {
    id: scriptOutput.scriptId,
    title: `Personalized ${style} meditation (${duration} min)`,
    phases,
    totalDuration,
    breathingPattern
  };
}