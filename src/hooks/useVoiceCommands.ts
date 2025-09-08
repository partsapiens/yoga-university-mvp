import { useEffect, useRef, useState } from "react";

export function useVoiceCommands(commands: Record<string, () => void>) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const supportsSpeechInput = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  useEffect(() => {
    if (!supportsSpeechInput) return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const r = e.results[e.results.length - 1];
      if (!r || !r[0]) return;
      const said = String(r[0].transcript || "").toLowerCase().trim();
      const fn = commands[said];
      if (fn) fn();
    };
    rec.onend = () => {
      if (isListening) {
        try { rec.start(); } catch {}
      }
    };
    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
    };
  }, [commands, supportsSpeechInput, isListening]);

  const toggle = () => {
    if (!supportsSpeechInput || !recognitionRef.current) return;
    if (!isListening) {
      try { recognitionRef.current.start(); setIsListening(true); } catch {}
    } else {
      try { recognitionRef.current.stop(); setIsListening(false); } catch {}
    }
  };

  return { isListening, toggle, supportsSpeechInput };
}

