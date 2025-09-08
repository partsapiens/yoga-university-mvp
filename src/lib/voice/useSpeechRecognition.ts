import { useState, useEffect, useRef } from 'react';

const DEBOUNCE_TIME = 600; // ms

export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript.trim());
      }

      // Debounce to treat a pause as the end of an utterance
      debounceTimer.current = setTimeout(() => {
        stop();
      }, DEBOUNCE_TIME);
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const start = () => {
    if (recognitionRef.current && !listening) {
      try {
        setTranscript(null);
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
    transcript,
    start,
    stop,
    error,
  };
}
