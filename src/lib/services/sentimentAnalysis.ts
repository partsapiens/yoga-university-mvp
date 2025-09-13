import { openai, isOpenAIAvailable } from '@/lib/openai';

// Sentiment analysis types
export interface SentimentResult {
  mood: string;
  confidence: number;
  emotions: Array<{
    emotion: string;
    intensity: number;
  }>;
  needsAttention: boolean;
  suggestedStyle: string;
  reasoning: string;
}

export interface MoodPattern {
  timestamp: string;
  mood: string;
  confidence: number;
  textInput?: string;
  context?: string;
}

/**
 * Analyze sentiment and extract emotional state from user text input
 */
export async function analyzeSentiment(text: string, context?: string): Promise<SentimentResult> {
  if (!isOpenAIAvailable()) {
    // Fallback to rule-based analysis if OpenAI is not available
    return analyzeWithRules(text);
  }

  try {
    const prompt = `
Analyze the emotional state and sentiment of this text from a yoga/meditation student:
"${text}"

Context: ${context || 'General mood check-in'}

Please respond with a JSON object containing:
{
  "mood": "primary mood (stressed, anxious, tired, happy, energetic, calm, overwhelmed, sad, focused, neutral)",
  "confidence": 0.0-1.0,
  "emotions": [{"emotion": "secondary emotion", "intensity": 0.0-1.0}],
  "needsAttention": boolean (true if expressing distress, crisis, or severe negative emotions),
  "suggestedStyle": "recommended meditation style (mindfulness, breathing, body-scan, loving-kindness, sleep, focus)",
  "reasoning": "brief explanation for the recommendations"
}

Focus on emotional wellness and provide compassionate, helpful suggestions.`;

    const response = await openai!.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a compassionate mindfulness coach helping to understand emotional states for personalized meditation recommendations. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(result);
  } catch (error) {
    console.warn('OpenAI sentiment analysis failed, falling back to rules:', error);
    return analyzeWithRules(text);
  }
}

/**
 * Rule-based sentiment analysis fallback
 */
function analyzeWithRules(text: string): SentimentResult {
  const lowercaseText = text.toLowerCase();
  
  // Emotion keywords mapping
  const emotionPatterns = {
    stressed: ['stress', 'stressed', 'pressure', 'overwhelm', 'busy', 'deadline', 'tension'],
    anxious: ['anxious', 'worry', 'nervous', 'panic', 'fear', 'uneasy', 'restless'],
    tired: ['tired', 'exhausted', 'sleepy', 'fatigue', 'drain', 'worn out', 'weary'],
    sad: ['sad', 'depressed', 'down', 'blue', 'grief', 'melancholy', 'upset'],
    happy: ['happy', 'joy', 'excited', 'cheerful', 'glad', 'delighted', 'pleased'],
    energetic: ['energetic', 'hyper', 'active', 'pumped', 'motivated', 'vibrant'],
    calm: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed', 'centered'],
    focused: ['focus', 'concentrate', 'clear', 'sharp', 'alert', 'mindful'],
    overwhelmed: ['overwhelmed', 'too much', 'chaos', 'scattered', 'frazzled']
  };

  let bestMatch = 'neutral';
  let bestScore = 0;
  let confidence = 0.5;

  // Find the best matching emotion
  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    const matches = keywords.filter(keyword => lowercaseText.includes(keyword)).length;
    if (matches > bestScore) {
      bestScore = matches;
      bestMatch = emotion;
      confidence = Math.min(0.9, 0.5 + (matches * 0.2));
    }
  }

  // Detect crisis keywords
  const crisisKeywords = ['suicide', 'kill myself', 'want to die', 'hurt myself', 'crisis', 'emergency'];
  const needsAttention = crisisKeywords.some(keyword => lowercaseText.includes(keyword));

  // Suggest meditation style based on mood
  const styleMapping: Record<string, string> = {
    stressed: 'breathing',
    anxious: 'mindfulness',
    tired: 'sleep',
    sad: 'loving-kindness',
    happy: 'mindfulness',
    energetic: 'focus',
    calm: 'mindfulness',
    focused: 'focus',
    overwhelmed: 'body-scan',
    neutral: 'mindfulness'
  };

  return {
    mood: bestMatch,
    confidence,
    emotions: [
      { emotion: bestMatch, intensity: confidence }
    ],
    needsAttention,
    suggestedStyle: styleMapping[bestMatch] || 'mindfulness',
    reasoning: `Detected ${bestMatch} mood based on text analysis. Recommended ${styleMapping[bestMatch]} meditation to support your current state.`
  };
}

/**
 * Analyze mood patterns over time to identify trends
 */
export function analyzeMoodPatterns(patterns: MoodPattern[]): {
  dominantMood: string;
  trend: 'improving' | 'declining' | 'stable';
  recommendations: string[];
  riskFactors: string[];
} {
  if (patterns.length === 0) {
    return {
      dominantMood: 'neutral',
      trend: 'stable',
      recommendations: ['Start with daily mood tracking to understand your patterns'],
      riskFactors: []
    };
  }

  // Calculate dominant mood
  const moodCounts: Record<string, number> = {};
  patterns.forEach(pattern => {
    moodCounts[pattern.mood] = (moodCounts[pattern.mood] || 0) + 1;
  });
  
  const dominantMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

  // Analyze trend (last 7 days vs previous 7 days)
  const recent = patterns.slice(-7);
  const previous = patterns.slice(-14, -7);
  
  const positiveEmotions = ['happy', 'energetic', 'calm', 'focused'];
  const negativeEmotions = ['stressed', 'anxious', 'sad', 'overwhelmed', 'tired'];
  
  const recentPositive = recent.filter(p => positiveEmotions.includes(p.mood)).length;
  const previousPositive = previous.filter(p => positiveEmotions.includes(p.mood)).length;
  
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (recentPositive > previousPositive) trend = 'improving';
  else if (recentPositive < previousPositive) trend = 'declining';

  // Generate recommendations
  const recommendations: string[] = [];
  const riskFactors: string[] = [];

  // Check for concerning patterns
  const recentNegative = recent.filter(p => negativeEmotions.includes(p.mood)).length;
  if (recentNegative > 5) {
    riskFactors.push('High frequency of negative emotions detected');
    recommendations.push('Consider speaking with a mental health professional');
    recommendations.push('Try daily mindfulness meditation');
  }

  // Mood-specific recommendations
  if (dominantMood === 'stressed') {
    recommendations.push('Focus on breathing exercises and gentle yoga');
    recommendations.push('Try progressive muscle relaxation');
  } else if (dominantMood === 'anxious') {
    recommendations.push('Practice grounding techniques and body-scan meditations');
    recommendations.push('Consider longer meditation sessions for deeper calm');
  } else if (dominantMood === 'tired') {
    recommendations.push('Focus on restorative practices and sleep meditation');
    recommendations.push('Check your sleep hygiene and daily energy patterns');
  }

  return {
    dominantMood,
    trend,
    recommendations,
    riskFactors
  };
}

/**
 * Privacy-safe mood tracking (no personal data stored)
 */
export function createAnonymizedMoodData(sentimentResult: SentimentResult): {
  timestamp: string;
  moodCategory: string;
  confidenceRange: string;
  sessionType: string;
} {
  return {
    timestamp: new Date().toISOString().split('T')[0], // Date only, no time
    moodCategory: sentimentResult.mood,
    confidenceRange: sentimentResult.confidence > 0.7 ? 'high' : 
                    sentimentResult.confidence > 0.4 ? 'medium' : 'low',
    sessionType: sentimentResult.suggestedStyle
  };
}