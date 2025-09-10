import type { RecommendationInput, Recommendation, FormCheckInput, FormFeedback } from '@/types/ai';
import type { SavedFlow } from '@/types/yoga';

export async function fetchRecommendations(_input: RecommendationInput): Promise<Recommendation[]> {
  return [
    { name: 'Sun Salutation', poses: [], reason: 'Classic warm-up sequence' },
    { name: 'Gentle Warmup', poses: [], reason: 'Ease into practice' },
    { name: 'Power Builder', poses: [], reason: 'Increase strength and stamina' },
  ];
}

export async function checkForm(_input: FormCheckInput): Promise<FormFeedback[]> {
  return [
    { message: 'Keep your spine long.' },
    { message: 'Engage your core.' },
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
