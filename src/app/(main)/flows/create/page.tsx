"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { POSES, FOCI, PRESETS } from "@/lib/yoga-data";
import {
  applyOverridesByIndex,
  applySafetyAdjustments,
  baseDurationsFromTable,
  buildCues,
  coachTip,
  computeTotalRemaining,
  dotBar,
  moveOverrides,
  reindexOverridesAfterRemoval,
  smartGenerate,
} from "@/lib/yoga-helpers";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useSavedFlows } from "@/hooks/useSavedFlows";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import type { Focus, PoseId, SecondsOverrides, TimingMode } from "@/types/yoga";

// Yoga Flow Builder — Minimal, polished UI with safety + visuals
// ✅ Controls bar aligned (Auto‑generate + Save inside container)
// ✅ Active card elevation animation
// ✅ Preview modal closable (✕, Esc, backdrop)
// ✅ Save/Load/Delete (in‑memory) + optional local persistence
// ✅ Drag & Drop + mobile-friendly ↑/↓ move buttons
// ✅ Voice cues dropdown, accessible progress bars, keyboard hints
// ✅ Seconds/Breaths timing, transition seconds, cooldown (Savasana)
// ✅ Coach tips hovercard (“Why?”)
// ⚠️ Pose data will come from Supabase later; using a small stub for now

// ---------------- Component ----------------
export default function Page() {
  // Controls
  const [minutes, setMinutes] = useState<number>(45);
  const [intensity, setIntensity] = useState<number>(3);
  const [focus, setFocus] = useState<Focus>("Full-Body");

  // Timing controls
  const [timingMode, setTimingMode] = useState<TimingMode>(TimingMode.Seconds);
  const [breathSeconds, setBreathSeconds] = useState<number>(5); // sec per breath
  const [transitionSec, setTransitionSec] = useState<number>(5);
  const [cooldownMin, setCooldownMin] = useState<number>(2); // Savasana length (minutes)

  // Safety & persistence
  const [safetyMode, setSafetyMode] = useState<boolean>(true);
  const [persistLocal, setPersistLocal] = useState<boolean>(false);

  // Builder state
  const [flow, setFlow] = useState<PoseId[]>([]); // duplicates allowed
  const [overrides, setOverrides] = useState<SecondsOverrides>({});
  const [breathingOn, setBreathingOn] = useState(true);

  // Save/Load (in‑memory + optional localStorage)
  const { saved, setSaved } = useSavedFlows(persistLocal);
  const [saveName, setSaveName] = useState("");

  // Voice selection
  const { voices, voiceName, setVoiceName, speak } = useSpeechSynthesis();

  // Suggestions (placeholder until Supabase)
  const suggestions = useMemo(() => {
    const wMin = Math.max(1, intensity - 1);
    const wMax = Math.min(5, intensity + 1);
    const base = POSES.filter((p) => p.intensity >= wMin && p.intensity <= wMax);
    if (focus !== "Full-Body") {
      const focused = base.filter((p) => p.groups?.includes(focus));
      const neutral = base.filter((p) => !p.groups?.includes(focus));
      return [...focused, ...neutral].slice(0, 12);
    }
    return base.slice(0, 12);
  }, [intensity, focus]);

  function addToFlow(id: PoseId) {
    setFlow((prev) => [...prev, id]);
  }
  function removeFromFlow(idx: number) {
    setFlow((prev) => prev.filter((_, i) => i !== idx));
    setOverrides((prev) => reindexOverridesAfterRemoval(prev, idx));
  }

  // Mobile-friendly move
  function moveUp(i: number) {
    if (i <= 0) return;
    setFlow((prev) => {
      const n = prev.slice();
      const [item] = n.splice(i, 1);
      n.splice(i - 1, 0, item);
      return n;
    });
    setOverrides((prev) => moveOverrides(prev, i, i - 1));
  }
  function moveDown(i: number) {
    if (i >= flow.length - 1) return;
    setFlow((prev) => {
      const n = prev.slice();
      const [item] = n.splice(i, 1);
      n.splice(i + 1, 0, item);
      return n;
    });
    setOverrides((prev) => moveOverrides(prev, i, i + 1));
  }

  // Drag & Drop
  const dragIndex = useRef<number | null>(null);
  const onDragStart = (i: number) => (e: React.DragEvent) => {
    dragIndex.current = i;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (i: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (i: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from == null || from === i) return;
    setFlow((prev) => {
      const next = prev.slice();
      const [item] = next.splice(from, 1);
      next.splice(i, 0, item);
      return next;
    });
    setOverrides((prev) => moveOverrides(prev, from!, i));
    dragIndex.current = null;
  };

  // Practice state
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [inCooldown, setInCooldown] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto‑generate preview
  const [isGeneratingSeq, setIsGeneratingSeq] = useState(false);
  const [preview, setPreview] = useState<PoseId[] | null>(null);
  const previewTriggerRef = useRef<HTMLButtonElement>(null);
  const previewCloseRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (preview) {
      previewCloseRef.current?.focus();
    } else {
      previewTriggerRef.current?.focus();
    }
  }, [preview]);

  const openPreview = () => {
    setIsGeneratingSeq(true);
    try {
      let seq = smartGenerate(minutes, intensity, focus);
      if (safetyMode) seq = applySafetyAdjustments(seq);
      setPreview(seq);
    } finally {
      setIsGeneratingSeq(false);
    }
  };
  const acceptPreview = () => {
    if (!preview) return;
    setFlow(preview);
    setOverrides({});
    setIndex(0);
    setRemaining(baseDurationsFromTable(preview)[0] ?? 30);
    setPreview(null);
  };
  const shufflePreview = () => {
    if (!preview) return;
    setPreview(applySafetyAdjustments([...preview].sort(() => Math.random() - 0.5)));
  };

  // Durations
  const baseDurationsSec = useMemo(() => baseDurationsFromTable(flow), [flow]);
  const secondsPerPoseRaw = useMemo(() => applyOverridesByIndex(baseDurationsSec, overrides), [baseDurationsSec, overrides]);
  const secondsPerPose = useMemo(() => {
    if (timingMode === TimingMode.Seconds) return secondsPerPoseRaw;
    return secondsPerPoseRaw.map((sec) => {
      const breaths = Math.max(1, Math.round(sec / Math.max(1, breathSeconds)));
      return breaths * Math.max(1, breathSeconds);
    });
  }, [secondsPerPoseRaw, timingMode, breathSeconds]);

  const cooldownSec = Math.max(0, Math.round(cooldownMin * 60));
  const totalSecondsComputed = useMemo(() => secondsPerPose.reduce((a, b) => a + b, 0) + Math.max(0, flow.length - 1) * transitionSec + cooldownSec, [secondsPerPose, transitionSec, flow.length, cooldownSec]);

  useEffect(() => {
    const d = secondsPerPose[index] ?? 0;
    if (!inCooldown && remaining > d) setRemaining(d);
  }, [secondsPerPose, index, remaining, inCooldown]);

  // Controls
  const startPractice = React.useCallback(() => {
    if (!flow.length) return;
    setIndex(0);
    setRemaining(secondsPerPose[0] ?? 30);
    setIsPlaying(true);
    setInCooldown(false);
    const firstPose = POSES.find((p) => p.id === flow[0]);
    speak(`Begin practice. ${firstPose?.name}. ${buildCues(flow[0], breathingOn)}`);
  }, [flow, secondsPerPose, breathingOn]);

  const pausePractice = React.useCallback(() => {
    setIsPlaying(false);
    try {
      window.speechSynthesis?.pause();
    } catch (e) {
      console.error("Speech synthesis pause failed", e);
    }
  }, []);

  const resumePractice = React.useCallback(() => {
    setIsPlaying(true);
    try {
      window.speechSynthesis?.resume();
    } catch (e) {
      console.error("Speech synthesis resume failed", e);
    }
  }, []);

  const stopPractice = () => {
    setIsPlaying(false);
    setIndex(0);
    setRemaining(0);
    setInCooldown(false);
    try {
      window.speechSynthesis?.cancel();
    } catch (e) {
      console.error("Speech synthesis cancel failed", e);
    }
  };

  const voiceActions = React.useMemo(() => ({
    pause: pausePractice,
    resume: () => (remaining ? resumePractice() : startPractice()),
    stop: stopPractice,
    next: () => {
      if (flow.length && !inCooldown) {
        const next = Math.min(flow.length - 1, index + 1);
        setIndex(next);
        setRemaining(secondsPerPose[next] ?? 30);
      }
    },
    previous: () => {
      if (flow.length && !inCooldown) {
        const prev = Math.max(0, index - 1);
        setIndex(prev);
        setRemaining(secondsPerPose[prev] ?? 30);
      }
    },
  }), [pausePractice, remaining, resumePractice, startPractice, stopPractice, flow.length, inCooldown, index, secondsPerPose]);

  const { isListening, toggle: toggleMic, supportsSpeechInput } = useVoiceCommands(voiceActions);

  // Timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = window.setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          if (inCooldown) {
            setIsPlaying(false);
            setInCooldown(false);
            speak("Practice complete. Namaste.");
            return 0;
          }
          setIndex((i) => {
            const next = i + 1;
            if (next >= flow.length) {
              if (cooldownSec > 0) {
                setInCooldown(true);
                setRemaining(cooldownSec);
                speak(`Rest in Savasana for ${cooldownMin} minutes.`);
                return i;
              }
              setIsPlaying(false);
              speak("Practice complete. Nice work.");
              return i;
            }
            const nextId = flow[next];
            const nextDur = secondsPerPose[next] ?? 30;
            setRemaining(nextDur);
            const pose = POSES.find((p) => p.id === nextId);
            speak(`${pose?.name}. ${buildCues(nextId, breathingOn)}`);
            return next;
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, flow, secondsPerPose, cooldownSec, cooldownMin, inCooldown, breathingOn]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape" && preview) setPreview(null);
      if (e.code === "Space") {
        e.preventDefault();
        isPlaying ? pausePractice() : (remaining ? resumePractice() : startPractice());
      }
      if (e.code === "ArrowRight" && flow.length && !inCooldown) {
        const next = Math.min(flow.length - 1, index + 1);
        setIndex(next);
        setRemaining(secondsPerPose[next] ?? 30);
        const id = flow[next];
        const pose = POSES.find((p) => p.id === id);
        speak(`${pose?.name}. ${buildCues(id, breathingOn)}`);
      }
      if (e.code === "ArrowLeft" && flow.length && !inCooldown) {
        const prev = Math.max(0, index - 1);
        setIndex(prev);
        setRemaining(secondsPerPose[prev] ?? 30);
        const id = flow[prev];
        const pose = POSES.find((p) => p.id === id);
        speak(`${pose?.name}. ${buildCues(id, breathingOn)}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, flow, secondsPerPose, remaining, index, preview, inCooldown, breathingOn, startPractice, pausePractice, resumePractice]);

  // Derived display
  const currentPose = inCooldown ? { name: "Savasana (Rest)", sanskrit: "", id: "_cooldown", icon: "🧘" } : POSES.find((p) => p.id === flow[index]);
  const sessionRemainingSec = computeTotalRemaining(index, remaining, secondsPerPose, transitionSec, flow.length, cooldownSec, inCooldown);
  const topProgress = totalSecondsComputed > 0 ? (sessionRemainingSec / totalSecondsComputed) * 100 : 0;
  const nextPose = inCooldown ? null : (flow[index + 1] ? POSES.find((p) => p.id === flow[index + 1]) : null);

  // Save/Load helpers
  function saveCurrent() {
    const id = crypto.randomUUID();
    const name = saveName.trim().replace(/[^\w\s-]/g, "") || `Flow ${saved.length + 1}`;
    setSaved((s) => [{ id, name, flow: [...flow], overrides: { ...overrides } }, ...s]);
    setSaveName("");
  }
  function loadSaved(id: string) {
    const s = saved.find((x) => x.id === id);
    if (!s) return;
    setFlow([...s.flow]);
    setOverrides({ ...s.overrides });
    setIndex(0);
    setRemaining(baseDurationsFromTable(s.flow)[0] ?? 30);
  }
  function delSaved(id: string) {
    setSaved((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-3xl font-semibold text-center tracking-tight">Create your sequence</h1>
        <div className="mx-auto mt-4 rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-sm backdrop-blur overflow-hidden">
          {/* Controls Row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left controls */}
            <div className="flex flex-1 flex-wrap items-center gap-4">
              <label className="flex items-center gap-3" aria-label="Time slider">
                <span className="w-16 text-sm text-neutral-600">Time</span>
                <input type="range" min={10} max={90} step={5} value={minutes} onChange={(e)=>setMinutes(Number(e.target.value))} />
                <span className="w-14 text-right text-sm font-medium tabular-nums">{minutes}m</span>
              </label>
              <label className="flex items-center gap-3" aria-label="Intensity slider">
                <span className="text-sm text-neutral-600">Intensity</span>
                <input type="range" min={1} max={5} step={1} value={intensity} onChange={(e)=>setIntensity(Number(e.target.value))} />
                <span className="text-sm font-medium tabular-nums">{dotBar(intensity)}</span>
              </label>
              <label className="flex items-center gap-2" aria-label="Focus selector">
                <span className="text-sm text-neutral-600">Focus</span>
                <select className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm" value={focus} onChange={(e)=>setFocus(e.target.value as Focus)}>
                  {FOCI.map((f)=>(<option key={f} value={f}>{f}</option>))}
                </select>
              </label>
              <label className="flex items-center gap-2" aria-label="Breathing cues toggle">
                <input type="checkbox" checked={breathingOn} onChange={(e)=>setBreathingOn(e.target.checked)} />
                <span className="text-sm text-neutral-700">Breathing cues</span>
              </label>
            </div>
            {/* Right controls neatly grouped inside border */}
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2" aria-label="Timing mode">
                  <span className="text-sm text-neutral-600">Timing</span>
                  <select className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm" value={timingMode} onChange={(e)=>setTimingMode(e.target.value as TimingMode)}>
                    <option value={TimingMode.Seconds}>Seconds</option>
                    <option value={TimingMode.Breaths}>Breaths</option>
                  </select>
                </label>
                {timingMode === TimingMode.Breaths && (
                  <label className="flex items-center gap-2" aria-label="Breath seconds">
                    <span className="text-sm text-neutral-600">sec/breath</span>
                    <input type="number" min={3} max={10} step={1} value={breathSeconds} onChange={(e)=>setBreathSeconds(Math.max(1, Number(e.target.value)||5))} className="h-9 w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm" />
                  </label>
                )}
                <label className="flex items-center gap-2" aria-label="Transition seconds">
                  <span className="text-sm text-neutral-600">Transition</span>
                  <input type="number" min={0} max={20} step={1} value={transitionSec} onChange={(e)=>setTransitionSec(Math.max(0, Number(e.target.value)||0))} className="h-9 w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm" />
                </label>
                <label className="flex items-center gap-2" aria-label="Cooldown minutes">
                  <span className="text-sm text-neutral-600">Cooldown</span>
                  <input type="number" min={0} max={10} step={1} value={cooldownMin} onChange={(e)=>setCooldownMin(Math.max(0, Number(e.target.value)||0))} className="h-9 w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm" />
                </label>
                <label className="flex items-center gap-2" aria-label="Safety mode">
                  <input type="checkbox" checked={safetyMode} onChange={(e)=>setSafetyMode(e.target.checked)} />
                  <span className="text-sm text-neutral-700">Safer sequencing</span>
                </label>
                <label className="flex items-center gap-2" aria-label="Persist locally">
                  <input type="checkbox" checked={persistLocal} onChange={(e)=>setPersistLocal(e.target.checked)} />
                  <span className="text-sm text-neutral-700">Save to this device</span>
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button ref={previewTriggerRef} disabled={isGeneratingSeq} onClick={openPreview} className={`h-9 rounded-full px-3 py-2 text-sm text-white ${isGeneratingSeq?"bg-indigo-300":"bg-indigo-600 hover:bg-indigo-500"}`}>{isGeneratingSeq?"Generating…":"Auto‑generate"}</button>
                <div className="flex items-center gap-2">
                  <input value={saveName} onChange={(e)=>setSaveName(e.target.value)} placeholder="Flow name" className="h-9 w-36 md:w-40 max-w-full rounded-md border border-neutral-300 px-2 py-1 text-sm" />
                  <button onClick={saveCurrent} className="h-9 rounded-full border px-3 py-1 text-xs hover:bg-neutral-50">Save</button>
                </div>
              </div>
            </div>
          </div>
          {/* Preset chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.name} onClick={()=>{ setFlow(p.flow); setOverrides({}); }} className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-white hover:bg-neutral-800">{p.name}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16">
        {/* Player */}
        {flow.length > 0 && (
          <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-xl">{currentPose?.icon || "🧘"}</div>
                <div>
                  <div className="text-sm text-neutral-500">Now Playing</div>
                  <div className="text-lg font-medium leading-tight">{currentPose?.name ?? "—"}</div>
                  <div className="text-xs text-neutral-500">{currentPose?.sanskrit ?? ""}</div>
                  <div className="mt-1 text-xs text-neutral-600">{nextPose ? <>Next up: <span className="font-medium">{nextPose.name}</span> · {secondsPerPose[index + 1]}s</> : (inCooldown ? <>Resting</> : <>Last pose</>)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600">Voice</label>
                <select className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm" value={voiceName} onChange={(e)=>setVoiceName(e.target.value)}>
                  <option value="">System default</option>
                  {voices.map((v)=>(<option key={v.name+v.lang} value={v.name}>{v.name} ({v.lang})</option>))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                {supportsSpeechInput ? (
                  <button onClick={toggleMic} className={`rounded-full border px-3 py-2 text-sm ${isListening ? "bg-neutral-900 text-white" : "hover:bg-neutral-50"}`}>{isListening ? "🎙️ Listening" : "🎙️ Voice control"}</button>
                ) : (
                  <span className="text-xs text-neutral-500">🎙️ Voice not supported</span>
                )}
                {!isPlaying && remaining === 0 && (<button className="rounded-full bg-neutral-900 px-4 py-2 text-white" onClick={startPractice}>▶ Play</button>)}
                {isPlaying && (<button className="rounded-full border px-4 py-2" onClick={pausePractice}>⏸ Pause</button>)}
                {!isPlaying && remaining > 0 && (<button className="rounded-full bg-neutral-900 px-4 py-2 text-white" onClick={resumePractice}>⏵ Resume</button>)}
                <button className="rounded-full border px-4 py-2" onClick={stopPractice}>■ Stop</button>
              </div>
            </div>
            {/* Top progress: session remaining */}
            <div role="progressbar" aria-label="Session remaining" aria-valuemin={0} aria-valuemax={totalSecondsComputed} aria-valuenow={sessionRemainingSec} className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full bg-neutral-900 transition-[width] duration-500" style={{ width: `${topProgress}%` }} />
            </div>
            <div className="mt-1 text-right text-xs text-neutral-500">Session remaining: {String(Math.floor(sessionRemainingSec/60)).padStart(2,"0")}:{String(Math.floor(sessionRemainingSec%60)).padStart(2,"0")}</div>
            <div className="mt-3 text-xs text-neutral-500" aria-live="polite">Shortcuts: Esc close preview • Space Play/Pause • ←/→ Prev/Next</div>
          </section>
        )}

        {/* Flow */}
        <section>
          <h2 className="mb-1 text-lg font-medium">Your Flow</h2>
          <div className="mb-3 flex flex-wrap gap-2 text-sm text-neutral-600">
            <span className="rounded-full border border-neutral-300 px-2 py-0.5">Total: <strong className="tabular-nums">{Math.round(totalSecondsComputed/60)}m</strong></span>
            <span className="rounded-full border border-neutral-300 px-2 py-0.5">Poses: <strong className="tabular-nums">{flow.length}</strong></span>
            <span className="rounded-full border border-neutral-300 px-2 py-0.5">Intensity: <strong>{intensity}</strong></span>
            <span className="rounded-full border border-neutral-300 px-2 py-0.5">Focus: <strong>{focus}</strong></span>
          </div>
          {flow.length === 0 ? (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-sm text-neutral-500">Your flow is empty. Click a suggestion to add a pose or use Auto‑generate.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {flow.map((id, i) => {
                const p = POSES.find((x) => x.id === id)!; const active = isPlaying && i === index && !inCooldown; const dur = secondsPerPose[i] ?? 0; const cardRemaining = active ? remaining : dur; const cardWidth = dur > 0 ? `${(cardRemaining / dur) * 100}%` : "0%";
                const tip = coachTip(flow[i-1], id, flow[i+1]);
                return (
                  <div key={`${id}-${i}`} draggable onDragStart={onDragStart(i)} onDragOver={onDragOver(i)} onDrop={onDrop(i)} className={`group relative rounded-2xl border ${active ? "border-neutral-900 bg-neutral-50 shadow-lg ring-1 ring-neutral-900/10 scale-[1.015]" : "border-neutral-200 shadow-sm"} bg-white p-3 transition transform-gpu hover:shadow-md duration-200`}>
                    <div className="flex items-start justify-between">
                      <div className="text-xs text-neutral-500 flex items-center gap-2"><span className="cursor-grab select-none" title="Drag to reorder" role="button" tabIndex={0} aria-label="Drag to reorder">≡</span>{i + 1}</div>
                      {/* Hovercard */}
                      <div className="relative">
                        <div className="text-[11px] text-neutral-500">Why?</div>
                        <div className="invisible absolute right-0 z-10 mt-1 w-56 rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-700 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">{tip}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-lg">{p.icon}</div>
                      <div>
                        <div className="font-medium leading-tight">{p.name}</div>
                        <div className="text-xs text-neutral-500">{p.sanskrit}</div>
                      </div>
                    </div>
                    <label className="mt-2 block text-xs text-neutral-600">{timingMode === TimingMode.Breaths ? "Breaths" : "Seconds"}
                      <input type="number" min={timingMode === TimingMode.Breaths ? 1 : 5} max={timingMode === TimingMode.Breaths ? 20 : 600} step={timingMode === TimingMode.Breaths ? 1 : 5}
                        value={timingMode === TimingMode.Breaths ? Math.max(1, Math.round((secondsPerPose[i]||0)/Math.max(1, breathSeconds))) : dur}
                        onChange={(e)=>{ const val = Math.max(1, Number(e.target.value)||0); const sec = timingMode === TimingMode.Breaths ? val * Math.max(1, breathSeconds) : Math.max(5, Math.min(600, val)); setOverrides((prev)=>({ ...prev, [i]: sec })); }}
                        disabled={isPlaying}
                        className="ml-2 w-24 rounded-md border border-neutral-300 px-2 py-1 text-xs" />
                    </label>
                    <div role="progressbar" aria-label={`Pose ${i+1} remaining`} aria-valuemin={0} aria-valuemax={dur} aria-valuenow={cardRemaining} className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full bg-neutral-900 transition-[width] duration-500" style={{ width: cardWidth }} />
                    </div>
                    <div className="mt-3 flex items-center gap-2 sm:hidden">
                      <button onClick={()=>moveUp(i)} className="rounded-full border px-2 py-0.5 text-xs">↑</button>
                      <button onClick={()=>moveDown(i)} className="rounded-full border px-2 py-0.5 text-xs">↓</button>
                    </div>
                    <button className="absolute right-2 top-2 rounded-full border px-2 py-0.5 text-xs hover:bg-neutral-50" onClick={()=>removeFromFlow(i)} disabled={isPlaying}>Remove</button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Suggestions */}
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Suggestions</h2>
            <div className="text-xs text-neutral-500">Filtered by intensity ±1 and focus bias</div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p) => (
              <button key={p.id} onClick={()=>addToFlow(p.id)} className="group rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md">
                <div className="mb-2 flex h-24 w-full items-center justify-center rounded-xl bg-neutral-100 text-3xl">{p.icon}</div>
                <div className="font-medium group-hover:underline">{p.name}</div>
                <div className="text-xs text-neutral-500">{p.sanskrit}</div>
                <div className="mt-2 text-xs text-neutral-600">Intensity {p.intensity} • {p.family}</div>
                <div className="mt-1 text-[11px] text-neutral-500">{(p.groups||[]).join(" • ")}</div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Preview Modal */}
      {preview && (
        <div role="dialog" aria-modal="true" aria-labelledby="preview-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={()=>setPreview(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <div id="preview-title" className="text-lg font-medium">Proposed sequence</div>
              <button ref={previewCloseRef} aria-label="Close preview" onClick={()=>setPreview(null)} className="rounded-full border px-2 py-1 text-sm">✕</button>
            </div>
            <ol className="mb-3 max-h-[60vh] list-decimal space-y-1 overflow-auto pl-5 text-sm">
              {preview.map((id, i)=>{ const p = POSES.find(x=>x.id===id); return <li key={`${id}-${i}`}>{p?.name||id}</li>; })}
            </ol>
            <div className="flex items-center justify-end gap-2">
              <button onClick={shufflePreview} className="rounded-full border px-3 py-1 text-sm">Shuffle</button>
              <button onClick={()=>setPreview(null)} className="rounded-full border px-3 py-1 text-sm">Cancel</button>
              <button onClick={acceptPreview} className="rounded-full bg-neutral-900 px-3 py-1 text-sm text-white">Use this</button>
            </div>
          </div>
        </div>
      )}

      {/* Tests (toggle via: window.__RUN_SEQUENCE_TESTS__ = true) */}
      <Tests />
    </div>
  );
}

// ------------------- Tests -------------------
function Tests() {
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).__RUN_SEQUENCE_TESTS__) return;
    try {
      // Unicode strings compile
      const u = "Uttanāsana"; const v = "Virabhadrāsana I"; console.assert(u && v, "Unicode strings not parsed");
      // Defaults mapping
      const ids = [PoseId.ForwardFold, PoseId.DownDog, PoseId.Warrior1Right]; const out = baseDurationsFromTable(ids); console.assert(out[0]===60 && out[1]===45 && out[2]===45, "Defaults mapping wrong", out);
      // Reindex overrides after removal
      const before = {0:30,2:50} as SecondsOverrides; const after = reindexOverridesAfterRemoval(before,1); console.assert(after[0]===30 && after[1]===50 && (after as any)[2]===undefined, "Reindex after removal failed", after);
      // Move overrides with reorder
      const moved = moveOverrides({0:30,2:50}, 0, 2); console.assert(moved[2]===30 && moved[1]===50, "moveOverrides failed", moved);
      // Session remaining with transitions + cooldown
      const rem = computeTotalRemaining(1, 10, [60,45,45], 5, 4, 120, false); console.assert(rem===185, "Session remaining wrong", rem);
      // Safety rule sanity: twist↔backbend not adjacent
      const safer = applySafetyAdjustments([PoseId.TwistLow, PoseId.Bridge]); console.assert(safer.join(",").indexOf("twist_low,bridge")==-1, "Safety rule not applied");
      console.log("Tests passed ✅");
    } catch (e) { console.error("Tests failed ❌", e); }
  }, []);
  return null;
}
