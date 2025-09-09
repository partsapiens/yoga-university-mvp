"use client";

import React, { useMemo, useState, useRef, useCallback } from "react";
import { Toaster } from 'react-hot-toast';

// Core imports
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Focus, TimingMode, PoseId, SavedFlow } from "@/types/yoga";
import { POSES, PRESETS } from "@/lib/yoga-data";
import * as Helpers from "@/lib/yoga-helpers";
import VoiceCoach, { Flow as CoachFlow } from "@/components/flows/VoiceCoachWidget";

// UI Components
import { ControlPanel } from "@/components/flows/ControlPanel";
import { PoseGrid } from "@/components/flows/PoseGrid";
import { SuggestionsGrid } from "@/components/flows/SuggestionsGrid";
import { GeneratePreviewModal } from "@/components/flows/GeneratePreviewModal";
import { SavedFlows } from "@/components/flows/SavedFlows";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function CreateFlowPage() {
  // --- STATE ---
  const [flow, setFlow] = useState<PoseId[]>([PoseId.DownDog, PoseId.Warrior1Right, PoseId.ForwardFold, PoseId.Child, PoseId.Butterfly]);
  const [overrides, setOverrides] = useState<Record<number, number>>({});
  const [minutes, setMinutes] = useState<number>(30);
  const [intensity, setIntensity] = useState<number>(3);
  const [focus, setFocus] = useState<Focus>("Full-Body");
  const [saferSequencing, setSaferSequencing] = useState<boolean>(true);
  const [timingMode, setTimingMode] = useState<TimingMode>(TimingMode.Seconds);
  const [secPerBreath, setSecPerBreath] = useState<number>(5);
  const [preview, setPreview] = useState<PoseId[] | null>(null);
  const [flowName, setFlowName] = useState('');
  const [localSaved, setLocalSaved] = useLocalStorage<SavedFlow[]>('yoga_saved_flows', []);
  const [sessionSaved, setSessionSaved] = useState<SavedFlow[]>([]);
  const [saveToDevice, setSaveToDevice] = useState<boolean>(false);
  const [showCoach, setShowCoach] = useState(false);

  // --- REFS & DERIVED STATE ---
  const dragIndex = useRef<number | null>(null);
  const savedFlows = saveToDevice ? localSaved : sessionSaved;
  const setSavedFlows = saveToDevice ? setLocalSaved : setSessionSaved;
  const secondsPerPose = useMemo(() => Helpers.applyOverridesByIndex(Helpers.baseDurationsFromTable(flow), overrides), [flow, overrides]);
  const totalSeconds = useMemo(() => secondsPerPose.reduce((a, b) => a + b, 0), [secondsPerPose]);

  // --- HANDLERS ---
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

  // --- DATA TRANSFORMATION FOR WIDGET ---
  const flowForWidget: CoachFlow = useMemo(() => ({
    id: 'current-flow',
    title: flowName || 'My Custom Flow',
    poses: flow.map((poseId, index) => {
      const poseDetails = POSES.find(p => p.id === poseId);
      return {
        id: poseId,
        name: poseDetails?.name || 'Unknown Pose',
        durationSec: secondsPerPose[index],
        cues: [Helpers.buildCues(poseId, true)], // Simplified cues
        focus: poseDetails?.groups,
        intensity: poseDetails?.intensity as any,
      };
    }),
  }), [flow, flowName, secondsPerPose]);

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background text-foreground pb-40">
        <header className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-3xl font-semibold text-center tracking-tight">Create your sequence</h1>
          {/* Removed props that are no longer used by the simplified page */}
          <ControlPanel {...{ minutes, setMinutes, intensity, setIntensity, focus, setFocus, saferSequencing, setSaferSequencing, saveToDevice, setSaveToDevice, timingMode, setTimingMode, secPerBreath, setSecPerBreath, onAutoGenerate: handleGenerate, flowName, setFlowName, onSaveFlow: handleSaveFlow, onLoadPreset: handleLoadPreset, breathingCues:true, setBreathingCues:()=>{}, voiceFeedback:true, setVoiceFeedback:()=>{}, transitionSec:0, setTransitionSec:()=>{}, cooldownMin:0, setCooldownMin:()=>{} }} />
        </header>
        <main className="mx-auto max-w-5xl px-4 pb-16">
          <SavedFlows flows={savedFlows} onLoad={handleLoadFlow} onDelete={handleDeleteFlow} />
          <div className="mt-6"><PoseGrid {...{ flow, secondsPerPose, totalSeconds, onRemovePose: removePose, onUpdatePoseDuration: updatePoseDuration, timingMode, secPerBreath, onMovePose: movePose, dragIndexRef: dragIndex, activePoseIndex: -1, timeInPose: 0 }} /></div>
          <SuggestionsGrid onAddPose={addPose} />
        </main>

        {/* Button to launch the Voice Coach */}
        <div className="fixed bottom-4 right-4 z-20">
            <button onClick={() => setShowCoach(c => !c)} className="h-16 w-16 flex items-center justify-center rounded-full bg-primary text-white shadow-lg text-3xl" title="Start Practice with Voice Coach">
                {showCoach ? '✕' : '▶️'}
            </button>
        </div>

        {/* The new Voice Coach Widget is now fixed on the page when active */}
        {showCoach && (
            <div className="fixed bottom-24 right-4 z-50">
                <VoiceCoach flow={flowForWidget} />
            </div>
        )}

        <GeneratePreviewModal isOpen={!!preview} onClose={() => setPreview(null)} preview={preview} onShuffle={handleGenerate} onAccept={acceptPreview} />
      </div>
    </>
  );
}
