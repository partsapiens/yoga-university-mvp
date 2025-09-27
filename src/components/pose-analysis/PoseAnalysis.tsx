"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, Settings, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { PoseId } from '@/types/yoga';

// Dynamic imports for pose detection to reduce initial bundle size
const loadPoseDetection = () => import('@/lib/pose-detection');
const loadPoseAnalytics = () => import('@/lib/pose-analytics');

// Type definitions for pose analysis
interface PoseAnalysisResult {
  score: number;
  feedback: string[];
  keypoints?: any[];
  timestamp: number;
}

// Define session interface locally to avoid circular imports
interface PoseSession {
  id: string;
  poseName: string;
  timestamp: number;
  duration: number;
  accuracy: number;
  feedback: string[];
  suggestions: string[];
}

interface PoseAnalysisProps {
  currentPoseId: PoseId;
  poseName: string;
  isActive: boolean;
  onAnalysisUpdate?: (result: PoseAnalysisResult) => void;
  className?: string;
}

export function PoseAnalysis({ 
  currentPoseId, 
  poseName, 
  isActive, 
  onAnalysisUpdate,
  className = '' 
}: PoseAnalysisProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const analyticsRef = useRef<any>(null);
  const sessionStartRef = useRef<number>(0);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionAccuracies, setSessionAccuracies] = useState<number[]>([]);

  // Initialize pose detector with dynamic import
  useEffect(() => {
    const initDetector = async () => {
      if (detectorRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        // Dynamically load pose detection modules
        const [poseDetectionModule, poseAnalyticsModule] = await Promise.all([
          loadPoseDetection(),
          loadPoseAnalytics()
        ]);
        
        const detector = new poseDetectionModule.PoseDetector();
        analyticsRef.current = new poseAnalyticsModule.PoseAnalytics();
        await detector.initialize();
        detectorRef.current = detector;
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize pose detector:', err);
        setError('Failed to initialize pose detection. Please ensure you have a compatible browser.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isActive) {
      initDetector();
    }

    return () => {
      if (detectorRef.current) {
        detectorRef.current.dispose();
        detectorRef.current = null;
      }
    };
  }, [isActive]);

  // Start/stop camera based on active state
  useEffect(() => {
    if (isActive && isInitialized && !isCameraActive) {
      startCamera();
    } else if (!isActive && isCameraActive) {
      stopCamera();
    }

    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, [isActive, isInitialized]);

  // Start pose analysis when camera is active
  useEffect(() => {
    if (isCameraActive && isActive && detectorRef.current) {
      startPoseAnalysis();
      sessionStartRef.current = Date.now();
      setSessionAccuracies([]);
    } else {
      stopPoseAnalysis();
      // Save session when stopping
      if (sessionStartRef.current > 0) {
        saveCurrentSession();
      }
    }

    return () => {
      stopPoseAnalysis();
    };
  }, [isCameraActive, isActive, currentPoseId]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Failed to start camera:', err);
      setError('camera_denied'); // Set specific error type for better handling
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    setCurrentAnalysis(null);
  };

  const startPoseAnalysis = () => {
    if (analysisIntervalRef.current) return;

    setIsAnalyzing(true);
    
    analysisIntervalRef.current = setInterval(async () => {
      if (!detectorRef.current || !videoRef.current || !isActive) return;

      try {
        const pose = await detectorRef.current.detectPose(videoRef.current);
        
        if (pose) {
          const analysis = await analyzePoseForCurrentPose(pose);
          setCurrentAnalysis(analysis);
          
          // Track accuracy for session
          setSessionAccuracies(prev => [...prev, analysis.score].slice(-10)); // Keep last 10
          
          if (onAnalysisUpdate) {
            onAnalysisUpdate(analysis);
          }

          // Draw pose on canvas
          drawPoseOnCanvas(pose);
        } else {
          setCurrentAnalysis(null);
        }
      } catch (err) {
        console.error('Error during pose analysis:', err);
      }
    }, 500); // Analyze every 500ms for performance
  };

  const stopPoseAnalysis = () => {
    setIsAnalyzing(false);
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  const analyzePoseForCurrentPose = async (pose: any): Promise<PoseAnalysisResult> => {
    // Load analysis functions dynamically when needed
    const poseDetectionModule = await loadPoseDetection();
    
    let originalResult: any;
    switch (currentPoseId) {
      case PoseId.DownDog:
        originalResult = poseDetectionModule.analyzeDownwardDog(pose);
        break;
      case PoseId.Warrior1Right:
        originalResult = poseDetectionModule.analyzeWarriorI(pose);
        break;
      default:
        originalResult = poseDetectionModule.analyzeGenericPose(pose, poseName);
        break;
    }
    
    // Adapt the result to match our interface
    return {
      score: originalResult.accuracy || 0,
      feedback: originalResult.feedback || [],
      keypoints: originalResult.pose?.keypoints || [],
      timestamp: Date.now(),
    };
  };

  const drawPoseOnCanvas = (pose: any) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw keypoints
    pose.keypoints.forEach((keypoint: any) => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#00ff00';
        ctx.fill();
      }
    });

    // Draw skeleton connections
    const connections = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle']
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    connections.forEach(([from, to]) => {
      const fromPoint = pose.keypoints.find((kp: any) => kp.name === from);
      const toPoint = pose.keypoints.find((kp: any) => kp.name === to);

      if (fromPoint && toPoint && fromPoint.score > 0.3 && toPoint.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(fromPoint.x, fromPoint.y);
        ctx.lineTo(toPoint.x, toPoint.y);
        ctx.stroke();
      }
    });
  };

  const saveCurrentSession = () => {
    if (sessionStartRef.current === 0 || sessionAccuracies.length === 0) return;

    const duration = Math.round((Date.now() - sessionStartRef.current) / 1000);
    const averageAccuracy = Math.round(
      sessionAccuracies.reduce((sum, acc) => sum + acc, 0) / sessionAccuracies.length
    );

    const session: PoseSession = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      poseName,
      timestamp: sessionStartRef.current,
      duration,
      accuracy: averageAccuracy,
      feedback: currentAnalysis?.feedback || [],
      suggestions: [] // No suggestions in simplified interface
    };

    analyticsRef.current.saveSession(session);
    sessionStartRef.current = 0;
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else if (isInitialized) {
      startCamera();
    }
  };

  const resetAnalysis = () => {
    setCurrentAnalysis(null);
    setSessionAccuracies([]);
    setError(null);
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className={`pose-analysis bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-white text-sm font-medium">Pose Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCamera(!showCamera)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title={showCamera ? 'Hide camera' : 'Show camera'}
          >
            {showCamera ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={resetAnalysis}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Reset analysis"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={toggleCamera}
            className={`p-1 transition-colors ${
              isCameraActive ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-white'
            }`}
            title={isCameraActive ? 'Stop camera' : 'Start camera'}
          >
            {isCameraActive ? <Camera size={16} /> : <CameraOff size={16} />}
          </button>
        </div>
      </div>

      {/* Video and Canvas Container */}
      {showCamera && (
        <div className="relative bg-black">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            muted
            playsInline
            style={{ transform: 'scaleX(-1)' }} // Mirror the video
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ transform: 'scaleX(-1)' }} // Mirror the canvas
          />
          
          {/* Accuracy Overlay */}
          {currentAnalysis && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
              <div className="text-lg font-bold">
                {currentAnalysis.accuracy}%
              </div>
              <div className="text-xs text-gray-300">Accuracy</div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2" />
                <div>Initializing...</div>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center p-4">
              {error === 'camera_denied' ? (
                <div className="text-white text-center max-w-sm">
                  <div className="text-4xl mb-4">📹</div>
                  <h3 className="text-lg font-semibold mb-2">Camera Access Needed</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    To provide real-time pose feedback, please allow camera access in your browser.
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setError(null);
                        if (isInitialized) startCamera();
                      }}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      Try Again
                    </button>
                    <a
                      href="/poses"
                      className="block w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors text-center"
                    >
                      Browse Pose Library Instead
                    </a>
                  </div>
                  <div className="mt-4 p-3 bg-blue-900/30 rounded text-xs text-blue-200">
                    <p className="font-medium mb-1">Help: Enable camera access</p>
                    <p>Click the camera icon in your browser&apos;s address bar and select &ldquo;Allow&rdquo;</p>
                  </div>
                </div>
              ) : (
                <div className="text-white text-center">
                  <div className="mb-2">⚠️</div>
                  <div className="text-sm mb-3">{error}</div>
                  <button
                    onClick={() => {
                      setError(null);
                      if (isInitialized) startCamera();
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Feedback Panel */}
      {currentAnalysis && (
        <div className="p-4 space-y-3">
          {/* Feedback */}
          {currentAnalysis.feedback.length > 0 ? (
            <div>
              <h4 className="text-white text-sm font-medium mb-2">Feedback</h4>
              <div className="space-y-1">
                {currentAnalysis.feedback.map((feedback: string, index: number) => (
                  <div key={index} className="text-green-400 text-xs">
                    {feedback}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Suggestions section removed since it's not in the simplified interface */}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          🔒 All pose analysis is processed locally on your device. No video data is sent to servers.
        </div>
      </div>
    </div>
  );
}