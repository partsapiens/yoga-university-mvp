"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Toaster } from 'react-hot-toast';

// Core imports
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTimer } from "@/hooks/useTimer";
import { Focus, TimingMode, PoseId, SavedFlow } from "@/types/yoga";
import { POSES, PRESETS } from "@/lib/yoga-data";
import * as Helpers from "@/lib/yoga-helpers";

// Voice AI imports
import { useSpeechRecognition } from '@/lib/voice/useSpeechRecognition';
import { parseTranscript } from '@/lib/voice/nlu';
import { executeIntent, AppContext } from '@/lib/voice/capability-registry';
import { toastSuccess, toastError, speak } from '@/lib/voice/feedback';
import { VoiceMicButton } from '@/components/flows/VoiceMicButton';
import { CommandConsole, CommandLog } from '@/components/flows/CommandConsole';

// UI Components
import { ControlPanel } from "@/components/flows/ControlPanel";
import { PoseGrid } from "@/components/flows/PoseGrid";
import { SuggestionsGrid } from "@/components/flows/SuggestionsGrid";
import { GeneratePreviewModal } from "@/components/flows/GeneratePreviewModal";
import { Player } from "@/components/flows/Player";
import { SavedFlows } from "@/components/flows/SavedFlows";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function CreateFlowPage() {
  // --- STATE ---
  const [flow, setFlow] = useState<PoseId[]>([PoseId.DownDog, PoseId.Warrior1Right, PoseId.ForwardFold, PoseId.Child, PoseId.Butterfly]);
  const [overrides, setOverrides] = useState<Record<number, number>>({});
  const [minutes, setMinutes] = useState<number>(30);
  const [intensity, setIntensity] = useState<number>(3);
  const [focus, setFocus] = useState<Focus>("Full-Body");
  const [breathingCues, setBreathingCues] = useState<boolean>(true);
  const [saferSequencing, setSaferSequencing] = useState<boolean>(true);
  const [saveToDevice, setSaveToDevice] = useState<boolean>(false);
  const [voiceFeedback, setVoiceFeedback] = useState<boolean>(true);
  const [timingMode, setTimingMode] = useState<TimingMode>(TimingMode.Seconds);
  const [secPerBreath, setSecPerBreath] = useState<number>(5);
  const [transitionSec, setTransitionSec] = useState<number>(5);
  const [cooldownMin, setCooldownMin] = useState<number>(2);
  const [preview, setPreview] = useState<PoseId[] | null>(null);
  const [flowName, setFlowName] = useState('');
  const [localSaved, setLocalSaved] = useLocalStorage<SavedFlow[]>('yoga_saved_flows', []);
  const [sessionSaved, setSessionSaved] = useState<SavedFlow[]>([]);
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeInPose, setTimeInPose] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>([]);

  // --- REFS & DERIVED STATE ---
  const dragIndex = useRef<number | null>(null);
  const spokenForIndex = useRef<number | null>(null);
  const savedFlows = saveToDevice ? localSaved : sessionSaved;
  const setSavedFlows = saveToDevice ? setLocalSaved : setSessionSaved;
  const secondsPerPose = useMemo(() => Helpers.applyOverridesByIndex(Helpers.baseDurationsFromTable(flow), overrides), [flow, overrides]);
  const totalSeconds = useMemo(() => { const pS = secondsPerPose.reduce((a, b) => a + b, 0); const tS = Math.max(0, flow.length - 1) * transitionSec; return pS + tS + (cooldownMin * 60); }, [secondsPerPose, flow.length, transitionSec, cooldownMin]);

  // --- PLAYER LOGIC ---
  const handlePlay = useCallback(() => { if (flow.length === 0) return; setCurrentPoseIndex(0); setTimeInPose(0); setPlaybackState('playing'); }, [flow.length]);
  const handlePause = useCallback(() => setPlaybackState('paused'), []);
  const handleResume = useCallback(() => setPlaybackState('playing'), []);
  const handleStop = useCallback(() => { setPlaybackState('idle'); setCurrentPoseIndex(0); setTimeInPose(0); }, []);
  const handleNext = useCallback(() => { if (currentPoseIndex < flow.length - 1) { setCurrentPoseIndex(i => i + 1); setTimeInPose(0); } else { handleStop(); } }, [currentPoseIndex, flow.length, handleStop]);
  const handlePrev = useCallback(() => { if (currentPoseIndex > 0) { setCurrentPoseIndex(i => i - 1); setTimeInPose(0); } }, [currentPoseIndex]);
  const adjustRate = useCallback((adj: number) => setPlaybackRate(rate => clamp(rate + adj, 0.5, 2.0)), []);
  useTimer(() => { if (playbackState !== 'playing') return; const d = Helpers.tempoAdjust(secondsPerPose[currentPoseIndex] ?? 0, playbackRate); if (timeInPose < d) { setTimeInPose(t => t + 1); } else { handleNext(); } }, 1000);

  // --- VOICE AI ---
  const speech = useSpeechRecognition();
  const appContext: AppContext = useMemo(() => ({
    player: { play: handlePlay, pause: handlePause, stop: handleStop, next: handleNext, prev: handlePrev, restart: handlePlay, setRate: setPlaybackRate, adjustRate },
    flow: { setMinutes, setIntensity, setFocus, setTransition, setCooldown, setTimingMode, toggle: (k) => { if (k === 'breathingCues') setBreathingCues(p => !p); if (k === 'saferSequencing') setSaferSequencing(p => !p); if (k === 'saveToDevice') setSaveToDevice(p => !p); }, applyPreset: (f) => { setFlow(f); setOverrides({}); }, setName: setFlowName, save: () => { if (!flowName.trim()) return; setSavedFlows([...savedFlows, { id: new Date().toISOString(), name: flowName.trim(), flow, overrides }]); setFlowName(''); } }
  }), [handlePlay, handlePause, handleStop, handleNext, handlePrev, adjustRate, focus, flowName, savedFlows, flow, overrides]);

  const processCommand = async (transcript: string) => {
    const intent = parseTranscript(transcript);
    if (!intent) {
      toastError("I didn't understand that command.");
      return;
    }
    const feedback = await executeIntent(intent, appContext);
    speak(feedback, voiceFeedback);
    toastSuccess(feedback);
    setCommandLogs(prev => [{ id: new Date().toISOString(), transcript, feedback }, ...prev].slice(0, 10));
  };

  useEffect(() => {
    if (speech.transcript) {
      processCommand(speech.transcript);
    }
  }, [speech.transcript]);

  // --- Other Handlers & Effects ---
  const handleGenerate = () => setPreview(Helpers.smartGenerate(minutes, intensity, focus));
  const acceptPreview = () => { if (preview) { setFlow(preview); setOverrides({}); setPreview(null); } };
  const removePose = (i: number) => { setFlow(f => f.filter((_, idx) => idx !== i)); setOverrides(o => Helpers.reindexOverridesAfterRemoval(o, i)); };
  const addPose = (id: PoseId) => setFlow(f => [...f, id]);
  const updatePoseDuration = (i: number, d: number) => setOverrides(o => ({ ...o, [i]: d }));
  const movePose = (from: number, to: number) => { setFlow(f => { const a = [...f]; const [i] = a.splice(from, 1); a.splice(to, 0, i); return a; }); setOverrides(o => Helpers.moveOverrides(o, from, to)); };
  const handleLoadPreset = (f: PoseId[]) => { setFlow(f); setOverrides({}); };
  const handleSaveFlow = () => { if (!flowName.trim()) return toastError("Please enter a flow name."); setSavedFlows([...savedFlows, { id: new Date().toISOString(), name: flowName.trim(), flow, overrides }]); setFlowName(''); toastSuccess("Flow saved!"); };
  const handleLoadFlow = (id: string) => { const f = savedFlows.find(x => x.id === id); if (f) { setFlow(f.flow); setOverrides(f.overrides); setFlowName(f.name); toastSuccess(`Loaded "${f.name}"`); } };
  const handleDeleteFlow = (id: string) => { setSavedFlows(savedFlows.filter(f => f.id !== id)); toastSuccess("Flow deleted."); };

  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.metaKey || e.ctrlKey || e.altKey || document.activeElement?.tagName === 'INPUT') return; if (e.key === ' ') { e.preventDefault(); if (playbackState === 'playing') handlePause(); else if (playbackState === 'paused') handleResume(); else handlePlay(); } if (e.key === 'ArrowRight') handleNext(); if (e.key === 'ArrowLeft') handlePrev(); if (e.key === '[') adjustRate(-0.25); if (e.key === ']') adjustRate(0.25); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [playbackState, handlePause, handleResume, handlePlay, handleNext, handlePrev, adjustRate]);
  useEffect(() => { if (playbackState !== 'playing' || spokenForIndex.current === currentPoseIndex) { if (playbackState !== 'playing') { spokenForIndex.current = null; window.speechSynthesis?.cancel(); } return; } if (typeof window === 'undefined' || !window.speechSynthesis) return; const poseId = flow[currentPoseIndex]; const text = Helpers.buildCues(poseId, breathingCues); const utter = new SpeechSynthesisUtterance(text); window.speechSynthesis.cancel(); window.speechSynthesis.speak(utter); spokenForIndex.current = currentPoseIndex; }, [currentPoseIndex, playbackState, breathingCues, flow]);

  const sessionTimeRemaining = useMemo(() => { const d = Helpers.tempoAdjust(secondsPerPose[currentPoseIndex] ?? 0, playbackRate); return Helpers.computeTotalRemaining(currentPoseIndex, d - timeInPose, secondsPerPose.map(s => Helpers.tempoAdjust(s, playbackRate)), transitionSec, flow.length, cooldownMin * 60, false); }, [playbackState, currentPoseIndex, timeInPose, secondsPerPose, flow.length, transitionSec, cooldownMin, playbackRate]);

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background text-foreground pb-40">
        <header className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-3xl font-semibold text-center tracking-tight">Create your sequence</h1>
          <ControlPanel {...{ minutes, setMinutes, intensity, setIntensity, focus, setFocus, breathingCues, setBreathingCues, saferSequencing, setSaferSequencing, saveToDevice, setSaveToDevice, voiceFeedback, setVoiceFeedback, timingMode, setTimingMode, secPerBreath, setSecPerBreath, transitionSec, setTransitionSec, cooldownMin, setCooldownMin, onAutoGenerate: handleGenerate, flowName, setFlowName, onSaveFlow: handleSaveFlow, onLoadPreset: handleLoadPreset }} />
        </header>
        <main className="mx-auto max-w-5xl px-4 pb-16">
          <SavedFlows flows={savedFlows} onLoad={handleLoadFlow} onDelete={handleDeleteFlow} />
          <div className="mt-6"><PoseGrid {...{ flow, secondsPerPose, totalSeconds, onRemovePose: removePose, onUpdatePoseDuration: updatePoseDuration, timingMode, secPerBreath, onMovePose: movePose, dragIndexRef: dragIndex, activePoseIndex: playbackState !== 'idle' ? currentPoseIndex : -1, timeInPose }} /></div>
          <SuggestionsGrid onAddPose={addPose} />
        </main>
        <div className="fixed bottom-24 right-4 z-20"><VoiceMicButton listening={speech.listening} error={speech.error} onStart={speech.start} onStop={speech.stop} /></div>
        {flow.length > 0 && <Player {...{ isPlaying: playbackState === 'playing', isPaused: playbackState === 'paused', currentPoseId: flow[currentPoseIndex], nextPoseId: flow[currentPoseIndex + 1], timeInPose, currentPoseDuration: Helpers.tempoAdjust(secondsPerPose[currentPoseIndex] ?? 0, playbackRate), sessionTotalSeconds: totalSeconds, sessionTimeRemaining, onPlay: handlePlay, onPause: handlePause, onResume: handleResume, onStop: handleStop, playbackRate, adjustRate }} />}
        <CommandConsole show={!speech.supported} logs={commandLogs} onCommand={processCommand} />
        <GeneratePreviewModal isOpen={!!preview} onClose={() => setPreview(null)} preview={preview} onShuffle={handleGenerate} onAccept={acceptPreview} />
      </div>
    </>
  );
}
