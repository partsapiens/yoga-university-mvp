import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCycler } from "@/hooks/useCycler";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { toArray, stripHtml } from "@/lib/utils";

// --- Types ---
export type Pose = {
  id: string
  name: string
  durationSec: number
  cues: string[]
  focus?: string[]
  intensity?: 1 | 2 | 3 | 4 | 5
  description?: string;
}
export type Flow = { id: string; title: string; poses: Pose[] }

// --- Demo fallback ---
export const demoFlow: Flow = {
  id: "demo-hpf",
  title: "Gentle HPF Sampler",
  poses: [
    { id: "breath", name: "Seated Breath", durationSec: 30, cues: ["Close your eyes. Inhale through your nose, exhale with a soft sigh."], focus: ["breath", "parasympathetic"], intensity: 1 },
    { id: "child", name: "Child’s Pose", durationSec: 45, cues: ["Sink your hips to heels, lengthen through fingertips."], focus: ["hips", "spine"], intensity: 1 },
    { id: "ddog", name: "Downward Facing Dog", durationSec: 45, cues: ["Spread your fingers; press through palms; soften your knees; long spine."], focus: ["hamstrings", "shoulders"], intensity: 2 },
    { id: "rag", name: "Ragdoll", durationSec: 30, cues: ["Shake your head yes and no; release your jaw; bend knees generously."], focus: ["hamstrings", "erector spinae"], intensity: 1 },
    { id: "mt", name: "Mountain", durationSec: 30, cues: ["Root your feet; lift your chest; soften your ribs; lengthen the back of your neck."], focus: ["postural core"], intensity: 1 },
  ]
}

// --- Helpers & Guards ---
const hasWindow = typeof window !== "undefined";
export function resolveFlow(flow?: Flow): Flow { if (!flow || !Array.isArray(flow.poses) || flow.poses.length === 0) return demoFlow; return flow; }
export function getInitialSeconds(flow?: Flow) { const rf = resolveFlow(flow); return rf.poses[0]?.durationSec ?? 30; }
function timeFmt(s: number) { const m = Math.floor(s / 60), ss = s % 60; return `${m}:${ss.toString().padStart(2, "0")}` }

// --- Intent parsing (very lightweight) ---
export function parseIntent(input: string) { const t = input.toLowerCase(); if (/\b(next|continue|go on|what\'s next)\b/.test(t)) return { type: "NEXT" as const }; if (/\b(prev(ious)?|back|go back)\b/.test(t)) return { type: "PREV" as const }; if (/\b(pa(u)?se|hold up|stop for a sec)\b/.test(t)) return { type: "PAUSE" as const }; if (/\b(resume|play|start)\b/.test(t)) return { type: "RESUME" as const }; if (/\brepeat|again|one more time\b/.test(t)) return { type: "REPEAT" as const }; if (/\bslower|slow down|too fast\b/.test(t)) return { type: "SLOWER" as const }; if (/\bfaster|speed up\b/.test(t)) return { type: "FASTER" as const }; if (/\bhow long|time left|timer\b/.test(t)) return { type: "TIME" as const }; const explain = t.match(/(why|what|how).*?(pose|muscle|alignment|benefit|engage|stretch|compress)/); if (explain) return { type: "EXPLAIN" as const, query: t }; return { type: "CHAT" as const, text: input } }

// --- Main Component ---
export default function CoachCard({ flow }: { flow?: Flow }) {
  const resolved = useMemo(() => resolveFlow(flow), [flow]);
  const poses = resolved.poses;

  const [supportedASR, setSupportedASR] = useState<boolean>(false);
  const [listening, setListening] = useState(false);
  const [asrError, setAsrError] = useState<string | null>(null);
  const [hypothesis, setHypothesis] = useState("");
  const [rate, setRate] = useState(() => {
    if (hasWindow) {
      const stored = parseFloat(localStorage.getItem("coach-rate") || "");
      if (!isNaN(stored)) return stored;
    }
    return 1;
  });
  const [idx, setIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(getInitialSeconds(resolved));
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(() => {
    if (hasWindow) {
      const stored = parseFloat(localStorage.getItem("coach-volume") || "");
      if (!isNaN(stored)) return stored;
    }
    return 1;
  });

  const { voices, voiceName, setVoiceName, speak } = useSpeechSynthesis();

  const recRef = useRef<any>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => { setSupportedASR(hasWindow && ("webkitSpeechRecognition" in (window as any))) }, []);
  useEffect(() => { setSecondsLeft(poses[idx]?.durationSec ?? 30) }, [idx, poses]);
  useEffect(() => { if (paused || !hasWindow) return; const step = () => { setSecondsLeft(s => { if (s <= 1) { nextPose(); return poses[Math.min(idx + 1, poses.length - 1)]?.durationSec ?? 0 } return s - 1 }); tickRef.current = window.setTimeout(step, Math.max(750, 1000 / rate)) }; tickRef.current = window.setTimeout(step, 1000); return () => { if (tickRef.current) window.clearTimeout(tickRef.current) } }, [paused, rate, idx, poses, nextPose]);

  const pose = poses[idx] as Pose | undefined;
  const next = poses[idx + 1] as Pose | undefined;
  const cuesList = toArray(pose?.cues).map(c => stripHtml(c));
  const [isHovered, setIsHovered] = useState(false);
  const cueText = useCycler(cuesList.length ? cuesList : [' '], 3500, !paused && !isHovered);

  const say = useCallback((t: string) => speak(t, volume), [speak, volume]);

  const nextPose = useCallback(() => {
    setIdx(i => {
      const next = Math.min(i + 1, poses.length - 1);
      if (next !== i) say(stripHtml(poses[next].name));
      return next;
    });
  }, [poses, say]);

  const prevPose = useCallback(() => {
    setIdx(i => {
      const prev = Math.max(0, i - 1);
      if (prev !== i) say(stripHtml(poses[prev].name));
      return prev;
    });
  }, [poses, say]);

  const poseProgress = pose ? (1 - secondsLeft / pose.durationSec) * 100 : 0;
  const flowProgress = poses.length ? ((idx + poseProgress / 100) / poses.length) * 100 : 0;

  function handleIntent(raw: string) {
    const intent = parseIntent(raw);
    switch (intent.type) {
      case "NEXT": nextPose(); break;
      case "PREV": prevPose(); break;
      case "PAUSE": setPaused(true); say("Paused."); break;
      case "RESUME": setPaused(false); say("Resuming."); break;
      case "REPEAT": setSecondsLeft(poses[idx]?.durationSec ?? 30); say("Repeating from the beginning of this pose."); break;
      case "SLOWER": setRate(r => Math.max(0.5, r - 0.15)); say("Slowing down the pace."); break;
      case "FASTER": setRate(r => Math.min(2, r + 0.15)); say("Speeding up the pace."); break;
      case "TIME": say(`There are ${timeFmt(secondsLeft)} remaining.`); break;
      case "EXPLAIN":
      case "CHAT":
        say(stripHtml(pose?.description || "I can only respond to simple commands like next, previous, or pause."));
        break;
    }
  }

  function startListening() {
    if (!supportedASR || listening) return;
    setListening(true);
    setAsrError(null);
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recRef.current = new SpeechRecognition();
    recRef.current.continuous = false;
    recRef.current.interimResults = false;
    recRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleIntent(transcript);
    };
    recRef.current.onerror = (event: any) => setAsrError(event.error);
    recRef.current.onend = () => setListening(false);
    recRef.current.start();
  }

  function stopListening() {
    if (recRef.current) recRef.current.stop();
  }

  useEffect(() => {
    if (hasWindow) localStorage.setItem("coach-rate", rate.toString());
  }, [rate]);

  useEffect(() => {
    if (hasWindow) localStorage.setItem("coach-volume", volume.toString());
  }, [volume]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (e.key === " ") { e.preventDefault(); setPaused(p => !p); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prevPose(); }
      if (e.key === "ArrowRight") { e.preventDefault(); nextPose(); }
    };
    if (hasWindow) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [nextPose, prevPose]);

  const lastVol = useRef(volume);
  const toggleMute = () => {
    setVolume(v => {
      if (v === 0) return lastVol.current || 1;
      lastVol.current = v;
      return 0;
    });
  };

  return (
    <div className="p-4 rounded-2xl border bg-card">
      <header className="mb-3" title="Push and speak: “pause”, “next”, “repeat”, “slower”, “how long?”, or ask about alignment.">
        <h2 className="text-xl font-semibold cursor-help">Coach</h2>
      </header>

      {poses.length === 0 ? ( <div className="p-4 rounded-xl bg-amber-50 border text-amber-900">No poses in this flow.</div> ) : (
        <>
          <div className="grid grid-cols-3 gap-3 items-center mb-4">
            <div className="col-span-2">
              <div className="text-lg font-medium">{stripHtml(pose?.name)}</div>
              <div className="text-gray-600 text-sm line-clamp-1 min-h-[1.25rem]" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>{cueText}</div>
              {next && (
                <div className="text-xs text-gray-500 mt-1">Next up: {stripHtml(next.name)} - {next.durationSec}s</div>
              )}
            </div>
            <div className="text-right">
              <div className="font-mono tabular-nums text-2xl leading-none">{timeFmt(secondsLeft)}</div>
              <div className="text-[11px] text-gray-500">rate × {rate.toFixed(2)}</div>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <ProgressBar value={poseProgress} />
            <ProgressBar value={flowProgress} className="h-2" color="secondary" />
          </div>

          <div className="flex items-center justify-end gap-2 mb-3">
            <label htmlFor="voice-select" className="text-sm text-gray-500">Voice</label>
            <select id="voice-select" aria-label="voice selection" value={voiceName} onChange={e => setVoiceName((e.target as HTMLSelectElement).value)} className="text-sm border rounded-md px-2 py-1">
              {voices.length === 0 && <option value="">System default</option>}
              {voices.map(v => (
                <option key={v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2 shrink-0">
              <button aria-label={paused ? "play" : "pause"} onClick={() => setPaused(p => !p)} className="h-8 px-2.5 text-sm rounded-md border shadow-sm">{paused ? "▶️" : "⏸"}</button>
              <button aria-label="previous pose" onClick={prevPose} className="h-8 px-2.5 text-sm rounded-md border shadow-sm">←</button>
              <button aria-label="next pose" onClick={nextPose} className="h-8 px-2.5 text-sm rounded-md border shadow-sm">→</button>
            </div>
            <div className="flex-1 min-w-[100px]"><input aria-label="playback speed" type="range" min={0.75} max={1.25} step={0.05} value={rate} onChange={e => setRate(parseFloat((e.target as HTMLInputElement).value))} className="w-full"/></div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <button aria-label="mute" onClick={toggleMute} className="h-8 px-2.5 text-sm rounded-md border shadow-sm">{volume === 0 ? "🔇" : "🔊"}</button>
            <div className="flex-1 min-w-[100px]"><input aria-label="volume" type="range" min={0} max={1} step={0.05} value={volume} onChange={e => setVolume(parseFloat((e.target as HTMLInputElement).value))} className="w-full"/></div>
          </div>

          <p className="text-xs text-gray-500 mb-3">Shortcuts: Space to play/pause, ←/→ to skip</p>

          <div className="flex items-center gap-2">
            {supportedASR ? (
              <button onMouseDown={startListening} onMouseUp={stopListening} className={`px-4 py-3 text-sm rounded-full border shadow-sm ${listening ? "bg-red-50 border-red-300" : "bg-white"}`}>
                {listening ? "🎙️ Listening…" : "🎤 Hold to talk"}
              </button>
            ) : ( <div className="text-sm opacity-70">Mic not supported.</div> )}
            <input className="flex-1 px-3 py-2 text-sm rounded-xl border" placeholder="Or type here..." onKeyDown={e => { if (e.key === "Enter") { const v = (e.target as HTMLInputElement).value.trim(); if (v) { handleIntent(v); (e.target as HTMLInputElement).value = ""; } } }} />
          </div>

          {asrError && <p className="text-xs text-red-500 mt-2">Speech error: {asrError}</p>}
        </>
      )}
    </div>
  )
}

// --- Lightweight tests ---
export function runVoiceCoachTests() { /* ... as before ... */ }
