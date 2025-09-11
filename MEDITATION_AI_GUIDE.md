# Enhanced LLM Integration for YogaUni Meditation

This guide covers the newly implemented enhanced LLM integration features for the YogaUni meditation system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed
- OpenAI API key (optional - system works with fallbacks)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment (optional for enhanced AI features):
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env:
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Navigate to http://localhost:3000/meditation

## ✨ New Features

### 1. Enhanced Natural-Language Meditation Selector

**Location**: `/meditation` → "AI-Guided Meditation"

**Features**:
- **Conversational Interface**: Users describe feelings naturally instead of forms
- **Time-aware Greetings**: Dynamic greetings based on time of day
- **AI Mode Toggle**: Switch between simple and AI-powered modes
- **Voice Input**: Web Speech API for hands-free interaction
- **Smart Adaptation**: UI adapts based on input method

**Example Usage**:
```
User input: "I've had a stressful day at work and need to unwind before bed"
AI output: Recommends breathing meditation, 10 minutes, calming pattern
```

### 2. Intelligent API Routes

#### `/api/ai/ai-select`
Analyzes natural language input and recommends optimal meditation settings.

**Request**:
```json
{
  "userText": "I'm feeling stressed after work",
  "timeOfDay": "evening",
  "preferredDuration": 10,
  "userMood": "stressed"
}
```

**Response**:
```json
{
  "style": "breathing",
  "duration": 10,
  "breathingPattern": {"inhale": 4, "hold": 4, "exhale": 6},
  "rationale": "Calming breath work perfect for evening stress relief",
  "visualTheme": "grounding-green",
  "confidence": 0.85
}
```

#### `/api/ai/ai-script`
Generates personalized meditation scripts with user preferences.

#### `/api/ai/ai-insights`
Provides post-session analysis and journey tracking.

### 3. Smart Fallback System

**Without OpenAI API Key**:
- System uses intelligent rule-based fallbacks
- No functionality loss, reduced personalization
- All UI features remain functional

**Error Handling**:
- Graceful degradation during API failures
- User-friendly error messages
- Automatic fallback to simple mode

## 🎯 User Experience

### Before (Simple Mode)
1. Select mood from predefined options
2. Choose meditation style from dropdown
3. Set duration and experience level
4. Generate meditation

### After (AI Mode)
1. Describe feelings naturally: "Stressed after long day, need to relax"
2. AI automatically selects optimal style, duration, and breathing pattern
3. Personalized experience created instantly

## 🔧 Technical Implementation

### Architecture
```
┌─ Enhanced UI (MoodInput.tsx)
├─ AI API Routes (/api/ai/*)
├─ OpenAI Integration (lib/openai.ts)
├─ Type System (types/ai.ts)
└─ Fallback Logic (built-in)
```

### Key Components
- **MoodInput**: Enhanced with conversational interface and voice input
- **AI APIs**: Three new routes for select, script, and insights
- **OpenAI Client**: Configurable with graceful error handling
- **Type Safety**: Comprehensive TypeScript definitions

### Performance
- Fast response times with caching strategy
- Minimal bundle impact
- Progressive enhancement approach

## 🛡️ Security & Privacy

### Content Filtering
- Medical claims prevention
- Therapeutic advice filtering
- Appropriateness checks
- User safety prioritized

### Privacy Protection
- No personal data stored unnecessarily
- Local preference learning
- Encrypted data transmission
- User-controlled data deletion

### Rate Limiting (Ready)
```typescript
const rateLimits = {
  aiSelect: 20,        // per hour
  scriptGeneration: 10, // per hour
  insights: 30         // per day
};
```

## 🧪 Testing

### Manual Testing
1. Navigate to `/meditation`
2. Click "AI-Guided Meditation"
3. Test both AI and Simple modes
4. Try voice input (Chrome/Edge)
5. Submit different types of input

### API Testing
Test endpoints directly:
```bash
curl -X POST http://localhost:3000/api/ai/ai-select \
  -H "Content-Type: application/json" \
  -d '{"userText": "feeling stressed", "timeOfDay": "evening"}'
```

## 🚀 Next Steps

### Phase 2: Visual Intelligence
- Adaptive breathing orb based on user feedback
- Contextual visual themes
- Biometric integration preparation

### Phase 3: Advanced Personalization
- Voice synthesis integration
- Calendar awareness
- Location-based recommendations
- Advanced analytics dashboard

## 📞 Support

For questions or issues:
- Check browser console for debug information
- Verify OpenAI API key configuration
- Test with fallback mode first
- Review network requests in developer tools

## 🏆 Success Metrics

**Target KPIs**:
- AI-powered session adoption: >80%
- Session completion improvement: +15%
- User satisfaction: >4.2/5 average
- Response time: <2 seconds for AI calls