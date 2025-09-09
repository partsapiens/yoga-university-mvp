"use client";

import { useCallback } from 'react';

export function useInterruptibleTTS() {
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.log("TTS (unavailable):", text);
      return;
    }

    const synth = window.speechSynthesis;

    // Cancel any ongoing or queued speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Optional: configure voice, rate, pitch etc. here if needed
    // const voices = synth.getVoices();
    // utterance.voice = voices.find(v => v.lang === 'en-US') || voices[0];

    synth.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, cancel };
}
