import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * YogaFlow Voice Coach (MVP) — Robust
 * Fixes:
 *  - Handles undefined/empty `flow` prop safely (falls back to demoFlow)
 *  - Guards all `window`/speech APIs for SSR
 *  - Defensive timers & index bounds
 *  - Adds lightweight self-tests (runVoiceCoachTests())
 *
 * Usage:
 *   <VoiceCoach flow={yourFlow || undefined} />
 *
 * To run tests in the browser console:
 *   import { runVoiceCoachTests } from "./VoiceCoach";
 *   runVoiceCoachTests();
 */

// --- Types ---
export type Pose = {
  id: string
  name: string
  durationSec: number
  cues: string[]
  focus?: string[] // e.g., ["hips", "hamstrings"]
  intensity?: 1 | 2 | 3 | 4 | 5
}

export type Flow = {
  id: string
  title: string
  poses: Pose[]
}

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
const canSpeak = hasWindow && "speechSynthesis" in window;

export function resolveFlow(flow?: Flow): Flow {
  if (!flow || !Array.isArray(flow.poses) || flow.poses.length === 0) return demoFlow;
  return flow;
}

export function getInitialSeconds(flow?: Flow) {
  const rf = resolveFlow(flow);
  return rf.poses[0]?.durationSec ?? 30;
}

export function speak(text: string) {
  if (!canSpeak) return; // SSR or unsupported
  try {
    window.speechSynthesis.cancel(); // interruptible
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices?.() || [];
    const preferred = voices.find(v => /female|samantha|google uk english female|zira|jenny/i.test(v.name));
    if (preferred) utter.voice = preferred;
    utter.rate = 1.0;
    utter.pitch = 1.02;
    window.speechSynthesis.speak(utter);
  } catch {}
}

function timeFmt(s: number) {
  const m = Math.floor(s / 60), ss = s % 60
  return `${m}:${ss.toString().padStart(2, "0")}`
}

// --- Intent parsing (very lightweight) ---
export function parseIntent(input: string) {
  const t = input.toLowerCase();
  if (/\b(next|continue|go on|what\'s next)\b/.test(t)) return { type: "NEXT" as const }
  if (/\b(prev(ious)?|back|go back)\b/.test(t)) return { type: "PREV" as const }
  if (/\b(pa(u)?se|hold up|stop for a sec)\b/.test(t)) return { type: "PAUSE" as const }
  if (/\b(resume|play|start)\b/.test(t)) return { type: "RESUME" as const }
  if (/\brepeat|again|one more time\b/.test(t)) return { type: "REPEAT" as const }
  if (/\bslower|slow down|too fast\b/.test(t)) return { type: "SLOWER" as const }
  if (/\bfaster|speed up\b/.test(t)) return { type: "FASTER" as const }
  if (/\bhow long|time left|timer\b/.test(t)) return { type: "TIME" as const }
  const explain = t.match(/(why|what|how).*?(pose|muscle|alignment|benefit|engage|stretch|compress)/);
  if (explain) return { type: "EXPLAIN" as const, query: t }
  return { type: "CHAT" as const, text: input }
}

// --- Main Component ---
export default function VoiceCoach({ flow }: { flow?: Flow }) {
  const resolved = useMemo(() => resolveFlow(flow), [flow]);
  const poses = resolved.poses;

  const [supportedASR, setSupportedASR] = useState<boolean>(false)
  const [listening, setListening] = useState(false)
  const [asrError, setAsrError] = useState<string | null>(null)
  const [hypothesis, setHypothesis] = useState("")

  const [rate, setRate] = useState(1) // playback speed 0.75–1.25
  const [idx, setIdx] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState<number>(getInitialSeconds(resolved))
  const [paused, setPaused] = useState(true)

  const recRef = useRef<any>(null)
  const tickRef = useRef<number | null>(null)

  useEffect(() => {
    const ok = hasWindow && ("webkitSpeechRecognition" in (window as any))
    setSupportedASR(ok)
  }, [])

  useEffect(() => {
    // Ensure secondsLeft resets when idx changes (e.g., when external flow swaps)
    setSecondsLeft(poses[idx]?.durationSec ?? 30)
  }, [idx, poses])

  useEffect(() => {
    // Timer loop (client only)
    if (paused || !hasWindow) return;
    const step = () => {
      setSecondsLeft(s => {
        if (s <= 1) {
          // auto next
          nextPose();
          return poses[Math.min(idx + 1, poses.length - 1)]?.durationSec ?? 0
        }
        return s - 1
      })
      tickRef.current = window.setTimeout(step, Math.max(750, 1000 / rate))
    }
    tickRef.current = window.setTimeout(step, 1000)
    return () => {
      if (tickRef.current) window.clearTimeout(tickRef.current)
    }
  }, [paused, rate, idx, poses])

  const pose = poses[idx] as Pose | undefined;

  function nextPose() {
    if (!poses.length) return;
    const n = Math.min(idx + 1, poses.length - 1)
    if (n !== idx) {
      setIdx(n)
      const p = poses[n]
      setSecondsLeft(p?.durationSec ?? 30)
      if (p) speak(`Next: ${p.name}. ${p.cues?.[0] ?? "Find your breath."}`)
    } else {
      setPaused(true)
      speak("You’ve reached the end of your flow. Take a breath and notice how you feel.")
    }
  }

  function prevPose() {
    if (!poses.length) return;
    const pIndex = Math.max(idx - 1, 0)
    setIdx(pIndex)
    const prev = poses[pIndex]
    setSecondsLeft(prev?.durationSec ?? 30)
    if (prev) speak(`Back to ${prev.name}. ${prev.cues?.[0] ?? "Return to a steady breath."}`)
  }

  function handleIntent(raw: string) {
    const intent = parseIntent(raw)
    switch (intent.type) {
      case "NEXT":
        nextPose(); break
      case "PREV":
        prevPose(); break
      case "PAUSE":
        setPaused(true); if (canSpeak) window.speechSynthesis.cancel(); speak("Paused. Say resume when you’re ready."); break
      case "RESUME":
        setPaused(false); speak(`Resuming ${pose?.name ?? "your practice"}. ${pose?.cues?.[0] ?? "Stay with your breath."}`); break
      case "REPEAT":
        speak(`${pose?.name ?? "This segment"}. ${pose?.cues?.join(" ") || "Inhale length, exhale soften."}`); break
      case "SLOWER":
        setRate(r => Math.max(0.75, r - 0.1)); speak("Okay, slowing down."); break
      case "FASTER":
        setRate(r => Math.min(1.25, r + 0.1)); speak("Okay, a touch quicker."); break
      case "TIME":
        speak(`${timeFmt(secondsLeft)} remaining in ${pose?.name ?? "this segment"}.`); break
      case "EXPLAIN": {
        const focus = pose?.focus?.join(", ") || "breath and alignment"
        const msg = `${pose?.name ?? "This pose"} focuses on ${focus}. Keep joints stacked, engage your core, and spread weight evenly. `+
          `Benefits include mobility and steadier balance. If something pinches, back out and breathe.`
        speak(msg)
        break
      }
      case "CHAT":
        speak(`I hear you. ${intent.text}`)
    }
  }

  // --- ASR setup ---
  function startListening() {
    if (!supportedASR || !hasWindow) return
    const Rec = (window as any).webkitSpeechRecognition
    if (!Rec) return
    const rec = new Rec()
    recRef.current = rec
    rec.continuous = false
    rec.lang = "en-US" // TODO: detect
    rec.interimResults = true

    rec.onresult = (e: any) => {
      let interim = "", final = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) final += r[0].transcript
        else interim += r[0].transcript
      }
      setHypothesis(interim || final)
      if (final) handleIntent(final)
    }
    rec.onerror = (e: any) => {
      setAsrError(e.error || "speech error")
      setListening(false)
    }
    rec.onend = () => setListening(false)

    setHypothesis("")
    setAsrError(null)
    setListening(true)
    try { rec.start() } catch {}
  }

  function stopListening() {
    setListening(false)
    try { recRef.current?.stop?.() } catch {}
  }

  // --- UI ---
  return (
    <div className="p-4 rounded-2xl border bg-card">
      <header className="mb-3">
        <h2 className="text-xl font-semibold">🎧 Voice Coach — {resolved.title}</h2>
        <p className="text-sm opacity-70">Push and speak: “pause”, “next”, “repeat”, “slower”, “how long?”, or ask about alignment.</p>
      </header>

      {poses.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          No poses in this flow yet. Add poses, or omit the <code>flow</code> prop to preview the demo.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 items-center mb-4">
            <div className="col-span-2">
              <div className="text-lg font-medium">{pose?.name}</div>
              <div className="text-sm opacity-70">{pose?.cues?.[0] || "Find a steady breath."}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums">{timeFmt(secondsLeft)}</div>
              <div className="text-xs opacity-60">rate × {rate.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <button onClick={() => { setPaused(p => !p); if (!paused && canSpeak) { window.speechSynthesis.cancel() } else { speak(`Resuming ${pose?.name ?? "your practice"}.`) } }}
                    className="px-4 py-2 rounded-xl border shadow-sm hover:shadow">{paused ? "▶️ Resume" : "⏸ Pause"}</button>
            <button onClick={prevPose} className="px-4 py-2 rounded-xl border shadow-sm hover:shadow">⟵ Prev</button>
            <button onClick={nextPose} className="px-4 py-2 rounded-xl border shadow-sm hover:shadow">Next ⟶</button>
            <input type="range" min={0.75} max={1.25} step={0.05} value={rate} onChange={e => setRate(parseFloat((e.target as HTMLInputElement).value))}
                   className="flex-1"/>
          </div>

          <div className="mb-3 p-3 rounded-xl bg-gray-50 border">
            <div className="text-xs uppercase tracking-wide opacity-60 mb-1">Coach says</div>
            <div className="text-sm leading-relaxed min-h-[2lh]" id="coach-log">Use the mic and talk to me. Try: “slow down” or “repeat that”.</div>
          </div>

          <div className="flex items-center gap-2">
            {supportedASR ? (
              <button onMouseDown={startListening} onTouchStart={startListening}
                      onMouseUp={stopListening} onTouchEnd={stopListening}
                      className={`px-4 py-3 rounded-full border shadow-sm hover:shadow ${listening ? "bg-red-50 border-red-300" : "bg-white"}`}>
                {listening ? "🎙️ Listening… release to send" : "🎤 Hold to talk"}
              </button>
            ) : (
              <div className="text-sm opacity-70">Mic not supported. Use chat:</div>
            )}
            <input
              className="flex-1 px-3 py-2 rounded-xl border"
              placeholder="Type here if you prefer…"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (!v) return
                  ;(e.target as HTMLInputElement).value = ""
                  handleIntent(v)
                }
              }}
            />
          </div>

          {asrError && <p className="text-xs text-red-500 mt-2">Speech error: {asrError}</p>}
        </>
      )}
    </div>
  )
}

// --- Lightweight tests ---
export function runVoiceCoachTests() {
  const results: { name: string; pass: boolean; details?: string }[] = [];
  const assert = (name: string, pass: boolean, details?: string) => results.push({ name, pass, details });

  // 1) Fallback behavior
  const f1 = resolveFlow(undefined);
  assert("fallback: undefined flow uses demoFlow", f1.id === "demo-hpf" && f1.poses.length > 0);

  const f2 = resolveFlow({ id: "x", title: "x", poses: [] });
  assert("fallback: empty poses uses demoFlow", f2.id === "demo-hpf");

  // 2) Initial seconds
  const f3: Flow = { id: "f3", title: "T", poses: [{ id: "p", name: "Pose", durationSec: 42, cues: [] }] };
  assert("initial seconds from first pose duration", getInitialSeconds(f3) === 42, String(getInitialSeconds(f3)));

  // 3) Intent parsing
  assert("intent NEXT", parseIntent("what's next").type === "NEXT");
  assert("intent PREV", parseIntent("go back").type === "PREV");
  assert("intent PAUSE", parseIntent("pause please").type === "PAUSE");
  assert("intent RESUME", parseIntent("resume").type === "RESUME");
  assert("intent REPEAT", parseIntent("repeat that").type === "REPEAT");
  assert("intent SLOWER", parseIntent("too fast, slow down").type === "SLOWER");
  assert("intent FASTER", parseIntent("speed up").type === "FASTER");
  assert("intent TIME", parseIntent("how long left?").type === "TIME");
  assert("intent EXPLAIN", parseIntent("why does this pose engage hamstrings?").type === "EXPLAIN");
  assert("intent CHAT fallback", parseIntent("i feel tight today").type === "CHAT");

  return results;
}
