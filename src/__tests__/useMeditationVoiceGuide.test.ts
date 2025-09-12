import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMeditationVoiceGuide } from '../hooks/useMeditationVoiceGuide';

// Mock the hooks
const mockToggle = vi.fn();
const mockSpeak = vi.fn();

vi.mock('../hooks/useVoiceCommands', () => ({
  useVoiceCommands: () => ({
    isListening: false,
    toggle: mockToggle,
    supportsSpeechInput: true,
  }),
}));

vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({
    speak: mockSpeak,
    voices: [],
    voiceName: '',
    setVoiceName: vi.fn(),
  }),
}));

describe('useMeditationVoiceGuide', () => {
  const mockProps = {
    onStartMeditation: vi.fn(),
    onPauseMeditation: vi.fn(),
    onResumeMeditation: vi.fn(),
    onStopMeditation: vi.fn(),
    onSetTimer: vi.fn(),
    onAddTime: vi.fn(),
    onGetTimeRemaining: vi.fn(() => '5 minutes'),
    onResetTimer: vi.fn(),
    onRepeatInstruction: vi.fn(),
    onNextSection: vi.fn(),
    isPlaying: false,
    timeRemaining: 300,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useMeditationVoiceGuide(mockProps));

    expect(result.current.state).toBe('idle');
    expect(result.current.isVoiceEnabled).toBe(false);
    expect(result.current.isListening).toBe(false);
    expect(result.current.supportsSpeechInput).toBe(true);
  });

  it('toggles voice guide on and off', () => {
    const { result } = renderHook(() => useMeditationVoiceGuide(mockProps));

    act(() => {
      result.current.toggleVoiceGuide();
    });

    expect(result.current.isVoiceEnabled).toBe(true);

    act(() => {
      result.current.toggleVoiceGuide();
    });

    expect(result.current.isVoiceEnabled).toBe(false);
  });

  it('provides meditation guidance using speech synthesis', () => {
    const { result } = renderHook(() => useMeditationVoiceGuide(mockProps));

    act(() => {
      result.current.provideMeditationGuidance('Take a deep breath');
    });

    expect(mockSpeak).toHaveBeenCalledWith('Take a deep breath');
    expect(result.current.state).toBe('speaking');
  });

  it('provides encouragement using speech synthesis', () => {
    const { result } = renderHook(() => useMeditationVoiceGuide(mockProps));

    act(() => {
      result.current.provideEncouragement();
    });

    expect(mockSpeak).toHaveBeenCalled();
    expect(result.current.state).toBe('speaking');
  });

  it('calls voice command functions correctly', () => {
    const { result } = renderHook(() => useMeditationVoiceGuide(mockProps));

    act(() => {
      result.current.toggleVoiceGuide(); // Enable voice
    });

    act(() => {
      result.current.startListening();
    });

    expect(mockToggle).toHaveBeenCalled();
    // Test that the function is called, not the internal state which depends on useEffect timing
  });

  it('stops listening', () => {
    const { result } = renderHook(() => useMeditationVoiceGuide(mockProps));

    act(() => {
      result.current.toggleVoiceGuide(); // Enable voice
    });

    act(() => {
      result.current.startListening();
    });

    act(() => {
      result.current.stopListening();
    });

    expect(result.current.state).toBe('idle');
  });

  it('offers guidance when voice is enabled', () => {
    const { result } = renderHook(() => useMeditationVoiceGuide(mockProps));

    act(() => {
      result.current.toggleVoiceGuide(); // Enable voice
    });

    act(() => {
      result.current.offerGuidance();
    });

    expect(result.current.state).toBe('speaking');
  });

  it('handles speech response correctly', () => {
    const { result } = renderHook(() => useMeditationVoiceGuide(mockProps));

    act(() => {
      result.current.speakResponse('Test message');
    });

    expect(result.current.state).toBe('speaking');
  });
});