import OpenAI from "openai";

// Simplified OpenAI client setup
const apiKey = process.env.OPENAI_API_KEY;
const useMock = process.env.USE_MOCK === "true";

// Log configuration status (only in development)
if (process.env.NODE_ENV === 'development') {
  if (!apiKey) {
    console.warn("OPENAI_API_KEY not configured - using mock responses");
  } else if (useMock) {
    console.info("USE_MOCK=true - using mock responses");
  } else {
    console.info("OpenAI API configured and enabled");
  }
}

// Create OpenAI client only when API key is available and not mocked
export const openai = apiKey && !useMock 
  ? new OpenAI({ apiKey })
  : null;

// Keep backward compatibility for existing imports
export const oa = openai;

// Check if OpenAI is available for real API calls
export const isOpenAIAvailable = (): boolean => {
  return !!openai;
};

// Rate limiting configuration (simplified)
export const rateLimits = {
  ai: 30, // requests per hour for all AI endpoints
};

// Content filtering pipeline (simplified)
export const contentFilter = {
  enabled: true,
  removeUnsafeContent: true
};

// Simplified model selection
export const selectModel = (complexity: 'simple' | 'medium' | 'complex') => {
  // Use consistent model for better reliability
  return 'gpt-4o-mini';
};

// Simplified completion generation with better error handling
export async function generateCompletion(
  prompt: string, 
  complexity: 'simple' | 'medium' | 'complex' = 'medium',
  temperature: number = 0.7
): Promise<string> {
  // Return mock response if OpenAI not available
  if (!isOpenAIAvailable()) {
    return getFallbackContent(complexity, prompt);
  }
  
  try {
    const model = selectModel(complexity);
    
    const completion = await openai!.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable and compassionate yoga and meditation guide. Provide helpful, safe, and appropriate guidance. Avoid medical claims or therapeutic advice. Focus on mindfulness, movement, and well-being."
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
    // Return fallback instead of throwing
    return getFallbackContent(complexity, prompt);
  }
}

// Improved fallback content that considers the prompt context
function getFallbackContent(complexity: string, prompt?: string): string {
  // Basic fallback responses
  const fallbacks = {
    simple: "We recommend a gentle practice to help you find peace and clarity.",
    medium: "Welcome to this moment of stillness. Find a comfortable position and allow your breath to guide you into a state of calm awareness.",
    complex: "Your practice is a gift to yourself. Each session builds your capacity for presence and inner peace."
  };
  
  // Try to provide more contextual responses based on prompt keywords
  if (prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('flow') || lowerPrompt.includes('sequence')) {
      return "Consider starting with gentle warm-up poses, moving through your practice mindfully, and ending with restorative poses.";
    }
    
    if (lowerPrompt.includes('meditation') || lowerPrompt.includes('breathing')) {
      return "Find a comfortable seated position, close your eyes gently, and begin to notice your natural breathing rhythm.";
    }
    
    if (lowerPrompt.includes('stress') || lowerPrompt.includes('anxiety')) {
      return "Take slow, deep breaths and remember that this moment of practice is a gift to yourself.";
    }
  }
  
  return fallbacks[complexity as keyof typeof fallbacks] || fallbacks.medium;
}

// Simplified content filtering
export function filterContent(content: string): string {
  if (!content) return '';
  
  // Remove potentially problematic content
  let filtered = content.replace(/\b(cure|treat|heal|therapy|medical|diagnosis|prescription|medicine|drug)\b/gi, '');
  
  // Clean up any resulting double spaces or empty lines
  filtered = filtered.replace(/\s+/g, ' ').trim();
  
  return filtered;
}

// Simplified health check
export async function checkOpenAIHealth(): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!isOpenAIAvailable()) {
      return { ok: false, error: "OpenAI not configured or mocked" };
    }
    
    // Simple test to verify API is working
    await openai!.models.list();
    return { ok: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('OpenAI health check failed:', errorMessage);
    return { ok: false, error: "API connection failed" };
  }
}