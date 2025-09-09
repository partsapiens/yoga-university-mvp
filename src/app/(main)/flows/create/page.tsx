"use client";

import React, { useMemo, useState, useRef } from "react";
import { Toaster } from 'react-hot-toast';

// Core imports
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toastError, toastSuccess } from "@/lib/utils";
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
        cues: [Helpers.buildCues(poseId, true)],
        focus: poseDetails?.groups,
        intensity: poseDetails?.intensity as any,
      };
    }),
  }), [flow, flowName, secondsPerPose]);

  return (
    <>
      <Toaster />
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[minmax(560px,1fr)_minmax(520px,1fr)] items-start">

          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <ControlPanel {...{ minutes, setMinutes, intensity, setIntensity, focus, setFocus, saferSequencing, setSaferSequencing, saveToDevice, setSaveToDevice, timingMode, setTimingMode, secPerBreath, setSecPerBreath, onAutoGenerate: handleGenerate, flowName, setFlowName, onSaveFlow: handleSaveFlow, onLoadPreset: handleLoadPreset, breathingCues:true, setBreathingCues:()=>{}, voiceFeedback:true, setVoiceFeedback:()=>{}, transitionSec:0, setTransitionSec:()=>{}, cooldownMin:0, setCooldownMin:()=>{} }} />
            <SavedFlows flows={savedFlows} onLoad={handleLoadFlow} onDelete={handleDeleteFlow} />
            <PoseGrid {...{ flow, secondsPerPose, totalSeconds, onRemovePose: removePose, onUpdatePoseDuration: updatePoseDuration, timingMode, secPerBreath, onMovePose: movePose, dragIndexRef: dragIndex, activePoseIndex: -1, timeInPose: 0 }} />
            <SuggestionsGrid onAddPose={addPose} />
          </div>

          {/* Right Column */}
          <section className="h-full lg:sticky lg:top-6">
            <VoiceCoach flow={flowForWidget} />
          </section>

        </div>
        <GeneratePreviewModal isOpen={!!preview} onClose={() => setPreview(null)} preview={preview} onShuffle={handleGenerate} onAccept={acceptPreview} />
      </div>
    </>
  );
}
