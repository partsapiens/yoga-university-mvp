import { useEffect, useState } from "react";

const hasWindow = typeof window !== "undefined";

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string>(() =>
    hasWindow ? localStorage.getItem("voiceName") || "" : ""
  );

  useEffect(() => {
    if (!hasWindow || !window.speechSynthesis) return;
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

  useEffect(() => {
    if (hasWindow && voiceName) localStorage.setItem("voiceName", voiceName);
  }, [voiceName]);

  const speak = (
    text: string,
    opts: { volume?: number; rate?: number } = {}
  ) => {
    try {
      if (!hasWindow || !window.speechSynthesis) return;
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = opts.rate ?? 1;
      u.pitch = 0.95;
      u.volume = opts.volume ?? 1;
      const v =
        voices.find((vv) => vv.name === voiceName) ||
        voices.find((vv) => /en-/i.test(vv.lang));
      if (v) u.voice = v;
      synth.cancel();
      synth.speak(u);
    } catch (e) {
      console.error("Speech synthesis failed", e);
    }
  };

  return { voices, voiceName, setVoiceName, speak };
}

