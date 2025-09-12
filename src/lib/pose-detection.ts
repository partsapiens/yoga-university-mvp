import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';

export interface PoseKeypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

export interface DetectedPose {
  keypoints: PoseKeypoint[];
  score: number;
}

export interface PoseAnalysisResult {
  pose: DetectedPose | null;
  feedback: string[];
  accuracy: number;
  suggestions: string[];
}

export class PoseDetector {
  private detector: poseDetection.PoseDetector | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Ensure TensorFlow.js is ready
      await tf.ready();
      
      // Create the pose detector
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
      );
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize pose detector:', error);
      throw new Error('Failed to initialize pose detection. Please check your browser compatibility.');
    }
  }

  async detectPose(video: HTMLVideoElement): Promise<DetectedPose | null> {
    if (!this.detector || !this.isInitialized) {
      throw new Error('Pose detector not initialized');
    }

    try {
      const poses = await this.detector.estimatePoses(video);
      
      if (poses.length === 0) {
        return null;
      }

      const pose = poses[0];
      
      return {
        keypoints: pose.keypoints.map(kp => ({
          x: kp.x,
          y: kp.y,
          score: kp.score || 0,
          name: kp.name || ''
        })),
        score: pose.score || 0
      };
    } catch (error) {
      console.error('Error detecting pose:', error);
      return null;
    }
  }

  async dispose(): Promise<void> {
    if (this.detector) {
      this.detector.dispose();
      this.detector = null;
      this.isInitialized = false;
    }
  }
}

// Utility functions for pose analysis
export function calculateAngle(p1: PoseKeypoint, p2: PoseKeypoint, p3: PoseKeypoint): number {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return angle;
}

export function getKeypointByName(pose: DetectedPose, name: string): PoseKeypoint | null {
  return pose.keypoints.find(kp => kp.name === name) || null;
}

export function calculateDistance(p1: PoseKeypoint, p2: PoseKeypoint): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function isKeypointVisible(keypoint: PoseKeypoint, threshold: number = 0.3): boolean {
  return keypoint.score >= threshold;
}

// Pose-specific analysis functions
export function analyzeDownwardDog(pose: DetectedPose): PoseAnalysisResult {
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let accuracy = 0;

  const leftWrist = getKeypointByName(pose, 'left_wrist');
  const rightWrist = getKeypointByName(pose, 'right_wrist');
  const leftAnkle = getKeypointByName(pose, 'left_ankle');
  const rightAnkle = getKeypointByName(pose, 'right_ankle');
  const leftShoulder = getKeypointByName(pose, 'left_shoulder');
  const rightShoulder = getKeypointByName(pose, 'right_shoulder');
  const leftHip = getKeypointByName(pose, 'left_hip');
  const rightHip = getKeypointByName(pose, 'right_hip');

  if (!leftWrist || !rightWrist || !leftAnkle || !rightAnkle || 
      !leftShoulder || !rightShoulder || !leftHip || !rightHip) {
    return {
      pose,
      feedback: ['Unable to detect all key body points. Ensure your full body is visible.'],
      accuracy: 0,
      suggestions: ['Move back from the camera to show your entire body']
    };
  }

  // Check if keypoints are visible enough
  const visibilityThreshold = 0.4;
  const keyPoints = [leftWrist, rightWrist, leftAnkle, rightAnkle, leftShoulder, rightShoulder, leftHip, rightHip];
  const visiblePoints = keyPoints.filter(kp => isKeypointVisible(kp, visibilityThreshold));

  if (visiblePoints.length < keyPoints.length * 0.7) {
    return {
      pose,
      feedback: ['Some body parts are not clearly visible. Adjust lighting and position.'],
      accuracy: 0,
      suggestions: ['Ensure good lighting and clear view of your body']
    };
  }

  let scoreComponents = 0;
  let totalComponents = 0;

  // Check spine alignment (hip to shoulder line should be relatively straight)
  totalComponents++;
  const leftSpineAngle = calculateAngle(leftHip, leftShoulder, leftWrist);
  const rightSpineAngle = calculateAngle(rightHip, rightShoulder, rightWrist);
  const avgSpineAngle = (leftSpineAngle + rightSpineAngle) / 2;
  
  if (avgSpineAngle > 160 && avgSpineAngle < 200) {
    feedback.push('Good spinal alignment! 👍');
    scoreComponents++;
  } else if (avgSpineAngle < 160) {
    feedback.push('Try to lengthen your spine more');
    suggestions.push('Press your hands firmly into the ground and lift your hips higher');
  } else {
    feedback.push('Avoid over-arching your back');
    suggestions.push('Engage your core and draw your belly button toward your spine');
  }

  // Check arm positioning
  totalComponents++;
  const armWidth = calculateDistance(leftWrist, rightWrist);
  const shoulderWidth = calculateDistance(leftShoulder, rightShoulder);
  const armToShoulderRatio = armWidth / shoulderWidth;
  
  if (armToShoulderRatio > 0.8 && armToShoulderRatio < 1.3) {
    feedback.push('Good arm positioning! 👍');
    scoreComponents++;
  } else if (armToShoulderRatio < 0.8) {
    feedback.push('Try widening your arms');
    suggestions.push('Place your hands shoulder-width apart');
  } else {
    feedback.push('Bring your arms closer together');
    suggestions.push('Align your wrists under your shoulders');
  }

  // Check leg positioning
  totalComponents++;
  const legWidth = calculateDistance(leftAnkle, rightAnkle);
  const hipWidth = calculateDistance(leftHip, rightHip);
  const legToHipRatio = legWidth / hipWidth;
  
  if (legToHipRatio > 0.8 && legToHipRatio < 1.4) {
    feedback.push('Good leg positioning! 👍');
    scoreComponents++;
  } else {
    feedback.push('Adjust your leg width');
    suggestions.push('Place your feet hip-width apart');
  }

  accuracy = totalComponents > 0 ? (scoreComponents / totalComponents) * 100 : 0;

  // Add general suggestions if accuracy is low
  if (accuracy < 60) {
    suggestions.push('Focus on creating an inverted V-shape with your body');
    suggestions.push('Ground through your hands and lift through your sit bones');
  }

  return {
    pose,
    feedback,
    accuracy: Math.round(accuracy),
    suggestions
  };
}

export function analyzeWarriorI(pose: DetectedPose): PoseAnalysisResult {
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let accuracy = 0;

  const leftKnee = getKeypointByName(pose, 'left_knee');
  const rightKnee = getKeypointByName(pose, 'right_knee');
  const leftAnkle = getKeypointByName(pose, 'left_ankle');
  const rightAnkle = getKeypointByName(pose, 'right_ankle');
  const leftHip = getKeypointByName(pose, 'left_hip');
  const rightHip = getKeypointByName(pose, 'right_hip');
  const leftShoulder = getKeypointByName(pose, 'left_shoulder');
  const rightShoulder = getKeypointByName(pose, 'right_shoulder');

  if (!leftKnee || !rightKnee || !leftAnkle || !rightAnkle || 
      !leftHip || !rightHip || !leftShoulder || !rightShoulder) {
    return {
      pose,
      feedback: ['Unable to detect all key body points. Ensure your full body is visible.'],
      accuracy: 0,
      suggestions: ['Step back from the camera to show your entire body']
    };
  }

  let scoreComponents = 0;
  let totalComponents = 0;

  // Check front knee alignment (should be over ankle)
  totalComponents++;
  const frontLegSide = leftKnee.y > rightKnee.y ? 'left' : 'right';
  const frontKnee = frontLegSide === 'left' ? leftKnee : rightKnee;
  const frontAnkle = frontLegSide === 'left' ? leftAnkle : rightAnkle;
  
  const kneeAnkleDistance = Math.abs(frontKnee.x - frontAnkle.x);
  const legLength = calculateDistance(frontKnee, frontAnkle);
  
  if (kneeAnkleDistance < legLength * 0.2) {
    feedback.push('Great front knee alignment! 👍');
    scoreComponents++;
  } else {
    feedback.push('Align your front knee over your ankle');
    suggestions.push('Step your front foot forward or back to align knee over ankle');
  }

  // Check front thigh angle (should be close to parallel with ground)
  totalComponents++;
  const frontHip = frontLegSide === 'left' ? leftHip : rightHip;
  const thighAngle = Math.abs(Math.atan2(frontKnee.y - frontHip.y, frontKnee.x - frontHip.x) * 180 / Math.PI);
  
  if (thighAngle > 70 && thighAngle < 110) {
    feedback.push('Good depth in your front leg! 👍');
    scoreComponents++;
  } else if (thighAngle < 70) {
    feedback.push('Try to sink deeper into the lunge');
    suggestions.push('Lower your hips to bring your front thigh closer to parallel');
  } else {
    feedback.push('Good starting position, you can deepen the pose');
    suggestions.push('Gradually lower your hips for a deeper stretch');
  }

  // Check torso uprightness
  totalComponents++;
  const torsoAngle = Math.abs(Math.atan2(leftShoulder.y - leftHip.y, leftShoulder.x - leftHip.x) * 180 / Math.PI);
  
  if (torsoAngle > 80 && torsoAngle < 100) {
    feedback.push('Excellent upright posture! 👍');
    scoreComponents++;
  } else {
    feedback.push('Keep your torso upright');
    suggestions.push('Lengthen through the crown of your head and engage your core');
  }

  accuracy = totalComponents > 0 ? (scoreComponents / totalComponents) * 100 : 0;

  if (accuracy < 60) {
    suggestions.push('Focus on grounding through your feet and lifting through your crown');
    suggestions.push('Keep your hips square and facing forward');
  }

  return {
    pose,
    feedback,
    accuracy: Math.round(accuracy),
    suggestions
  };
}

// Generic pose analysis for poses without specific implementations
export function analyzeGenericPose(pose: DetectedPose, poseName: string): PoseAnalysisResult {
  const feedback: string[] = [];
  const suggestions: string[] = [];

  // Check overall pose visibility and stability
  const visibleKeypoints = pose.keypoints.filter(kp => isKeypointVisible(kp, 0.3));
  const visibilityRatio = visibleKeypoints.length / pose.keypoints.length;
  
  let accuracy = Math.round(visibilityRatio * 80); // Base accuracy on visibility

  if (visibilityRatio > 0.8) {
    feedback.push('Good pose visibility! 👍');
  } else if (visibilityRatio > 0.6) {
    feedback.push('Most of your pose is visible');
    suggestions.push('Adjust your position for better camera view');
  } else {
    feedback.push('Some body parts are not clearly visible');
    suggestions.push('Move to ensure your full body is in frame');
    suggestions.push('Check your lighting and camera angle');
  }

  // Add general pose suggestions
  suggestions.push(`Focus on proper alignment for ${poseName}`);
  suggestions.push('Breathe deeply and hold the pose mindfully');
  suggestions.push('Listen to your body and modify as needed');

  return {
    pose,
    feedback,
    accuracy,
    suggestions
  };
}