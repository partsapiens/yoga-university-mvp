# Pose Analysis Feature Documentation

## Overview

The Yoga Flow University now includes an advanced computer vision-based pose analysis feature that provides real-time feedback on yoga poses during practice sessions. This feature uses TensorFlow.js and the MoveNet model to analyze user poses through their webcam and provide immediate corrections and improvement suggestions.

## Key Features

### 🎯 **Real-Time Pose Detection**
- Live pose analysis using TensorFlow.js MoveNet model
- Skeleton overlay visualization showing detected body keypoints
- Real-time accuracy scoring for pose alignment

### 🔒 **Privacy-First Design**
- All processing happens locally on the user's device
- No video data or pose information is transmitted to servers
- Complete user privacy and data control

### 📊 **Progress Tracking**
- Local storage of practice sessions and accuracy metrics
- Improvement trends and analytics
- Historical performance data

### 🎙️ **Voice Integration**
- Optional voice feedback for pose corrections
- Integration with existing voice guide system
- Audio suggestions for pose improvements

### ⚙️ **Customizable Settings**
- Adjustable confidence thresholds
- Configurable analysis frequency
- Privacy and feedback preferences

## Technical Implementation

### Core Components

#### `PoseAnalysis.tsx`
Main component that handles:
- Webcam access and video streaming
- TensorFlow.js model initialization
- Real-time pose detection and analysis
- Visual feedback display
- Session tracking

#### `pose-detection.ts`
Core pose detection utilities:
```typescript
export class PoseDetector {
  async initialize(): Promise<void>
  async detectPose(video: HTMLVideoElement): Promise<DetectedPose | null>
  async dispose(): Promise<void>
}
```

Specific pose analysis functions:
- `analyzeDownwardDog()` - Detailed analysis for Downward Dog pose
- `analyzeWarriorI()` - Analysis for Warrior I pose
- `analyzeGenericPose()` - Basic analysis for any pose

#### `pose-analytics.ts`
Progress tracking and analytics:
```typescript
export class PoseAnalytics {
  saveSession(session: PoseSession): void
  getProgressForPose(poseName: string): PoseProgress | null
  getOverallProgress(): OverallProgress
  clearAllData(): void
}
```

### Integration Points

#### Player Component
The pose analysis is seamlessly integrated into the existing flow player:
- Toggle button to enable/disable pose analysis
- Real-time accuracy display
- Visual indicators for pose quality

#### Settings Panel
Comprehensive settings for customization:
- Enable/disable pose analysis
- Auto-start with flow practice
- Confidence threshold adjustment
- Feedback preferences

## Usage

### Basic Usage

1. **Enable Pose Analysis**: Click the camera icon in the player controls
2. **Grant Camera Permission**: Allow webcam access when prompted
3. **Practice**: The system will analyze your poses in real-time
4. **Receive Feedback**: Get immediate visual and optional audio feedback

### Settings Configuration

Access pose analysis settings through the flow creation page:

```typescript
// Example settings object
const settings = {
  enabled: true,
  autoStart: false,
  showSkeleton: true,
  confidenceThreshold: 0.3,
  analysisFrequency: 500,
  voiceFeedback: false,
  visualFeedback: true,
  privacyMode: true,
  saveProgress: true
};
```

### Progress Tracking

View your improvement over time:
- Session-by-session accuracy tracking
- Weekly progress charts
- Pose-specific analytics
- Improvement trend indicators

## Pose Analysis Algorithms

### Downward Dog Analysis
Checks for:
- Spinal alignment (hip-shoulder-wrist angle)
- Arm positioning (shoulder-width apart)
- Leg positioning (hip-width apart)
- Overall pose stability

### Warrior I Analysis
Evaluates:
- Front knee alignment over ankle
- Front thigh angle (parallel to ground)
- Torso uprightness
- Weight distribution

### Generic Pose Analysis
For other poses:
- Overall pose visibility
- Keypoint confidence levels
- Basic stability indicators
- General alignment feedback

## Performance Considerations

### Optimization Strategies
- Analysis frequency throttling (default 500ms)
- Efficient canvas rendering
- Model caching and reuse
- Memory management with proper cleanup

### Browser Compatibility
- Requires modern browsers with WebGL support
- Webcam access permissions needed
- Recommended: Chrome 90+, Firefox 88+, Safari 14+

## Privacy and Security

### Data Handling
- **No server transmission**: All pose data stays on device
- **Local storage only**: Progress data stored in browser localStorage
- **No tracking**: No analytics or usage data collection
- **User control**: Users can clear all data at any time

### Compliance
- GDPR compliant (no personal data collection)
- Transparent data practices
- User consent for camera access
- Clear privacy notices

## API Reference

### Main Classes

```typescript
// Pose Detection
class PoseDetector {
  async initialize(): Promise<void>
  async detectPose(video: HTMLVideoElement): Promise<DetectedPose | null>
  async dispose(): Promise<void>
}

// Analytics
class PoseAnalytics {
  saveSession(session: PoseSession): void
  getProgressForPose(poseName: string): PoseProgress | null
  getAllProgress(): PoseProgress[]
  getOverallProgress(): OverallProgress
  clearAllData(): void
}
```

### Utility Functions

```typescript
// Pose analysis utilities
function calculateAngle(p1: PoseKeypoint, p2: PoseKeypoint, p3: PoseKeypoint): number
function calculateDistance(p1: PoseKeypoint, p2: PoseKeypoint): number
function isKeypointVisible(keypoint: PoseKeypoint, threshold?: number): boolean

// Formatting utilities
function formatDuration(seconds: number): string
function getAccuracyColor(accuracy: number): string
function getAccuracyLabel(accuracy: number): string
```

### Type Definitions

```typescript
interface PoseKeypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

interface DetectedPose {
  keypoints: PoseKeypoint[];
  score: number;
}

interface PoseAnalysisResult {
  pose: DetectedPose | null;
  feedback: string[];
  accuracy: number;
  suggestions: string[];
}

interface PoseSession {
  id: string;
  poseName: string;
  timestamp: number;
  duration: number;
  accuracy: number;
  feedback: string[];
  suggestions: string[];
}
```

## Future Enhancements

### Planned Features
- [ ] Additional pose-specific analysis algorithms
- [ ] Machine learning model fine-tuning
- [ ] Pose sequence flow analysis
- [ ] Social sharing of progress (optional)
- [ ] Offline model caching
- [ ] Performance metrics dashboard

### Technical Improvements
- [ ] WebAssembly optimization
- [ ] Enhanced error handling
- [ ] Better mobile device support
- [ ] Multiple camera angle support
- [ ] Advanced pose correction algorithms

## Troubleshooting

### Common Issues

**Pose not detected:**
- Ensure good lighting conditions
- Check that full body is visible in camera
- Verify camera permissions are granted
- Try adjusting confidence threshold in settings

**Low accuracy scores:**
- Improve lighting setup
- Ensure clear view of all body parts
- Check pose alignment against reference
- Consider clothing contrast with background

**Performance issues:**
- Reduce analysis frequency in settings
- Close other browser tabs using camera
- Check browser compatibility
- Consider device performance limitations

### Browser Support
- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Limited support (iOS Safari may have restrictions)
- **Edge**: Full support

## Contributing

To extend pose analysis functionality:

1. Add new pose analysis functions to `pose-detection.ts`
2. Update the pose mapping in `PoseAnalysis.tsx`
3. Add tests for new functionality
4. Update documentation

Example of adding a new pose:

```typescript
export function analyzeTreePose(pose: DetectedPose): PoseAnalysisResult {
  // Implementation for Tree Pose analysis
  // Check balance, foot placement, etc.
  return {
    pose,
    feedback: [...],
    accuracy: calculatedAccuracy,
    suggestions: [...]
  };
}
```

## License

This pose analysis feature is part of the Yoga Flow University project and follows the same MIT license terms.