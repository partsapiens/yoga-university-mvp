import { useState, useCallback, useEffect, useRef } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useVoiceCommands } from './useVoiceCommands';

export type MeditationVoiceGuideState = 'idle' | 'speaking' | 'listening' | 'thinking';

interface UseMeditationVoiceGuideProps {
  onStartMeditation?: () => void;
  onPauseMeditation?: () => void;
  onResumeMeditation?: () => void;
  onStopMeditation?: () => void;
  onSetTimer?: (minutes: number) => void;
  onAddTime?: (minutes: number) => void;
  onGetTimeRemaining?: () => string;
  onResetTimer?: () => void;
  onRepeatInstruction?: () => void;
  onNextSection?: () => void;
  isPlaying?: boolean;
  timeRemaining?: number;
}

export function useMeditationVoiceGuide({
  onStartMeditation,
  onPauseMeditation,
  onResumeMeditation,
  onStopMeditation,
  onSetTimer,
  onAddTime,
  onGetTimeRemaining,
  onResetTimer,
  onRepeatInstruction,
  onNextSection,
  isPlaying = false,
  timeRemaining = 0
}: UseMeditationVoiceGuideProps) {
  const [state, setState] = useState<MeditationVoiceGuideState>('idle');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const { speak } = useSpeechSynthesis();
  const conversationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Voice commands for meditation control
  const voiceCommands = {
    'start meditation': () => {
      speakResponse("Starting your meditation session. Find a comfortable position and let's begin.");
      onStartMeditation?.();
    },
    'begin meditation': () => {
      speakResponse("Beginning your meditation practice. Take a deep breath and settle in.");
      onStartMeditation?.();
    },
    'pause meditation': () => {
      speakResponse("Pausing your meditation. Take your time.");
      onPauseMeditation?.();
    },
    'pause': () => {
      speakResponse("Meditation paused. You can resume whenever you're ready.");
      onPauseMeditation?.();
    },
    'resume meditation': () => {
      speakResponse("Resuming your meditation practice.");
      onResumeMeditation?.();
    },
    'continue': () => {
      speakResponse("Continuing with your meditation.");
      onResumeMeditation?.();
    },
    'resume': () => {
      speakResponse("Resuming your practice.");
      onResumeMeditation?.();
    },
    'stop meditation': () => {
      speakResponse("Ending your meditation session. Thank you for taking this time for yourself.");
      onStopMeditation?.();
    },
    'end session': () => {
      speakResponse("Completing your meditation. Well done on your practice today.");
      onStopMeditation?.();
    },
    'set timer to five minutes': () => {
      speakResponse("Setting timer to 5 minutes.");
      onSetTimer?.(5);
    },
    'set timer to ten minutes': () => {
      speakResponse("Setting timer to 10 minutes.");
      onSetTimer?.(10);
    },
    'set timer to fifteen minutes': () => {
      speakResponse("Setting timer to 15 minutes.");
      onSetTimer?.(15);
    },
    'set timer to twenty minutes': () => {
      speakResponse("Setting timer to 20 minutes.");
      onSetTimer?.(20);
    },
    'add five minutes': () => {
      speakResponse("Adding 5 minutes to your timer.");
      onAddTime?.(5);
    },
    'add ten minutes': () => {
      speakResponse("Adding 10 minutes to your timer.");
      onAddTime?.(10);
    },
    'how much time left': () => {
      const timeLeft = onGetTimeRemaining?.() || "No timer set";
      speakResponse(`You have ${timeLeft} remaining in your meditation.`);
    },
    'time remaining': () => {
      const timeLeft = onGetTimeRemaining?.() || "No timer set";
      speakResponse(`Time remaining: ${timeLeft}.`);
    },
    'reset timer': () => {
      speakResponse("Resetting your meditation timer.");
      onResetTimer?.();
    },
    'repeat instruction': () => {
      speakResponse("Let me repeat the current instruction for you.");
      onRepeatInstruction?.();
    },
    'next section': () => {
      speakResponse("Moving to the next section of your meditation.");
      onNextSection?.();
    },
    'i need help': () => {
      speakResponse("Remember to breathe naturally and gently return your attention when your mind wanders. There's no perfect way to meditate - just be present with whatever arises.");
    },
    'i am ready': () => {
      speakResponse("Wonderful. Let's continue with your meditation practice.");
    },
    'too fast': () => {
      speakResponse("I understand. Let's slow down and take our time. Meditation is not a race.");
    },
    'too slow': () => {
      speakResponse("I'll pick up the pace slightly. Feel free to guide me as needed.");
    }
  };

  const { isListening, toggle: toggleVoiceRecognition, supportsSpeechInput } = useVoiceCommands(voiceCommands);

  // Enhanced speaking function with state management
  const speakResponse = useCallback((text: string) => {
    setState('speaking');
    speak(text);
    
    // Reset to idle after speaking (estimated based on text length)
    const estimatedDuration = Math.max(2000, text.length * 80); // ~80ms per character
    setTimeout(() => {
      setState('idle');
    }, estimatedDuration);
  }, [speak]);

  // Provide meditation guidance
  const provideMeditationGuidance = useCallback((instruction: string) => {
    speakResponse(instruction);
  }, [speakResponse]);

  // Provide encouragement during meditation
  const provideEncouragement = useCallback(() => {
    const encouragements = [
      "You're doing wonderfully. Simply notice your breath.",
      "Allow yourself to settle deeper into this moment.",
      "There's nowhere else you need to be right now.",
      "Notice any thoughts and gently let them pass.",
      "Your breathing is your anchor. Return to it whenever you need to.",
      "You're exactly where you need to be in this practice.",
      "Let go of any expectations and simply be present."
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    speakResponse(randomEncouragement);
  }, [speakResponse]);

  // Start listening for user input
  const startListening = useCallback(() => {
    if (!supportsSpeechInput) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }
    
    setState('listening');
    toggleVoiceRecognition();
    
    // Auto-stop listening after 5 seconds if no input
    conversationTimeoutRef.current = setTimeout(() => {
      if (isListening) {
        toggleVoiceRecognition();
        setState('idle');
        speakResponse("I'm here to guide you. You can say things like 'pause meditation' or 'how much time left' if you need help.");
      }
    }, 5000);
  }, [supportsSpeechInput, toggleVoiceRecognition, isListening, speakResponse]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (isListening) {
      toggleVoiceRecognition();
    }
    setState('idle');
    
    if (conversationTimeoutRef.current) {
      clearTimeout(conversationTimeoutRef.current);
      conversationTimeoutRef.current = null;
    }
  }, [isListening, toggleVoiceRecognition]);

  // Toggle voice interaction
  const toggleVoiceGuide = useCallback(() => {
    setIsVoiceEnabled(prev => {
      const newState = !prev;
      if (newState) {
        speakResponse("Voice guide activated for meditation! You can say things like 'start meditation', 'pause', 'set timer to ten minutes', or 'how much time left'.");
      } else {
        stopListening();
        speak("Meditation voice guide deactivated.");
      }
      return newState;
    });
  }, [speakResponse, stopListening, speak]);

  // Offer meditation guidance
  const offerGuidance = useCallback(() => {
    if (isVoiceEnabled && state === 'idle') {
      speakResponse("How is your meditation going? You can ask me to adjust the timer, repeat instructions, or provide guidance.");
      setTimeout(() => {
        if (state === 'idle') startListening();
      }, 2000);
    }
  }, [isVoiceEnabled, state, speakResponse, startListening]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (conversationTimeoutRef.current) {
        clearTimeout(conversationTimeoutRef.current);
      }
    };
  }, []);

  // Update state based on voice recognition status
  useEffect(() => {
    if (isListening) {
      setState('listening');
    } else if (state === 'listening') {
      setState('idle');
    }
  }, [isListening, state]);

  return {
    state,
    isVoiceEnabled,
    isListening,
    supportsSpeechInput,
    provideMeditationGuidance,
    provideEncouragement,
    speakResponse,
    startListening,
    stopListening,
    toggleVoiceGuide,
    offerGuidance
  };
}