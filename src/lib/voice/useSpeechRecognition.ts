import { useState, useEffect, useRef } from 'react';

const DEBOUNCE_TIME = 800; // ms

export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Using `any` as the Web Speech API types may not be available in all environments
  const recognitionRef = useRef<any>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setFinalTranscript(final.trim());
      }

      debounceTimer.current = setTimeout(() => {
        stop();
      }, DEBOUNCE_TIME);
    };

    recognition.onerror = (event: any) => { setError(event.error); setListening(false); };
    recognition.onend = () => { setListening(false); };

    return () => { recognition.stop(); };
  }, []);

  const start = () => {
    if (recognitionRef.current && !listening) {
      try {
        setFinalTranscript(null);
        setInterimTranscript('');
        setError(null);
        recognitionRef.current.start();
        setListening(true);
      } catch (err) {
        setError("Speech recognition could not be started.");
        setListening(false);
      }
    }
  };

  const stop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return {
    supported: !!recognitionRef.current,
    listening,
    transcript: finalTranscript, // renamed for clarity
    interimTranscript,
    start,
    stop,
    error,
  };
}
