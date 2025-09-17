import OpenAI from "openai";
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig() || {};
const apiKey = serverRuntimeConfig?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

// Validate environment variables
if (!apiKey && process.env.USE_MOCK !== "true") {
  console.warn("OPENAI_API_KEY missing - API calls will use fallback responses");
}

// Main OpenAI client - only created when API key is available
export const openai = apiKey
  ? new OpenAI({
      apiKey,
    })
  : null;

// Keep backward compatibility for existing imports
export const oa = openai;

// Check if OpenAI is available
export const isOpenAIAvailable = (): boolean => {
  return !!openai && process.env.USE_MOCK !== "true";
};

// Rate limiting configuration
export const rateLimits = {
  aiSelect: 20, // per hour
  scriptGeneration: 10, // per hour
  insights: 30 // per day
};

// Content filtering pipeline
export const contentFilter = {
  medicalClaims: true,
  therapeuticAdvice: true,
  religiousContent: false, // User opt-in
  appropriatenessCheck: true
};

// Model selection logic
export const selectModel = (complexity: 'simple' | 'medium' | 'complex') => {
  switch(complexity) {
    case 'simple': return 'gpt-4o-mini'; // Style selection
    case 'medium': return 'gpt-4o-mini'; // Script generation
    case 'complex': return 'gpt-4-turbo'; // Deep insights
    default: return 'gpt-4o-mini';
  }
};

// Generate completion with error handling and fallbacks
export async function generateCompletion(
  prompt: string, 
  complexity: 'simple' | 'medium' | 'complex' = 'medium',
  temperature: number = 0.7
): Promise<string> {
  try {
    // Check if OpenAI is available
    if (!isOpenAIAvailable()) {
      console.warn('OpenAI not available, using fallback content');
      return getFallbackContent(complexity);
    }
    
    const model = selectModel(complexity);
    
    const completion = await openai!.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable and compassionate meditation guide. Provide helpful, safe, and appropriate meditation guidance. Avoid medical claims or therapeutic advice. Focus on mindfulness, relaxation, and well-being."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '';
    return filterContent(content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to pre-generated content during API outages
    return getFallbackContent(complexity);
  }
}

// Fallback content for API failures
function getFallbackContent(complexity: string): string {
  const fallbacks = {
    simple: "We recommend a gentle mindfulness meditation to help you find peace and clarity.",
    medium: "Welcome to this moment of stillness. Find a comfortable position and allow your breath to guide you into a state of calm awareness.",
    complex: "Your meditation practice is a gift to yourself. Each session builds your capacity for presence and inner peace."
  };
  
  return fallbacks[complexity as keyof typeof fallbacks] || fallbacks.medium;
}

// Validate and filter AI response content
export function filterContent(content: string): string {
  // Remove any medical claims or therapeutic advice
  let filtered = content.replace(/\b(cure|treat|heal|therapy|medical|diagnosis)\b/gi, '');
  
  // Ensure appropriate language
  filtered = filtered.replace(/\b(prescription|medicine|drug)\b/gi, '');
  
  return filtered.trim();
}

// Health check for OpenAI API (without exposing secrets)
export async function checkOpenAIHealth(): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!isOpenAIAvailable()) {
      return { ok: false, error: "API key not configured" };
    }
    
    // Simple test call to verify API is working
    await openai!.models.list();
    return { ok: true };
  } catch (error) {
    console.error('OpenAI health check failed:', error);
    return { ok: false, error: "API connection failed" };
  }
}