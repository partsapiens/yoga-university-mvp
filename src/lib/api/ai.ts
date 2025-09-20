import type { RecommendationInput, Recommendation, FormCheckInput, FormFeedback, MeditationInput, MeditationScript, MeditationPhase, BreathingPattern } from '@/types/ai';
import type { SavedFlow } from '@/types/yoga';
import { PoseId } from '@/types/yoga';
import { generateCompletion, isOpenAIAvailable } from '@/lib/openai';
import { POSES } from '@/lib/yoga-data';

export async function fetchRecommendations(input: RecommendationInput): Promise<Recommendation[]> {
  // Base recommendations by focus area
  const focusRecommendations: Record<string, Recommendation[]> = {
    'core': [
      { name: 'Core Power Flow', poses: [PoseId.DownDog, PoseId.Warrior1Right], reason: 'Targeted core strengthening sequence' },
      { name: 'Plank Progression', poses: [PoseId.DownDog], reason: 'Build core stability gradually' }
    ],
    'flexibility': [
      { name: 'Hip Opening Flow', poses: [PoseId.Butterfly, PoseId.Child], reason: 'Gentle hip mobility and flexibility' },
      { name: 'Forward Fold Series', poses: [PoseId.ForwardFold], reason: 'Improve hamstring and spine flexibility' }
    ],
    'balance': [
      { name: 'Standing Balance Flow', poses: [PoseId.Warrior1Right], reason: 'Improve stability and focus' },
      { name: 'Tree Pose Variations', poses: [], reason: 'Progressive balance challenges' }
    ],
    'relaxation': [
      { name: 'Restorative Sequence', poses: [PoseId.Child, PoseId.Butterfly], reason: 'Deep relaxation and stress relief' },
      { name: 'Gentle Evening Flow', poses: [PoseId.ForwardFold, PoseId.Child], reason: 'Wind down for better sleep' }
    ]
  };

  // Mood-based adjustments
  const moodAdjustments: Record<string, string> = {
    'stressed': 'Perfect for stress relief and calming the mind',
    'energetic': 'Channel your energy into dynamic movement',
    'tired': 'Gentle practice to restore your energy',
    'anxious': 'Grounding poses to center yourself',
    'happy': 'Celebrate with uplifting sequences',
    'focused': 'Mindful practice to enhance concentration'
  };

  // Intensity-based modifications
  const intensityDescriptions = [
    'Very gentle and restorative',
    'Gentle with optional variations',
    'Moderate intensity with mindful holds',
    'Challenging with dynamic transitions',
    'Advanced practice for experienced yogis'
  ];

  // Get base recommendations from focus area
  const baseRecs = focusRecommendations[input.focus?.toLowerCase()] || 
                   focusRecommendations['relaxation'];

  // Generate personalized recommendations
  const recommendations = baseRecs.map(rec => ({
    ...rec,
    reason: input.mood && moodAdjustments[input.mood.toLowerCase()] 
      ? `${rec.reason} - ${moodAdjustments[input.mood.toLowerCase()]}`
      : rec.reason
  }));

  // Add duration-specific recommendation
  if (input.duration && input.duration < 20) {
    recommendations.unshift({
      name: 'Quick Energy Boost',
      poses: [PoseId.DownDog, PoseId.ForwardFold],
      reason: `Perfect ${input.duration}-minute practice for busy schedules`
    });
  } else if (input.duration && input.duration > 45) {
    recommendations.push({
      name: 'Complete Practice Journey',
      poses: [PoseId.DownDog, PoseId.Warrior1Right, PoseId.ForwardFold, PoseId.Child],
      reason: `Full ${input.duration}-minute sequence for deep transformation`
    });
  }

  // Add intensity-specific recommendation
  if (input.intensity && input.intensity >= 1 && input.intensity <= 5) {
    const intensityRec = {
      name: `Level ${input.intensity} Flow`,
      poses: input.intensity >= 4 ? [PoseId.DownDog, PoseId.Warrior1Right] : [PoseId.Child, PoseId.Butterfly],
      reason: intensityDescriptions[input.intensity - 1]
    };
    recommendations.push(intensityRec);
  }

  // Handle injuries
  if (input.injuries && input.injuries.trim()) {
    recommendations.unshift({
      name: 'Gentle Therapeutic Flow',
      poses: [PoseId.Child, PoseId.Butterfly],
      reason: 'Modified practice considering your current needs'
    });
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

export async function checkForm(input: FormCheckInput): Promise<FormFeedback[]> {
  // Try AI-generated feedback first if available
  if (isOpenAIAvailable()) {
    try {
      return await generateAIFormFeedback(input);
    } catch (error) {
      console.warn('AI form check failed, using fallback:', error);
    }
  }
  
  // Fallback to curated feedback
  return generateCuratedFormFeedback(input);
}

async function generateAIFormFeedback(input: FormCheckInput): Promise<FormFeedback[]> {
  const pose = POSES.find(p => p.id === input.pose);
  if (!pose) {
    return [{ message: 'Pose not found in database' }];
  }

  const prompt = `Provide 2-3 specific form tips for ${pose.name} (${pose.sanskrit}) yoga pose.

User notes: ${input.notes || 'None'}

Focus on:
- Proper alignment and safety
- Common mistakes to avoid
- Breathing guidance
- Modifications if needed

Keep tips concise and actionable. Avoid medical claims.`;

  const response = await generateCompletion(prompt, 'simple', 0.3);
  
  // Parse response into feedback items
  const feedbackLines = response.split('\n').filter(line => line.trim().length > 0);
  
  return feedbackLines.slice(0, 3).map(line => ({
    message: line.replace(/^[-•*]\s*/, '').trim() // Remove bullet points
  }));
}

function generateCuratedFormFeedback(input: FormCheckInput): FormFeedback[] {
  // Simulate more realistic AI feedback based on pose and notes
  const poseSpecificFeedback: Record<string, string[]> = {
    [PoseId.DownDog]: [
      'Press actively through your hands to protect your wrists',
      'Keep your spine long and straight - imagine creating space between each vertebra',
      'Engage your core to support your lower back',
      'External rotation of your arms helps stabilize your shoulders'
    ],
    [PoseId.Warrior1Right]: [
      'Keep your front knee tracking over your ankle',
      'Square your hips toward the front of your mat',
      'Root down through both feet to find stability',
      'Lengthen through the crown of your head'
    ],
    [PoseId.ForwardFold]: [
      'Bend from your hips, not your waist',
      'Keep a micro-bend in your knees to protect your hamstrings',
      'Let your arms hang heavy or hold opposite elbows',
      'Focus on lengthening your spine rather than forcing the fold'
    ],
    [PoseId.Child]: [
      'Rest your forehead on the mat or a block if needed',
      'Keep your knees hip-width apart for comfort',
      'Breathe deeply into your back ribs',
      'This pose should feel restorative - adjust as needed'
    ],
    [PoseId.Butterfly]: [
      'Sit tall and proud through your spine',
      'Draw the soles of your feet together gently',
      'Use your hands on your ankles, not your feet',
      'Forward fold comes from your hips, keeping your back straight'
    ]
  };

  const generalFeedback = [
    'Remember to breathe deeply and consistently',
    'Listen to your body and modify as needed',
    'Focus on alignment over depth',
    'Engage your core for stability'
  ];

  const notesBasedFeedback = [];
  if (input.notes.toLowerCase().includes('pain')) {
    notesBasedFeedback.push('⚠️ If you feel pain, please ease out of the pose immediately');
  }
  if (input.notes.toLowerCase().includes('tight')) {
    notesBasedFeedback.push('💡 Hold the pose gently and breathe into tight areas');
  }
  if (input.notes.toLowerCase().includes('balance')) {
    notesBasedFeedback.push('🎯 Focus on a fixed point ahead to improve balance');
  }
  if (input.notes.toLowerCase().includes('beginner')) {
    notesBasedFeedback.push('🌱 Great job starting your practice! Take your time with each pose');
  }

  const relevantFeedback = poseSpecificFeedback[input.pose] || generalFeedback;
  const selectedFeedback = relevantFeedback.slice(0, 2 + Math.floor(Math.random() * 2));
  
  return [
    ...selectedFeedback.map(message => ({ message })),
    ...notesBasedFeedback.map(message => ({ message }))
  ];
}

export async function autogenFlow(_input: {
  name: string;
  duration: number;
  intensity: number;
  focus: string;
  mood: string;
  injuries?: string;
}): Promise<SavedFlow> {
  return {
    id: Date.now().toString(),
    name: _input.name,
    flow: [],
    overrides: {},
  };
}

// Meditation-specific AI functions
export async function generateMeditationScript(input: MeditationInput): Promise<MeditationScript> {
  // Define breathing patterns
  const breathingPatterns: Record<string, BreathingPattern> = {
    box: { name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4, description: '4-4-4-4 pattern for stress relief' },
    triangle: { name: '4-7-8 Breathing', inhale: 4, hold1: 7, exhale: 8, description: 'Calming pattern for sleep and anxiety' },
    resonance: { name: 'Resonance Breathing', inhale: 5.5, exhale: 5.5, description: 'Balanced 5.5 BPM for optimal coherence' },
    natural: { name: 'Natural Breathing', inhale: 0, exhale: 0, description: 'Follow your natural breath rhythm' }
  };

  // Select breathing pattern based on style and goal
  let breathingPattern = breathingPatterns.natural;
  if (input.style === 'breathing') {
    if (input.goal.toLowerCase().includes('sleep') || input.goal.toLowerCase().includes('anxiety')) {
      breathingPattern = breathingPatterns.triangle;
    } else if (input.goal.toLowerCase().includes('stress') || input.goal.toLowerCase().includes('focus')) {
      breathingPattern = breathingPatterns.box;
    } else {
      breathingPattern = breathingPatterns.resonance;
    }
  }

  // Generate personalized affirmations for the meditation
  const userProfile = {
    experience: input.experience,
    preferredTone: 'gentle' as const,
    goals: [input.goal],
    challenges: []
  };

  const sessionData = {
    mood: input.mood,
    timeOfDay: input.timeOfDay,
    focusArea: input.style,
    duration: input.duration
  };

  const affirmations = await generatePersonalizedAffirmations({
    context: 'meditation',
    userProfile,
    sessionData,
    count: 3
  });

  // Generate personalized script content
  const context = {
    mood: input.mood,
    goal: input.goal,
    timeOfDay: input.timeOfDay,
    experience: input.experience,
    duration: input.duration,
    affirmations
  };

  const phases: MeditationPhase[] = [];
  const totalDuration = input.duration * 60; // Convert to seconds
  
  // Intro phase (10-15% of total time)
  const introTime = Math.max(30, Math.floor(totalDuration * 0.12));
  phases.push({
    id: 'intro',
    name: 'intro',
    duration: introTime,
    script: generateIntroScript(context),
    voiceSettings: { pace: 'slow', tone: 'gentle' }
  });

  // Settle phase (15-20% of total time)
  const settleTime = Math.max(45, Math.floor(totalDuration * 0.18));
  phases.push({
    id: 'settle',
    name: 'settle',
    duration: settleTime,
    script: generateSettleScript(context),
    breathingCue: 'natural',
    voiceSettings: { pace: 'slow', tone: 'gentle' }
  });

  // Main practice phase (50-60% of total time)
  const mainTime = totalDuration - introTime - settleTime - 60; // Leave 60s for closing
  if (mainTime > 0) {
    phases.push({
      id: 'main',
      name: input.style === 'breathing' ? 'breathwork' : 'main',
      duration: mainTime,
      script: generateMainScript(context, input.style),
      breathingCue: input.style === 'breathing' ? breathingPattern.name : 'natural',
      voiceSettings: { pace: 'normal', tone: 'neutral' }
    });
  }

  // Closing phase (10-15% of total time, minimum 60s)
  const closeTime = Math.max(60, Math.floor(totalDuration * 0.12));
  phases.push({
    id: 'close',
    name: 'close',
    duration: closeTime,
    script: generateCloseScript(context),
    voiceSettings: { pace: 'slow', tone: 'gentle' }
  });

  return {
    id: `meditation_${Date.now()}`,
    title: generateTitle(input),
    phases,
    totalDuration,
    breathingPattern: input.style === 'breathing' ? breathingPattern : undefined
  };
}

function generateIntroScript(context: any): string {
  const greetings = {
    morning: "Good morning. Welcome to your morning meditation practice.",
    afternoon: "Hello, and welcome to this moment of peace in your day.",
    evening: "Good evening. It's time to unwind and center yourself.",
    night: "Welcome to this calming practice as you prepare for rest."
  };

  const moodResponses: Record<string, string> = {
    stressed: "I sense you might be feeling some tension today. This practice will help you find calm.",
    anxious: "It's natural to feel unsettled sometimes. Let's create some space for peace.",
    tired: "When we're tired, meditation can be deeply restorative. Allow yourself to be supported.",
    energetic: "Your energy is wonderful. Let's channel it mindfully and find centered focus.",
    sad: "Difficult emotions are part of being human. This practice offers gentle compassion.",
    happy: "Your positive energy is beautiful. Let's enhance this sense of wellbeing.",
    overwhelmed: "When life feels too much, meditation offers a refuge of simplicity.",
    default: "Whatever brought you here today, this time is yours for finding peace."
  };

  const greeting = greetings[context.timeOfDay as keyof typeof greetings] || greetings.afternoon;
  const moodResponse = moodResponses[context.mood] || moodResponses.default;

  // Add personalized affirmation if available
  const beginningAffirmation = context.affirmations?.find((aff: any) => aff.timing === 'beginning');
  const affirmationText = beginningAffirmation ? 
    ` Take a moment to connect with this truth: ${beginningAffirmation.text}.` : '';

  return `${greeting} ${moodResponse} Find a comfortable position, whether sitting or lying down. Close your eyes gently, or soften your gaze downward. Take a moment to arrive fully in this space.${affirmationText}`;
}

function generateSettleScript(context: any): string {
  const experienceAdjustments: Record<string, string> = {
    beginner: "If you're new to meditation, simply focus on your breath. There's no wrong way to do this.",
    intermediate: "Bring your attention to your natural breathing pattern, noticing each inhale and exhale.",
    advanced: "Settle into your established practice, allowing your breath to guide you into deeper awareness."
  };

  const goalOrientedText: Record<string, string> = {
    sleep: "Allow your body to release the day's tensions with each exhale.",
    focus: "Notice how your mind naturally settles when you give it this focused task.",
    stress: "With each breath, imagine releasing what no longer serves you.",
    default: "Simply be present with what is, without trying to change anything."
  };

  const experienceText = experienceAdjustments[context.experience as string] || experienceAdjustments.intermediate;
  const goalKey = Object.keys(goalOrientedText).find(key => 
    context.goal.toLowerCase().includes(key)
  );
  const goalText = goalKey ? goalOrientedText[goalKey] : goalOrientedText.default;

  return `${experienceText} ${goalText} Allow your breathing to find its natural rhythm. Notice the gentle rise and fall of your chest, the subtle pause between breaths.`;
}

function generateMainScript(context: any, style: string): string {
  const styleScripts: Record<string, string> = {
    mindfulness: `Now, rest your attention on your breath. When your mind wanders - and it will - simply notice where it went with kindness, and gently return to your breath. This is the practice: noticing, and returning. Each time you return is a moment of awakening.`,
    
    breathing: `We'll now work with a specific breathing pattern. Follow the rhythm naturally, without forcing. If the pattern feels too challenging, return to your natural breath at any time. Let the breathing become a gentle anchor for your attention.`,
    
    'body-scan': `Beginning at the top of your head, slowly scan downward through your body. Notice any sensations, tension, or areas of ease. Don't try to change anything - simply observe with curiosity and kindness. Move slowly from your head to your neck, shoulders, arms...`,
    
    'loving-kindness': `Bring someone you love easily to mind. Silently offer them these wishes: May you be happy. May you be peaceful. May you be free from suffering. Now extend these same wishes to yourself: May I be happy. May I be peaceful. May I be free from suffering.`,
    
    sleep: `With each exhale, feel yourself sinking deeper into relaxation. Notice how your body naturally wants to rest. Allow your thoughts to become like clouds drifting peacefully across an evening sky. There's nowhere to go, nothing to do except rest.`,
    
    focus: `Choose a single point of focus - perhaps the sensation of breath at your nostrils, or a word like 'peace' or 'calm'. When your mind moves away from this focus, gently guide it back. This training of attention strengthens your capacity for concentration.`
  };

  let mainScript = styleScripts[style] || styleScripts.mindfulness;

  // Add personalized affirmation for middle section if available
  const middleAffirmation = context.affirmations?.find((aff: any) => aff.timing === 'middle');
  if (middleAffirmation) {
    mainScript += ` As you continue, remember: ${middleAffirmation.text}. Let this truth support you in your practice.`;
  }

  return mainScript;
}

function generateCloseScript(context: any): string {
  const timeBasedClosing: Record<string, string> = {
    morning: "As you complete this practice, carry this sense of calm awareness into your day ahead.",
    afternoon: "Take this peace with you as you continue through your day, knowing you can return to this calm whenever needed.",
    evening: "Let this peaceful state prepare you for a restful evening, releasing the day with gratitude.",
    night: "Allow this tranquility to stay with you as you rest, supporting peaceful sleep."
  };

  const closing = timeBasedClosing[context.timeOfDay as string] || timeBasedClosing.afternoon;

  // Add personalized affirmation for ending if available
  const endingAffirmation = context.affirmations?.find((aff: any) => aff.timing === 'end');
  const affirmationText = endingAffirmation ? 
    ` Before you return to your day, hold this intention: ${endingAffirmation.text}.` : '';

  return `Begin to deepen your breath slightly. Wiggle your fingers and toes gently. When you're ready, slowly open your eyes. ${closing}${affirmationText} Take a moment to appreciate this time you've given yourself for inner peace.`;
}

function generateTitle(input: MeditationInput): string {
  const timeAdjective: Record<string, string> = {
    morning: "Morning",
    afternoon: "Midday",
    evening: "Evening", 
    night: "Nighttime"
  };

  const styleNoun: Record<string, string> = {
    mindfulness: "Mindfulness",
    breathing: "Breathing",
    'body-scan': "Body Scan",
    'loving-kindness': "Loving-Kindness",
    sleep: "Sleep",
    focus: "Focus"
  };

  const timePrefix = timeAdjective[input.timeOfDay] || "";
  const styleWord = styleNoun[input.style] || "Meditation";
  
  return `${timePrefix} ${styleWord} (${input.duration} min)`.trim();
}

// New AI functions for personalized content

export async function generatePersonalizedAffirmations(params: {
  context: 'meditation' | 'flow' | 'general';
  userProfile?: {
    goals?: string[];
    challenges?: string[];
    experience?: 'beginner' | 'intermediate' | 'advanced';
    preferredTone?: 'gentle' | 'empowering' | 'calming' | 'energizing';
  };
  sessionData?: {
    mood?: string;
    timeOfDay?: string;
    focusArea?: string;
    duration?: number;
  };
  count?: number;
}): Promise<{
  id: string;
  text: string;
  category: string;
  timing: string;
  personalizedFor: string;
}[]> {
  try {
    const response = await fetch('/api/ai/affirmations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate affirmations');
    }
    
    const data = await response.json();
    return data.affirmations || [];
  } catch (error) {
    console.error('Error generating affirmations:', error);
    return [];
  }
}

export async function adaptFlow(params: {
  currentFlow: {
    poses: any[];
    durations: number[];
    totalDuration: number;
  };
  userProfile: {
    experience: 'beginner' | 'intermediate' | 'advanced';
    physicalLimitations?: string[];
    preferences?: string[];
    pastPerformance?: any;
  };
  sessionFeedback?: {
    difficulty?: string;
    energy?: string;
    timeConstraint?: number;
    specificRequest?: string;
  };
  adaptationType?: string;
}) {
  try {
    const response = await fetch('/api/ai/adapt-flow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error('Failed to adapt flow');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adapting flow:', error);
    return {
      adaptedFlow: params.currentFlow,
      personalizationInsights: {
        adaptationSummary: 'Using original flow',
        whyThisWorks: 'Flow maintained as requested',
        progressNotes: 'Continue with mindful practice'
      }
    };
  }
}
