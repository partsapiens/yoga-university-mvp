"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTimer } from "@/hooks/useTimer";
import { ControlPanel } from "@/components/flows/ControlPanel";
import { PoseGrid } from "@/components/flows/PoseGrid";
import { SuggestionsGrid } from "@/components/flows/SuggestionsGrid";
import { GeneratePreviewModal } from "@/components/flows/GeneratePreviewModal";
import { Player } from "@/components/flows/Player";
import { SavedFlows } from "@/components/flows/SavedFlows";
import { PoseLibrarySidebar } from "@/components/flows/PoseLibrarySidebar";
import { Focus, TimingMode, PoseId, SavedFlow, Pose } from "@/types/yoga";
import { POSES } from "@/lib/yoga-data";
import {
  smartGenerate,
  applyOverridesByIndex,
  baseDurationsFromTable,
  reindexOverridesAfterRemoval,
  moveOverrides,
  computeTotalRemaining,
  tempoAdjust,
  buildCues,
} from "@/lib/yoga-helpers";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function CreateFlowPage() {
  // --- Core Flow State ---
  const [flow, setFlow] = useState<PoseId[]>([PoseId.DownDog, PoseId.Warrior1Right, PoseId.ForwardFold, PoseId.Child, PoseId.Butterfly]);
  const [overrides, setOverrides] = useState<Record<number, number>>({});

  // --- Control Panel State ---
  const [minutes, setMinutes] = useState<number>(30);
  const [intensity, setIntensity] = useState<number>(3);
  const [focus, setFocus] = useState<Focus>("Full-Body");
  const [breathingCues, setBreathingCues] = useState<boolean>(true);
  const [saferSequencing, setSaferSequencing] = useState<boolean>(true);
  const [saveToDevice, setSaveToDevice] = useState<boolean>(false);
  const [timingMode, setTimingMode] = useState<TimingMode>(TimingMode.Seconds);
  const [secPerBreath, setSecPerBreath] = useState<number>(5);
  const [transitionSec, setTransitionSec] = useState<number>(5);
  const [cooldownMin, setCooldownMin] = useState<number>(2);
  const [preview, setPreview] = useState<PoseId[] | null>(null);
  const [flowName, setFlowName] = useState('');

  // --- Persistence State ---
  const [localSaved, setLocalSaved] = useLocalStorage<SavedFlow[]>('yoga_saved_flows', []);
  const [sessionSaved, setSessionSaved] = useState<SavedFlow[]>([]);
  const savedFlows = saveToDevice ? localSaved : sessionSaved;
  const setSavedFlows = saveToDevice ? setLocalSaved : setSessionSaved;

  // --- Player State ---
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeInPose, setTimeInPose] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // --- Refs ---
  const dragIndex = useRef<number | null>(null);
  const spokenForIndex = useRef<number | null>(null);

  // --- Derived Durations ---
  const secondsPerPose = useMemo(() => applyOverridesByIndex(baseDurationsFromTable(flow), overrides), [flow, overrides]);
  const totalSeconds = useMemo(() => {
    const poseSec = secondsPerPose.reduce((a, b) => a + b, 0);
    const transitionSecs = Math.max(0, flow.length - 1) * transitionSec;
    return poseSec + transitionSecs + (cooldownMin * 60);
  }, [secondsPerPose, flow.length, transitionSec, cooldownMin]);

  // --- Timer Logic ---
  useTimer(() => {
    if (playbackState !== 'playing') return;
    const currentDuration = tempoAdjust(secondsPerPose[currentPoseIndex] ?? 0, playbackRate);
    if (timeInPose < currentDuration) {
      setTimeInPose(t => t + 1);
    } else {
      if (currentPoseIndex < flow.length - 1) {
        setCurrentPoseIndex(i => i + 1);
        setTimeInPose(0);
      } else {
        setPlaybackState('idle');
      }
    }
  }, 1000); // Timer runs every second, tempo is handled by adjusting duration

  // --- Handlers ---
  const handleGenerate = () => setPreview(smartGenerate(minutes, intensity, focus));
  const acceptPreview = () => { if (preview) { setFlow(preview); setOverrides({}); setPreview(null); } };
  const removePose = (index: number) => { setFlow(flow.filter((_, i) => i !== index)); setOverrides(reindexOverridesAfterRemoval(overrides, index)); };
  const addPose = (id: PoseId) => setFlow([...flow, id]);
  const updatePoseDuration = (index: number, duration: number) => setOverrides({ ...overrides, [index]: duration });
  const movePose = (from: number, to: number) => { setFlow(f => { const a = [...f]; const [i] = a.splice(from, 1); a.splice(to, 0, i); return a; }); setOverrides(moveOverrides(overrides, from, to)); };
  const handleLoadPreset = (presetFlow: PoseId[]) => { setFlow(presetFlow); setOverrides({}); };

  // --- Persistence Handlers ---
  const handleSaveFlow = () => { if (!flowName.trim()) return; setSavedFlows([...savedFlows, { id: new Date().toISOString(), name: flowName.trim(), flow, overrides }]); setFlowName(''); };
  const handleLoadFlow = (id: string) => { const f = savedFlows.find(x => x.id === id); if (f) { setFlow(f.flow); setOverrides(f.overrides); setFlowName(f.name); } };
  const handleDeleteFlow = (id: string) => setSavedFlows(savedFlows.filter(f => f.id !== id));

  // --- Player Handlers ---
  const handlePlay = useCallback(() => { if (flow.length === 0) return; setCurrentPoseIndex(0); setTimeInPose(0); setPlaybackState('playing'); }, [flow.length]);
  const handlePause = useCallback(() => setPlaybackState('paused'), []);
  const handleResume = useCallback(() => setPlaybackState('playing'), []);
  const handleStop = useCallback(() => { setPlaybackState('idle'); setCurrentPoseIndex(0); setTimeInPose(0); }, []);
  const handleNext = useCallback(() => { if (currentPoseIndex < flow.length - 1) { setCurrentPoseIndex(i => i + 1); setTimeInPose(0); } }, [currentPoseIndex, flow.length]);
  const handlePrev = useCallback(() => { if (currentPoseIndex > 0) { setCurrentPoseIndex(i => i - 1); setTimeInPose(0); } }, [currentPoseIndex]);
  const adjustRate = (adj: number) => setPlaybackRate(rate => clamp(rate + adj, 0.5, 2.0));

  // --- Effects ---
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || document.activeElement?.tagName === 'INPUT') return;
      if (e.key === ' ') { e.preventDefault(); if (playbackState === 'playing') handlePause(); else if (playbackState === 'paused') handleResume(); else handlePlay(); }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === '[') adjustRate(-0.25);
      if (e.key === ']') adjustRate(0.25);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [playbackState, handlePause, handleResume, handlePlay, handleNext, handlePrev]);

  useEffect(() => {
    if (playbackState !== 'playing') { spokenForIndex.current = null; window.speechSynthesis?.cancel(); return; }
    if (spokenForIndex.current === currentPoseIndex) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const poseId = flow[currentPoseIndex];
    const text = buildCues(poseId, breathingCues);
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    spokenForIndex.current = currentPoseIndex;
  }, [currentPoseIndex, playbackState, breathingCues, flow]);

  const sessionTimeRemaining = useMemo(() => {
    const currentDuration = tempoAdjust(secondsPerPose[currentPoseIndex] ?? 0, playbackRate);
    return computeTotalRemaining(currentPoseIndex, currentDuration - timeInPose, secondsPerPose.map(s => tempoAdjust(s, playbackRate)), transitionSec, flow.length, cooldownMin * 60, false);
  }, [playbackState, currentPoseIndex, timeInPose, secondsPerPose, flow.length, transitionSec, cooldownMin, playbackRate]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-40">
      <header className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-3xl font-semibold text-center tracking-tight">Create your sequence</h1>
        <ControlPanel {...{ minutes, setMinutes, intensity, setIntensity, focus, setFocus, breathingCues, setBreathingCues, saferSequencing, setSaferSequencing, saveToDevice, setSaveToDevice, timingMode, setTimingMode, secPerBreath, setSecPerBreath, transitionSec, setTransitionSec, cooldownMin, setCooldownMin, onAutoGenerate: handleGenerate, flowName, setFlowName, onSaveFlow: handleSaveFlow, onLoadPreset: handleLoadPreset }} />
      </header>
      
      {/* Main content area with sidebar */}
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <SavedFlows flows={savedFlows} onLoad={handleLoadFlow} onDelete={handleDeleteFlow} />
        
        <div className="space-y-6 mt-6">
          {/* Main Flow Canvas */}
          <div>
            <PoseGrid {...{ flow, secondsPerPose, totalSeconds, onRemovePose: removePose, onUpdatePoseDuration: updatePoseDuration, timingMode, secPerBreath, onMovePose: movePose, dragIndexRef: dragIndex, activePoseIndex: playbackState !== 'idle' ? currentPoseIndex : -1, timeInPose }} />
          </div>
          
          {/* Pose Library Section */}
          <div className="bg-card border border-border rounded-lg">
            <div className="h-96">
              <PoseLibrarySidebar onAddPose={addPose} />
            </div>
          </div>
          
          {/* Keep suggestions as additional fallback */}
          <div>
            <SuggestionsGrid onAddPose={addPose} />
          </div>
        </div>
      </div>
      
      {flow.length > 0 && <Player {...{ isPlaying: playbackState === 'playing', isPaused: playbackState === 'paused', currentPoseId: flow[currentPoseIndex], nextPoseId: flow[currentPoseIndex + 1], timeInPose, currentPoseDuration: tempoAdjust(secondsPerPose[currentPoseIndex] ?? 0, playbackRate), sessionTotalSeconds: totalSeconds, sessionTimeRemaining, onPlay: handlePlay, onPause: handlePause, onResume: handleResume, onStop: handleStop, playbackRate, adjustRate }} />}
      <GeneratePreviewModal isOpen={!!preview} onClose={() => setPreview(null)} preview={preview} onShuffle={handleGenerate} onAccept={acceptPreview} />
    </div>
  );
}
