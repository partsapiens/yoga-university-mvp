import { useState, useCallback, useEffect, useRef } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useVoiceCommands } from './useVoiceCommands';
import { PoseId } from '@/types/yoga';
import { POSES } from '@/lib/yoga-data';

export type VoiceGuideState = 'idle' | 'speaking' | 'listening' | 'thinking';

interface UseYogaVoiceGuideProps {
  onNext?: () => void;
  onPrev?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onRepeatInstructions?: () => void;
}

export function useYogaVoiceGuide({
  onNext,
  onPrev,
  onPause,
  onResume,
  onRepeatInstructions
}: UseYogaVoiceGuideProps) {
  const [state, setState] = useState<VoiceGuideState>('idle');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const { speak } = useSpeechSynthesis();
  const conversationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Voice commands for yoga instruction
  const voiceCommands = {
    'next pose': () => {
      speakResponse("Moving to the next pose. Take your time.");
      onNext?.();
    },
    'previous pose': () => {
      speakResponse("Going back to the previous pose.");
      onPrev?.();
    },
    'pause': () => {
      speakResponse("Pausing the session. Take a moment to rest.");
      onPause?.();
    },
    'resume': () => {
      speakResponse("Continuing with your practice.");
      onResume?.();
    },
    'repeat instructions': () => {
      speakResponse("Let me repeat the instructions for you.");
      onRepeatInstructions?.();
    },
    'i need help': () => {
      speakResponse("Remember to breathe deeply and listen to your body. Modify the pose as needed to feel comfortable and safe.");
    },
    'i am ready': () => {
      speakResponse("Great! Let's continue when you're ready.");
    },
    'too fast': () => {
      speakResponse("I understand. Take your time with each pose. There's no rush in yoga practice.");
    },
    'too slow': () => {
      speakResponse("I'll try to keep a better pace. Let me know if you need adjustments.");
    },
    'i am done': () => {
      speakResponse("Wonderful practice today. Take a moment in savasana to rest and integrate.");
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

  // Guide through a pose with natural instructions
  const guideThroughPose = useCallback((poseId: PoseId, duration: number) => {
    const pose = POSES.find(p => p.id === poseId);
    if (!pose) return;

    const instructions = [
      `Now we'll move into ${pose.name}, or ${pose.sanskrit}.`,
      `Find your ${pose.name} position and settle in.`,
      `Remember to breathe deeply and honor your body's limits.`,
      `You'll hold this pose for ${Math.round(duration)} seconds.`
    ].join(' ');

    speakResponse(instructions);
  }, [speakResponse]);

  // Provide encouragement during holds
  const provideEncouragement = useCallback(() => {
    const encouragements = [
      "You're doing great. Keep breathing steadily.",
      "Feel the strength building in your body.",
      "Stay present with your breath.",
      "Notice how your body feels in this moment.",
      "You're exactly where you need to be.",
      "Breathe into any areas of tension.",
      "Your practice is perfect just as it is."
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
        speakResponse("I'm here whenever you need me. Just say 'I need help' if you have questions.");
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
        speakResponse("Voice guide activated! I'm here to help you through your yoga practice. You can say things like 'next pose', 'repeat instructions', or 'I need help'.");
      } else {
        stopListening();
        speak("Voice guide deactivated.");
      }
      return newState;
    });
  }, [speakResponse, stopListening, speak]);

  // Offer conversation when voice is enabled
  const offerConversation = useCallback(() => {
    if (isVoiceEnabled && state === 'idle') {
      speakResponse("How are you feeling? You can tell me if you need any adjustments or help.");
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
    guideThroughPose,
    provideEncouragement,
    speakResponse,
    startListening,
    stopListening,
    toggleVoiceGuide,
    offerConversation
  };
}