import { useEffect, useState } from "react";

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const load = () => {
      const v = synth.getVoices();
      setVoices(v);
      if (!voiceName && v.length) {
        const preferred = [/Samantha/i, /Google UK English Female/i, /Google US English/i, /Microsoft Aria/i, /Microsoft Jenny/i, /English Female/i];
        let pick = v.find((vv) => preferred.some((rx) => rx.test(vv.name)));
        pick = pick || v.find((vv) => /en-/i.test(vv.lang)) || v[0];
        setVoiceName(pick?.name || "");
      }
    };
    load();
    synth.onvoiceschanged = load;
    return () => {
      synth.onvoiceschanged = null;
    };
  }, [voiceName]);

  const speak = (text: string) => {
    try {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.pitch = 0.95;
      u.volume = 0.95;
      const v = voices.find((vv) => vv.name === voiceName) || voices.find((vv) => /en-/i.test(vv.lang));
      if (v) u.voice = v;
      synth.cancel();
      synth.speak(u);
    } catch (e) {
      console.error("Speech synthesis failed", e);
    }
  };

  return { voices, voiceName, setVoiceName, speak };
}

