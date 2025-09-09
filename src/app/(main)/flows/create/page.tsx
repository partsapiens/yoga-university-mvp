"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Toaster } from 'react-hot-toast';

// Core imports
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useVoiceUI } from "@/context/VoiceUIContext";
import { Focus, TimingMode, PoseId, SavedFlow } from "@/types/yoga";
import { POSES, PRESETS } from "@/lib/yoga-data";
import * as Helpers from "@/lib/yoga-helpers";

// Voice AI imports
import { AppContext, executeIntent } from '@/lib/voice/capability-registry';
import { parseTranscript } from '@/lib/voice/nlu';
import { speak, toastError, toastSuccess } from '@/lib/voice/feedback';
import { CommandLog } from '@/components/flows/CommandConsole';
import { VoiceAssistantPopup } from "@/components/flows/VoiceAssistantPopup";
import { VoiceMicButton } from '@/components/flows/VoiceMicButton';
import VoiceCoachWidget, { Flow as CoachFlow } from "@/components/flows/VoiceCoachWidget";

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
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>([]);
  const { isVoicePopupOpen, setIsVoicePopupOpen } = useVoiceUI();
  const [showCoach, setShowCoach] = useState(false);

  // --- REFS & DERIVED STATE ---
  const dragIndex = useRef<number | null>(null);
  const savedFlows = saveToDevice ? localSaved : sessionSaved;
  const setSavedFlows = saveToDevice ? setLocalSaved : setSessionSaved; // Moved up
  const secondsPerPose = useMemo(() => Helpers.applyOverridesByIndex(Helpers.baseDurationsFromTable(flow), overrides), [flow, overrides]);
  const totalSeconds = useMemo(() => { const pS = secondsPerPose.reduce((a, b) => a + b, 0); const tS = Math.max(0, flow.length - 1) * transitionSec; return pS + tS + (cooldownMin * 60); }, [secondsPerPose, flow.length, transitionSec, cooldownMin]);

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
  const addLog = (log: CommandLog) => setCommandLogs(prev => [log, ...prev].slice(0, 10));

  // --- APP CONTEXT FOR VOICE PAGE-CONTROL ---
  const appContext: AppContext = useMemo(() => ({
      player: { play: () => setShowCoach(true) } as any,
      flow: { setMinutes, setIntensity, setFocus, setTransition: setTransitionSec, setCooldown: setCooldownMin, setTimingMode, toggle: (k) => { if (k === 'breathingCues') setBreathingCues(p => !p); if (k === 'saferSequencing') setSaferSequencing(p => !p); if (k === 'saveToDevice') setSaveToDevice(p => !p); }, applyPreset: handleLoadPreset, setName: setFlowName, save: handleSaveFlow }
  }), [setMinutes, setIntensity, setFocus, setTransitionSec, setCooldownMin, setTimingMode, setBreathingCues, setSaferSequencing, setSaveToDevice, handleLoadPreset, setFlowName, handleSaveFlow, savedFlows]); // added savedFlows to dependency array

  const processTextCommand = async (transcript: string) => { const intent = parseTranscript(transcript); if (!intent) { toastError("I didn't understand that command."); return; } const feedback = await executeIntent(intent, appContext); speak(feedback, voiceFeedback); toastSuccess(feedback); addLog({ id: new Date().toISOString(), transcript, feedback }); };

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
        cues: [Helpers.buildCues(poseId, breathingCues)],
        focus: poseDetails?.groups,
        intensity: poseDetails?.intensity as any,
      };
    }),
  }), [flow, flowName, secondsPerPose, breathingCues]);

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
          <div className="mt-6"><PoseGrid {...{ flow, secondsPerPose, totalSeconds, onRemovePose: removePose, onUpdatePoseDuration: updatePoseDuration, timingMode, secPerBreath, onMovePose: movePose, dragIndexRef: dragIndex, activePoseIndex: -1, timeInPose: 0 }} /></div>
          <SuggestionsGrid onAddPose={addPose} />
        </main>

        <div className="fixed bottom-4 right-4 z-20 flex flex-col items-center gap-3">
            <button onClick={() => setShowCoach(true)} className="h-16 w-16 flex items-center justify-center rounded-full bg-primary text-white shadow-lg text-2xl" title="Start Practice with Voice Coach">▶️</button>
            <VoiceMicButton listening={false} error={null} onStart={() => setIsVoicePopupOpen(true)} onStop={() => {}} />
        </div>

        <VoiceAssistantPopup isOpen={isVoicePopupOpen} onClose={() => setIsVoicePopupOpen(false)} appContext={appContext} voiceFeedbackOn={voiceFeedback} logs={commandLogs} addLog={addLog} onCommand={processTextCommand} />

        {showCoach && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCoach(false)}>
                <div onClick={e => e.stopPropagation()}>
                    <VoiceCoachWidget flow={flowForWidget} />
                </div>
            </div>
        )}

        <GeneratePreviewModal isOpen={!!preview} onClose={() => setPreview(null)} preview={preview} onShuffle={handleGenerate} onAccept={acceptPreview} />
      </div>
    </>
  );
}
