import type { RecommendationInput, Recommendation, FormCheckInput, FormFeedback } from '@/types/ai';
import type { SavedFlow } from '@/types/yoga';
import { PoseId } from '@/types/yoga';

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
