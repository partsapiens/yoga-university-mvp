import { NextResponse } from "next/server";
import { oa, isOpenAIAvailable } from "@/lib/openai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    if (!isOpenAIAvailable()) {
      return NextResponse.json({
        content: "I'm here to help with your meditation and mindfulness practice. While I'm currently running in demo mode, I can still provide general guidance about breathing techniques, meditation styles, and wellness practices. What would you like to know?"
      });
    }

    const systemMessage = {
      role: "system",
      content: `You are a compassionate meditation and mindfulness guide. Provide helpful, safe guidance about:
- Breathing techniques and meditation practices
- Stress relief and relaxation methods
- Mindfulness and awareness exercises
- General wellness advice

Guidelines:
- Keep responses warm, supportive, and practical
- Avoid medical claims or therapeutic advice
- Focus on evidence-based mindfulness practices
- Suggest specific techniques when appropriate
- Keep responses concise but helpful (under 200 words)
- If asked about serious mental health concerns, gently suggest professional support`
    };

    const chatMessages = [systemMessage, ...messages];

    const response = await oa!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = response.choices[0].message.content || "I'm here to help with your meditation practice. What would you like to know?";

    return NextResponse.json({ content });
  } catch (error) {
    // Enhanced error logging for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error instanceof Error && 'code' in error ? error.code : 'UNKNOWN';
    
    console.error('AI Guide error details:', {
      message: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString(),
      requestData: { messagesCount: messages?.length || 0 },
      isOpenAIAvailable: isOpenAIAvailable(),
      nodeEnv: process.env.NODE_ENV
    });
    
    // Fallback response based on the user's question
    const userMessage = messages[messages.length - 1]?.content || "";
    let fallbackContent = "I'm here to help with your meditation and mindfulness practice.";
    
    if (userMessage.toLowerCase().includes('anxiety') || userMessage.toLowerCase().includes('stress')) {
      fallbackContent = "For anxiety and stress, try the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, exhale for 8. This activates your body's relaxation response. Practice this 3-4 times when feeling overwhelmed.";
    } else if (userMessage.toLowerCase().includes('sleep') || userMessage.toLowerCase().includes('insomnia')) {
      fallbackContent = "For better sleep, try a body scan meditation before bed. Start at your toes and slowly work your way up, releasing tension from each body part. This helps transition your mind from daily stress to rest.";
    } else if (userMessage.toLowerCase().includes('breathing') || userMessage.toLowerCase().includes('breath')) {
      fallbackContent = "Box breathing is excellent for focus and calm: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat this cycle 5-10 times. It's simple but very effective for centering yourself.";
    }
    
    // Return specific error information in development, generic in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json({ 
      content: fallbackContent,
      // Include error details in development only
      ...(isDevelopment && {
        _debugInfo: {
          error: errorMessage,
          fallbackMode: true,
          timestamp: new Date().toISOString()
        }
      })
    });
  }
}