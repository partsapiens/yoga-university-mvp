"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTimer } from "@/hooks/useTimer";
import { useKeyboardShortcuts } from "@/components/flows/KeyboardShortcuts";
import { ControlPanel } from "@/components/flows/ControlPanel";
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
  parseSharedFlowData,
  FlowExportData 
} from "@/lib/flowExport";
import { useSearchParams } from 'next/navigation';

// Dynamic imports for heavy components to improve initial page load
const SuggestionsGrid = dynamic(() => import("@/components/flows/SuggestionsGrid").then(mod => ({ default: mod.SuggestionsGrid })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-32"></div>
});

const CombinedPoseLibrary = dynamic(() => import("@/components/flows/CombinedPoseLibrary").then(mod => ({ default: mod.CombinedPoseLibrary })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-64"></div>
});

const GeneratePreviewModal = dynamic(() => import("@/components/flows/GeneratePreviewModal").then(mod => ({ default: mod.GeneratePreviewModal })), {
  ssr: false
});

const SavedFlows = dynamic(() => import("@/components/flows/SavedFlows").then(mod => ({ default: mod.SavedFlows })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-40"></div>
});

const PoseLibrarySidebar = dynamic(() => import("@/components/flows/PoseLibrarySidebar").then(mod => ({ default: mod.PoseLibrarySidebar })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-96"></div>
});

const ExportFlow = dynamic(() => import("@/components/flows/ExportFlow").then(mod => ({ default: mod.ExportFlow })), {
  ssr: false
});

const FlowManagement = dynamic(() => import("@/components/flows/FlowManagement").then(mod => ({ default: mod.FlowManagement })), {
  ssr: false
});

const FlowValidation = dynamic(() => import("@/components/flows/FlowValidation").then(mod => ({ default: mod.FlowValidation })), {
  ssr: false
});

const AutoSave = dynamic(() => import("@/components/flows/AutoSave").then(mod => ({ default: mod.AutoSave })), {
  ssr: false
});

const KeyboardShortcuts = dynamic(() => import("@/components/flows/KeyboardShortcuts").then(mod => ({ default: mod.KeyboardShortcuts })), {
  ssr: false
});

const FlowNameInput = dynamic(() => import("@/components/flows/FlowNameInput").then(mod => ({ default: mod.FlowNameInput })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-10 w-64"></div>
});

const YogaAIDemo = dynamic(() => import("@/components/flows/YogaAIDemo"), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-64"></div>
});

const FlowTemplates = dynamic(() => import("@/components/flows/FlowTemplates").then(mod => ({ default: mod.FlowTemplates })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-48"></div>
});

const QuickActions = dynamic(() => import("@/components/dashboard/QuickActions").then(mod => ({ default: mod.QuickActions })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-32"></div>
});


const AdaptiveFlow = dynamic(() => import("@/components/ai/AdaptiveFlow").then(mod => ({ default: mod.AdaptiveFlow })), {
  ssr: false
});

const PoseAnalysisSettings = dynamic(() => import("@/components/pose-analysis").then(mod => ({ default: mod.PoseAnalysisSettings })), {
  ssr: false
});

const ProgressTracking = dynamic(() => import("@/components/pose-analysis").then(mod => ({ default: mod.ProgressTracking })), {
  ssr: false
});

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function CreateFlowPage() {
  const searchParams = useSearchParams();
  
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
  const [showCustomSettings, setShowCustomSettings] = useState<boolean>(false);
  const [showFlowTemplates, setShowFlowTemplates] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // --- Import Flow Functionality ---
  useEffect(() => {
    const importData = searchParams?.get('import');
    if (importData) {
      try {
        const flowData = parseSharedFlowData(importData);
        if (flowData) {
          // Import the flow data
          setFlowName(flowData.name || 'Imported Flow');
          
          // Convert poses to PoseId array
          const importedFlow = flowData.poses.map(pose => pose.pose_id as PoseId);
          setFlow(importedFlow);
          
          // Set duration overrides
          const newOverrides: Record<number, number> = {};
          flowData.poses.forEach((pose, index) => {
            if (pose.duration !== 30) { // Default duration
              newOverrides[index] = pose.duration;
            }
          });
          setOverrides(newOverrides);
          
          // Set other parameters based on flow data
          setMinutes(Math.round(flowData.totalDuration / 60));
          if (flowData.difficulty === 'beginner') setIntensity(2);
          else if (flowData.difficulty === 'intermediate') setIntensity(3);
          else if (flowData.difficulty === 'advanced') setIntensity(4);
          
          // Show success message
          setTimeout(() => {
            alert(`Flow "${flowData.name}" imported successfully! You can now modify and save it.`);
          }, 500);
        }
      } catch (error) {
        console.error('Error importing flow:', error);
        alert('Failed to import flow. The data may be corrupted.');
      }
    }
  }, [searchParams]);
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
    // Check for real authentication state - in production, this would check actual auth tokens
    const checkAuth = () => {
      // Check for authentication token or session
      const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const isAuthenticated = Boolean(authToken);
      
      if (isAuthenticated) {
        const mockUserId = 'user-' + Math.random().toString(36).substr(2, 9);
        setUserId(mockUserId);
        setIsLoggedIn(true);
      } else {
        setUserId(null);
        setIsLoggedIn(false);
      }
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

  const handleCustomButtonClick = () => {
    setShowFlowTemplates(true);
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
      <header className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Create your sequence</h1>

          </div>
          <KeyboardShortcuts />
        </div>
        
        {/* ✨ Yoga Flow Generator */}
        <div className="mt-6">
          <YogaAIDemo />
        </div>
        
        {/* Quick Start Section */}
        <div className="mt-6">
          <QuickActions onCustomClick={handleCustomButtonClick} />
        </div>

        {/* Flow Templates Section - shown when Custom button is clicked */}
        {showFlowTemplates && (
          <div className="mt-6">
            <FlowTemplates onSelectTemplate={handleSelectTemplate} onCreateOwn={handleCreateOwn} />
          </div>
        )}



        {/* Pose Analysis Settings */}
        <div className="mt-6">
          <PoseAnalysisSettings />
        </div>

        {/* Progress Tracking */}
        <div className="mt-6">
          <ProgressTracking />
        </div>
        
        {/* Conditional Settings Section - only shown when creating own template */}
        {showCustomSettings && (
          <div className="mt-6">
            <ControlPanel {...{ minutes, setMinutes, intensity, setIntensity, focus, setFocus, breathingCues, setBreathingCues, saferSequencing, setSaferSequencing, saveToDevice, setSaveToDevice, timingMode, setTimingMode, secPerBreath, setSecPerBreath, transitionSec, setTransitionSec, cooldownMin, setCooldownMin, onAutoGenerate: handleGenerate, flowName, setFlowName, onSaveFlow: handleSaveFlow }} />
          </div>
        )}
        


        {/* Adaptive Flow Modifications */}
        {flow.length > 0 && (
          <AdaptiveFlow
            currentFlow={{
              poses: flow,
              durations: secondsPerPose,
              totalDuration: totalSeconds
            }}
            userProfile={userProfile}
            onFlowAdapted={handleFlowAdapted}
            className="mt-6"
          />
        )}
        
        {/* Auto-save Section */}
        <div className="mt-4">
          <AutoSave 
            flow={flow}
            overrides={overrides}
            flowName={flowName}
            onRestoreFlow={handleRestoreFlow}
          />
        </div>
        
        {/* Authentication notice for saving */}
        {!isLoggedIn && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Creating as Guest:</strong> You can build flows freely! Sign in to save, export, and access your flows later.
              <a href="/login" className="ml-2 text-amber-600 dark:text-amber-400 hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        )}
      </header>
      
      {/* Main content area with sidebar */}
      <div className="mx-auto max-w-7xl px-4">
        <SavedFlows flows={savedFlows} onLoad={handleLoadFlow} onDelete={handleDeleteFlow} />
        
        {/* Combined Flow Management: Your Flow + Quick Actions + ✨ Flow Review */}
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
          className="mt-6"
        />
        
        <div className="space-y-6 mt-6">
          {/* ✨-Powered Flow Validation */}
          <FlowValidation 
            flow={flow} 
            totalSeconds={totalSeconds} 
            onSaferAlternative={handleSaferAlternative}
            className="mt-6"
          />
          
          {/* Combined ✨ Suggestions and Search Library */}
          <CombinedPoseLibrary onAddPose={addPose} />

          {/* Export Flow Section */}
          {flow.length > 0 && (
            <>
              {isLoggedIn ? (
                <ExportFlow
                  flow={flow}
                  flowName={flowName}
                  totalDuration={totalSeconds}
                  onExportPDF={handleExportPDF}
                  onGenerateShareLink={handleGenerateShareLink}
                  onSaveAsJSON={handleSaveAsJSON}
                />
              ) : (
                <div className="bg-card border border-border rounded-lg p-4 mt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>🔒</span>
                    Export & Share - Sign In Required
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    {/* Share Link - Available for everyone */}
                    <button
                      onClick={handleGenerateShareLink}
                      className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-blue-500">🔗</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">Share Link</div>
                        <div className="text-xs text-muted-foreground">Copy URL (works without login)</div>
                      </div>
                    </button>
                    
                    {/* PDF Export - Requires login */}
                    <div className="flex items-center gap-2 p-3 border border-border rounded-lg opacity-50 cursor-not-allowed">
                      <span className="text-red-500">📄</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">Export PDF</div>
                        <div className="text-xs text-muted-foreground">Requires sign in</div>
                      </div>
                    </div>
                    
                    {/* JSON Download - Requires login */}
                    <div className="flex items-center gap-2 p-3 border border-border rounded-lg opacity-50 cursor-not-allowed">
                      <span className="text-green-500">💾</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">Save to Device</div>
                        <div className="text-xs text-muted-foreground">Requires sign in</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                      <strong>Sign in to unlock full export features:</strong>
                    </p>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 mb-4 space-y-1">
                      <li>• Save flows as PDF with professional formatting</li>
                      <li>• Download flows as JSON files for backup</li>
                      <li>• Save flows to your personal library</li>
                      <li>• Access your flows from any device</li>
                    </ul>
                    <a 
                      href="/login" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Sign In Now
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      

      <GeneratePreviewModal isOpen={!!preview} onClose={() => setPreview(null)} preview={preview} onShuffle={handleGenerate} onAccept={acceptPreview} />
    </div>
  );
}
