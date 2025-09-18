import { NextResponse } from "next/server";
import { oa, isOpenAIAvailable } from "@/lib/openai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    if (!isOpenAIAvailable()) {
      // Use intelligent fallback response based on the user's question
      const userMessage = messages[messages.length - 1]?.content || "";
      let fallbackContent = "I'm here to help with your meditation and mindfulness practice.";
      
      if (userMessage.toLowerCase().includes('anxiety') || userMessage.toLowerCase().includes('stress')) {
        fallbackContent = "For anxiety and stress, try the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, exhale for 8. This activates your body's relaxation response. Practice this 3-4 times when feeling overwhelmed.";
      } else if (userMessage.toLowerCase().includes('sleep') || userMessage.toLowerCase().includes('insomnia')) {
        fallbackContent = "For better sleep, try a body scan meditation before bed. Start at your toes and slowly work your way up, releasing tension from each body part. This helps transition your mind from daily stress to rest.";
      } else if (userMessage.toLowerCase().includes('breathing') || userMessage.toLowerCase().includes('breath')) {
        fallbackContent = "Box breathing is excellent for focus and calm: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat this cycle 5-10 times. It's simple but very effective for centering yourself.";
      } else if (userMessage.toLowerCase().includes('focus') || userMessage.toLowerCase().includes('concentration')) {
        fallbackContent = "For better focus, try a simple mindfulness meditation: Sit comfortably, close your eyes, and focus on your breath. When your mind wanders, gently bring attention back to breathing. Start with 5-10 minutes daily.";
      } else if (userMessage.toLowerCase().includes('meditation') || userMessage.toLowerCase().includes('mindfulness')) {
        fallbackContent = "Meditation is a practice of training your attention and awareness. Start with just 5 minutes daily, focusing on your breath. There's no 'wrong' way to meditate - simply notice when your mind wanders and gently return to your focus point.";
      } else if (userMessage.toLowerCase().includes('beginner') || userMessage.toLowerCase().includes('start')) {
        fallbackContent = "Welcome to meditation! Start with simple breath awareness: Sit comfortably, close your eyes, and focus on your natural breathing. When thoughts arise, acknowledge them without judgment and return to your breath. 5-10 minutes is perfect to begin.";
      }
      
      return NextResponse.json({ content: fallbackContent });
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
    console.error('AI Guide error:', error);
    
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
    
    return NextResponse.json({ content: fallbackContent });
  }
}