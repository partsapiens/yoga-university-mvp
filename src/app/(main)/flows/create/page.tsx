"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTimer } from "@/hooks/useTimer";
import { SuggestionsGrid } from "@/components/flows/SuggestionsGrid";
import { CombinedPoseLibrary } from "@/components/flows/CombinedPoseLibrary";
import { GeneratePreviewModal } from "@/components/flows/GeneratePreviewModal";
import { SavedFlows } from "@/components/flows/SavedFlows";
import { PoseLibrarySidebar } from "@/components/flows/PoseLibrarySidebar";
import { FlowManagement } from "@/components/flows/FlowManagement";
import { FlowValidation } from "@/components/flows/FlowValidation";
import { AutoSave } from "@/components/flows/AutoSave";
import { KeyboardShortcuts, useKeyboardShortcuts } from "@/components/flows/KeyboardShortcuts";
import { FlowNameInput } from "@/components/flows/FlowNameInput";
import YogaAIDemo from "@/components/flows/YogaAIDemo";
import { FlowTemplates } from "@/components/flows/FlowTemplates";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PoseAnalysisSettings, ProgressTracking } from "@/components/pose-analysis";
import { PersonalizedAffirmations } from "@/components/ai/PersonalizedAffirmations";
import { AdaptiveFlow } from "@/components/ai/AdaptiveFlow";
import { ActionBar } from "@/components/flows/ActionBar";
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
import { 
  downloadFlowAsJSON, 
  printFlowAsPDF, 
  generateShareableURL,
  FlowExportData 
} from "@/lib/flowExport";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function CreateFlowPage() {
  // --- Core Flow State ---
  const [flow, setFlow] = useState<PoseId[]>([]);
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
  const [showCustomSettings, setShowCustomSettings] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveToDatabase, setSaveToDatabase] = useState(false);

  // User profile for personalization
  const [userProfile, setUserProfile] = useState({
    experience: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    physicalLimitations: [] as string[],
    preferences: ['mindful transitions', 'hip openers'] as string[],
    pastPerformance: {
      completionRate: 85,
      averageDifficulty: 3,
      struggledWith: [] as string[],
      excelsAt: ['balance poses'] as string[]
    }
  });

  // Persistence State
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

  // --- ✨ Flow Generation Handler ---
  const handleGenerate = async () => {
    try {
      const requestData = {
        duration: minutes,
        difficulty: intensity <= 2 ? 'beginner' : intensity <= 4 ? 'intermediate' : 'advanced',
        focus_areas: [focus.toLowerCase().replace('-', ' ')],
        mood: intensity <= 2 ? 'calming' : intensity <= 4 ? 'balanced' : 'energizing'
      };

      const response = await fetch('/api/ai/generateFlow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const result = await response.json();
        // Map database poses back to PoseId enum for compatibility
        const generatedPoseIds = result.flow.map((item: any) => {
          // This is a simplified mapping - in a real app, you'd want a more robust system
          const poseName = item.pose?.name?.toLowerCase() || '';
          if (poseName.includes('downward') && poseName.includes('dog')) return PoseId.DownDog;
          if (poseName.includes('warrior') && poseName.includes('i')) return PoseId.Warrior1Right;
          if (poseName.includes('forward') && poseName.includes('fold')) return PoseId.ForwardFold;
          if (poseName.includes('child')) return PoseId.Child;
          if (poseName.includes('butterfly')) return PoseId.Butterfly;
          return PoseId.DownDog; // fallback
        });
        setPreview(generatedPoseIds);
      } else {
        // Fallback to legacy generation
        setPreview(smartGenerate(minutes, intensity, focus));
      }
    } catch (error) {
      console.error('Error generating ✨ flow:', error);
      // Fallback to legacy generation
      setPreview(smartGenerate(minutes, intensity, focus));
    }
  };

  // --- Export Handlers ---
  const createExportData = (): FlowExportData => ({
    id: new Date().toISOString(),
    name: flowName || 'Untitled Flow',
    description: `A ${intensity <= 2 ? 'beginner' : intensity <= 4 ? 'intermediate' : 'advanced'} ${focus} yoga flow`,
    poses: flow.map((poseId, index) => {
      const pose = POSES.find(p => p.id === poseId);
      return {
        pose_id: poseId,
        order_index: index,
        duration: secondsPerPose[index] || 30,
        pose: pose ? {
          name: pose.name,
          sanskrit_name: pose.sanskrit,
          category: pose.family.toLowerCase(),
          image_url: pose.icon || '',
          description: `Practice ${pose.name} with awareness and proper alignment.`
        } : undefined
      };
    }),
    totalDuration: totalSeconds,
    difficulty: intensity <= 2 ? 'beginner' : intensity <= 4 ? 'intermediate' : 'advanced',
    focus_areas: [focus.toLowerCase().replace('-', ' ')],
    created_at: new Date().toISOString()
  });

  const handleExportPDF = () => {
    const exportData = createExportData();
    printFlowAsPDF(exportData);
  };

  const handleGenerateShareLink = async () => {
    const exportData = createExportData();
    const shareableURL = generateShareableURL(exportData);
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareableURL);
      alert('Share link copied to clipboard!');
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareableURL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Share link copied to clipboard!');
    }
  };

  const handleSaveAsJSON = () => {
    const exportData = createExportData();
    downloadFlowAsJSON(exportData);
  };
  const acceptPreview = () => { if (preview) { setFlow(preview); setOverrides({}); setPreview(null); } };
  const removePose = (index: number) => { setFlow(flow.filter((_, i) => i !== index)); setOverrides(reindexOverridesAfterRemoval(overrides, index)); };
  const addPose = (id: PoseId) => setFlow([...flow, id]);
  const updatePoseDuration = (index: number, duration: number) => setOverrides({ ...overrides, [index]: duration });
  const movePose = (from: number, to: number) => { setFlow(f => { const a = [...f]; const [i] = a.splice(from, 1); a.splice(to, 0, i); return a; }); setOverrides(moveOverrides(overrides, from, to)); };

  // Check authentication status
  useEffect(() => {
    // Simple check for authentication - in a real app, this would check actual auth state
    const checkAuth = () => {
      // Placeholder auth check - replace with actual authentication logic
      const mockUserId = 'user-' + Math.random().toString(36).substr(2, 9);
      setUserId(mockUserId);
      setIsLoggedIn(true); // For demo purposes, assume user is logged in
    };
    
    checkAuth();
  }, []);

  // --- Enhanced Persistence Handlers ---
  const handleSaveFlow = async () => { 
    if (!flowName.trim()) return; 
    
    if (saveToDatabase && isLoggedIn && userId) {
      try {
        // Save to database
        const flowData = {
          user_id: userId,
          name: flowName.trim(),
          description: `A ${intensity <= 2 ? 'beginner' : intensity <= 4 ? 'intermediate' : 'advanced'} ${focus} yoga flow`,
          duration: Math.round(totalSeconds / 60),
          difficulty: intensity <= 2 ? 'beginner' : intensity <= 4 ? 'intermediate' : 'advanced',
          style: 'vinyasa', // Default style
          focus_areas: [focus.toLowerCase().replace('-', ' ')],
          is_public: false,
          is_ai_generated: false,
          tags: [],
          poses: flow.map((poseId, index) => ({
            pose_id: poseId,
            order_index: index,
            duration: secondsPerPose[index] || 30,
            instructions: `Practice ${POSES.find(p => p.id === poseId)?.name || 'pose'} mindfully`
          }))
        };

        const response = await fetch('/api/flows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(flowData)
        });

        if (response.ok) {
          console.log('Flow saved to database successfully');
        } else {
          console.error('Failed to save flow to database');
          // Fall back to local storage
          setSavedFlows([...savedFlows, { 
            id: new Date().toISOString(), 
            name: flowName.trim(), 
            flow, 
            overrides 
          }]);
        }
      } catch (error) {
        console.error('Error saving flow to database:', error);
        // Fall back to local storage
        setSavedFlows([...savedFlows, { 
          id: new Date().toISOString(), 
          name: flowName.trim(), 
          flow, 
          overrides 
        }]);
      }
    } else {
      // Save to local storage
      setSavedFlows([...savedFlows, { 
        id: new Date().toISOString(), 
        name: flowName.trim(), 
        flow, 
        overrides 
      }]);
    }
    
    setFlowName(''); 
  };
  const handleLoadFlow = (id: string) => { const f = savedFlows.find(x => x.id === id); if (f) { setFlow(f.flow); setOverrides(f.overrides); setFlowName(f.name); } };
  const handleDeleteFlow = (id: string) => setSavedFlows(savedFlows.filter(f => f.id !== id));

  // --- New Enhanced Handlers ---
  const handleDuplicateFlow = () => {
    const duplicatedFlow = [...flow, ...flow];
    const duplicatedOverrides: Record<number, number> = {};
    Object.entries(overrides).forEach(([key, value]) => {
      const index = parseInt(key);
      duplicatedOverrides[index] = value;
      duplicatedOverrides[index + flow.length] = value;
    });
    setFlow(duplicatedFlow);
    setOverrides(duplicatedOverrides);
  };

  const handleReverseFlow = () => {
    const reversedFlow = [...flow].reverse();
    const reversedOverrides: Record<number, number> = {};
    Object.entries(overrides).forEach(([key, value]) => {
      const oldIndex = parseInt(key);
      const newIndex = flow.length - 1 - oldIndex;
      reversedOverrides[newIndex] = value;
    });
    setFlow(reversedFlow);
    setOverrides(reversedOverrides);
  };

  const handleShuffleFlow = () => {
    const shuffledIndices = Array.from({ length: flow.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    
    const shuffledFlow = shuffledIndices.map(i => flow[i]);
    const shuffledOverrides: Record<number, number> = {};
    
    shuffledIndices.forEach((oldIndex, newIndex) => {
      if (overrides[oldIndex]) {
        shuffledOverrides[newIndex] = overrides[oldIndex];
      }
    });
    
    setFlow(shuffledFlow);
    setOverrides(shuffledOverrides);
  };

  const handleClearFlow = () => {
    if (confirm('Are you sure you want to clear all poses?')) {
      setFlow([]);
      setOverrides({});
    }
  };

  const handleRestoreFlow = (restoredFlow: PoseId[], restoredOverrides: Record<number, number>, name: string) => {
    setFlow(restoredFlow);
    setOverrides(restoredOverrides);
    setFlowName(name);
  };

  const handleSaferAlternative = (saferFlow: PoseId[]) => {
    setFlow(saferFlow);
    setOverrides({}); // Reset overrides for the new flow
  };

  const handleSelectTemplate = (template: any) => {
    setFlow(template.poses);
    setOverrides({});
    setFlowName(template.name);
    // Update control panel settings based on template
    setMinutes(template.duration);
    if (template.difficulty === 'Beginner') setIntensity(2);
    else if (template.difficulty === 'Intermediate') setIntensity(3);
    else setIntensity(4);
    // Set focus if it matches available options
    const validFoci = ["Full-Body", "Hips", "Hamstrings", "Shoulders", "Core", "Spine", "Balance"];
    if (validFoci.includes(template.focus)) {
      setFocus(template.focus as Focus);
    }
    // Hide custom settings when selecting a template
    setShowCustomSettings(false);
  };

  const handleCreateOwn = () => {
    setShowCustomSettings(true);
    // Reset to default state for custom creation
    setFlow([]);
    setOverrides({});
    setFlowName('');
  };

  const handleFlowAdapted = (adaptedFlow: any, insights: any) => {
    if (adaptedFlow.poses) {
      setFlow(adaptedFlow.poses);
    }
    if (adaptedFlow.durations) {
      const newOverrides: Record<number, number> = {};
      adaptedFlow.durations.forEach((duration: number, index: number) => {
        if (duration !== (secondsPerPose[index] || 30)) {
          newOverrides[index] = duration;
        }
      });
      setOverrides(newOverrides);
    }
    console.log('Flow adapted with insights:', insights);
  };

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

  // --- Keyboard Shortcuts ---
  useKeyboardShortcuts({
    onSave: () => { if (flowName.trim()) handleSaveFlow(); },
    onDuplicate: handleDuplicateFlow,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6">
        {!isLoggedIn && (
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
            <h3 className="font-bold">Demo Mode</h3>
            <p>You are not logged in. Your flows will not be saved. <a href="/login" className="font-bold underline">Log in</a> to save your progress.</p>
          </div>
        )}
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Create Flow</h1>
          <p className="text-lg text-muted-foreground mt-1">Design your perfect yoga sequence.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-secondary p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
            <p className="text-muted-foreground mb-4">Choose a template to get started quickly.</p>
            <FlowTemplates onSelectTemplate={handleSelectTemplate} onCreateOwn={handleCreateOwn} />
          </div>
          <div className="bg-secondary p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">AI-Powered Generation</h2>
            <p className="text-muted-foreground mb-4">Let our AI create a flow for you based on your needs.</p>
            <YogaAIDemo />
          </div>
        </div>

        <div className="space-y-8">
          <FlowManagement
            flow={flow}
            secondsPerPose={secondsPerPose}
            totalSeconds={totalSeconds}
            onRemovePose={removePose}
            onUpdatePoseDuration={updatePoseDuration}
            timingMode={timingMode}
            secPerBreath={secPerBreath}
            onMovePose={movePose}
            dragIndexRef={dragIndex}
            activePoseIndex={playbackState !== 'idle' ? currentPoseIndex : -1}
            timeInPose={timeInPose}
            onDuplicateFlow={handleDuplicateFlow}
            onReverseFlow={handleReverseFlow}
            onClearFlow={handleClearFlow}
            onShuffleFlow={handleShuffleFlow}
          />
          <CombinedPoseLibrary onAddPose={addPose} />
        </div>
      </div>
      <ActionBar
        isLoggedIn={isLoggedIn}
        flowName={flowName}
        onSave={handleSaveFlow}
        onShare={handleGenerateShareLink}
        onExportPDF={handleExportPDF}
        onSaveJSON={handleSaveAsJSON}
        playbackState={playbackState}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
      />
      <GeneratePreviewModal isOpen={!!preview} onClose={() => setPreview(null)} preview={preview} onShuffle={handleGenerate} onAccept={acceptPreview} />
    </div>
  );
}
