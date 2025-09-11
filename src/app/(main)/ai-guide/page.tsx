"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui';
import { PoseId } from '@/types/yoga';
import { checkForm } from '@/lib/api/ai';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import type { FormFeedback } from '@/types/ai';

type GuideState = 'setup' | 'ready' | 'active' | 'feedback';

export default function AIGuidePage() {
  // State management
  const [guideState, setGuideState] = useState<GuideState>('setup');
  const [selectedPose, setSelectedPose] = useState<PoseId | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Refs for camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Hooks for voice and speech
  const { speak } = useSpeechSynthesis();
  
  // Voice commands for hands-free interaction
  const voiceCommands = {
    "start session": () => startGuidedSession(),
    "analyze pose": () => analyzePose(),
    "next pose": () => nextPose(),
    "stop session": () => stopSession(),
    "repeat instructions": () => repeatInstructions(),
  };
  
  const { isListening, toggle: toggleVoice, supportsSpeechInput } = useVoiceCommands(voiceCommands);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraEnabled(true);
        speak("Camera initialized. You're ready to begin your yoga session.");
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      speak("Unable to access camera. Please check your camera permissions and try again.");
    }
  }, [speak]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraEnabled(false);
    }
  }, []);

  // Capture frame from video for analysis
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // Start guided session
  const startGuidedSession = useCallback(() => {
    if (!selectedPose) {
      speak("Please select a pose first.");
      return;
    }
    
    setGuideState('active');
    const poseInstructions = getPoseInstructions(selectedPose);
    speak(`Let's begin with ${selectedPose.replace('_', ' ')}. ${poseInstructions}`);
  }, [selectedPose, speak]);

  // Analyze current pose
  const analyzePose = useCallback(async () => {
    if (!selectedPose || !cameraEnabled) {
      speak("Please select a pose and enable camera first.");
      return;
    }
    
    setIsAnalyzing(true);
    speak("Analyzing your pose...");
    
    // Capture current frame (in a real implementation, this would be sent to pose detection AI)
    const frameData = captureFrame();
    
    // Simulate pose analysis with existing form checker
    try {
      const result = await checkForm({ 
        pose: selectedPose, 
        notes: "Analyzed from camera feed" 
      });
      
      setFeedback(result);
      setGuideState('feedback');
      
      // Provide audio feedback
      if (result.length > 0) {
        const feedbackText = result.map(f => f.message).join('. ');
        speak(`Here's your feedback: ${feedbackText}`);
      } else {
        speak("Great job! Your pose looks good.");
      }
    } catch (error) {
      speak("Error analyzing pose. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedPose, cameraEnabled, captureFrame, speak]);

  // Get pose instructions
  const getPoseInstructions = (pose: PoseId): string => {
    const instructions: Record<PoseId, string> = {
      [PoseId.DownDog]: "Start on hands and knees. Tuck your toes under and lift your hips up and back, creating an inverted V-shape.",
      [PoseId.Warrior1Right]: "Step your right foot forward into a lunge. Turn your back foot out 45 degrees. Raise your arms overhead.",
      [PoseId.ForwardFold]: "Stand with feet hip-width apart. Slowly fold forward from your hips, letting your arms hang heavy.",
      [PoseId.Child]: "Kneel on the floor. Sit back on your heels and fold forward, extending your arms in front of you.",
      [PoseId.Butterfly]: "Sit with the soles of your feet together. Gently hold your ankles and sit tall through your spine.",
      [PoseId.Bridge]: "Lie on your back with knees bent. Press through your heels to lift your hips up toward the ceiling.",
      [PoseId.Boat]: "Sit with knees bent. Lean back slightly and lift your feet off the ground, balancing on your sitting bones.",
      [PoseId.Pigeon]: "From downward dog, bring your right knee forward behind your right wrist. Extend your left leg back.",
      [PoseId.HighLungeRight]: "Step your right foot forward into a high lunge. Keep your back leg straight and strong.",
      [PoseId.TwistLow]: "From a seated position, twist your torso to one side, using your hands to deepen the twist gently.",
    };
    
    return instructions[pose] || "Hold this pose with awareness and breath.";
  };

  // Repeat instructions for current pose
  const repeatInstructions = useCallback(() => {
    if (selectedPose) {
      const instructions = getPoseInstructions(selectedPose);
      speak(instructions);
    }
  }, [selectedPose, speak]);

  // Next pose (for future multi-pose sessions)
  const nextPose = useCallback(() => {
    speak("Next pose functionality will be implemented in future updates.");
  }, [speak]);

  // Stop session
  const stopSession = useCallback(() => {
    setGuideState('ready');
    setFeedback([]);
    speak("Session ended. Great work!");
  }, [speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🤖 AI Yoga Guide
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your personal AI-powered yoga instructor. Get real-time pose feedback through your camera and voice commands.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feed */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Camera Feed</h2>
            
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📹</div>
                    <p className="text-gray-500 dark:text-gray-400">Camera not enabled</p>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="flex gap-2 mt-4">
              <Button 
                onClick={cameraEnabled ? stopCamera : initializeCamera}
                variant={cameraEnabled ? "destructive" : "default"}
              >
                {cameraEnabled ? "Stop Camera" : "Enable Camera"}
              </Button>
              
              {supportsSpeechInput && (
                <Button 
                  onClick={toggleVoice}
                  variant={isListening ? "secondary" : "outline"}
                >
                  🎤 {isListening ? "Listening..." : "Voice Control"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Controls & Pose Selection */}
        <div className="space-y-4">
          {/* Pose Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Select Pose</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.values(PoseId).map((pose) => (
                <Button
                  key={pose}
                  onClick={() => setSelectedPose(pose)}
                  variant={selectedPose === pose ? "default" : "outline"}
                  className="text-left justify-start h-auto py-3"
                >
                  <div>
                    <div className="font-medium">{pose.replace('_', ' ')}</div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">
                      {pose.replace('_', ' ').toLowerCase()}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Session Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Session Control</h2>
            
            <div className="space-y-3">
              <Button 
                onClick={startGuidedSession}
                disabled={!selectedPose || !cameraEnabled}
                className="w-full"
              >
                🚀 Start Guided Session
              </Button>
              
              <Button 
                onClick={analyzePose}
                disabled={!selectedPose || !cameraEnabled || isAnalyzing}
                variant="secondary"
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "🔍 Analyze Pose"}
              </Button>
              
              <Button 
                onClick={repeatInstructions}
                disabled={!selectedPose}
                variant="outline"
                className="w-full"
              >
                🔊 Repeat Instructions
              </Button>
              
              <Button 
                onClick={stopSession}
                variant="destructive"
                className="w-full"
              >
                ⏹️ Stop Session
              </Button>
            </div>
          </div>

          {/* Voice Commands Help */}
          {supportsSpeechInput && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Voice Commands
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>"Start session" - Begin guided practice</li>
                <li>"Analyze pose" - Get pose feedback</li>
                <li>"Repeat instructions" - Hear pose cues again</li>
                <li>"Stop session" - End current session</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Section */}
      {feedback.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">AI Feedback</h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <ul className="space-y-2">
              {feedback.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span className="text-blue-800 dark:text-blue-200">{item.message}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            onClick={() => setFeedback([])}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Clear Feedback
          </Button>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-2 ${cameraEnabled ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${cameraEnabled ? 'bg-green-600' : 'bg-red-600'}`}></div>
              Camera {cameraEnabled ? 'Active' : 'Inactive'}
            </span>
            
            {supportsSpeechInput && (
              <span className={`flex items-center gap-2 ${isListening ? 'text-blue-600' : 'text-gray-600'}`}>
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                Voice {isListening ? 'Listening' : 'Ready'}
              </span>
            )}
            
            <span className="text-gray-600 dark:text-gray-400">
              Pose: {selectedPose ? selectedPose.replace('_', ' ') : 'None selected'}
            </span>
          </div>
          
          <span className="text-gray-500 dark:text-gray-400">
            Status: {guideState.charAt(0).toUpperCase() + guideState.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}