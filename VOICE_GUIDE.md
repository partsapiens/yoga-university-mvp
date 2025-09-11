# Voice Communication Guide

The Yoga Flow University platform includes an intelligent voice communication system that provides an interactive yoga instructor avatar to guide users through their practice.

## Features

### 🎯 Interactive Avatar
- **Animated states**: The avatar changes appearance based on its current activity
  - **Idle**: 🧘‍♀️ Calm and ready state
  - **Speaking**: Pulsing animation with blue rings when providing guidance
  - **Listening**: Green avatar with sound wave animations when waiting for user input
  - **Thinking**: Yellow avatar with animated dots when processing responses

### 🗣️ Voice Synthesis (Text-to-Speech)
- **Pose Guidance**: Provides detailed instructions for each yoga pose
- **Natural Language**: Uses conversational tone with proper Sanskrit pronunciation
- **Encouragement**: Offers motivational phrases during longer holds
- **Safety Reminders**: Emphasizes breathing and body awareness

### 👂 Voice Recognition (Speech-to-Text)
Users can interact with the avatar using natural voice commands:

#### Basic Flow Control
- `"next pose"` - Move to the next pose in the sequence
- `"previous pose"` - Go back to the previous pose
- `"pause"` - Pause the current session
- `"resume"` - Continue the paused session
- `"repeat instructions"` - Hear the current pose instructions again

#### Help & Guidance
- `"I need help"` - Receive general assistance and safety reminders
- `"I am ready"` - Indicate readiness to continue
- `"too fast"` - Request slower pacing
- `"too slow"` - Request faster pacing
- `"I am done"` - End the session gracefully

## How to Use

### 1. Starting Voice Communication
1. Begin playing a yoga flow sequence
2. Click the **🔇 Voice Off** button in the player to enable voice guide
3. The button will change to **🎙️ Voice On** indicating voice is active
4. The **💬 Talk** button will appear for initiating conversations

### 2. Listening to Guidance
- The avatar automatically provides instructions when starting each new pose
- During longer poses (>30 seconds), encouraging reminders are given every 20 seconds
- The avatar periodically offers to listen to user feedback

### 3. Speaking to the Avatar
1. Click the **💬 Talk** button to start voice recognition
2. The avatar will show a listening state (green with sound waves)
3. Speak your command or question clearly
4. The avatar will respond appropriately and return to idle state

## Technical Implementation

### Components
- **Avatar**: `/src/components/Avatar.tsx` - Visual avatar with animated states
- **useYogaVoiceGuide**: `/src/hooks/useYogaVoiceGuide.ts` - Voice interaction logic
- **Enhanced Player**: `/src/components/flows/Player.tsx` - Integrated player with avatar

### Browser Compatibility
- **Speech Synthesis**: Supported in most modern browsers
- **Speech Recognition**: Uses Web Speech API (Chrome, Edge, Safari)
- **Fallback**: Graceful degradation when voice features are not supported

### Voice Commands Processing
```typescript
// Example voice command mapping
const voiceCommands = {
  'next pose': () => moveToNextPose(),
  'I need help': () => provideHelpAndSafety(),
  'repeat instructions': () => repeatCurrentPoseInstructions()
};
```

## Privacy & Security

- **No Data Storage**: Voice interactions are processed locally in the browser
- **No Recording**: Audio is not recorded or transmitted to servers
- **User Control**: Voice features can be disabled at any time
- **Opt-in**: Voice communication must be manually enabled by the user

## Troubleshooting

### Voice Not Working
1. **Check Browser Support**: Ensure you're using a supported browser
2. **Microphone Permissions**: Grant microphone access when prompted
3. **Audio Output**: Verify speakers/headphones are connected and volume is up
4. **Network**: Voice synthesis works offline, but initial setup may require internet

### Avatar Not Responding
1. **Click Voice On**: Ensure voice guide is enabled (green button)
2. **Clear Speech**: Speak commands clearly and wait for processing
3. **Supported Commands**: Use the documented voice commands listed above
4. **Browser Console**: Check for any JavaScript errors

### Audio Issues
1. **Multiple Tabs**: Close other tabs that might be using audio
2. **System Volume**: Check system and browser volume settings
3. **Audio Conflicts**: Pause other media before starting yoga session

## Future Enhancements

- **Personalized Voice**: Custom voice selection and speed adjustment
- **Advanced AI**: More sophisticated conversation and pose corrections
- **Accessibility**: Enhanced support for users with disabilities
- **Multi-language**: Support for non-English voice interactions
- **Pose Correction**: Real-time feedback based on user descriptions

---

*The voice communication system enhances the yoga practice experience by providing personalized, interactive guidance that adapts to each user's needs and pace.*