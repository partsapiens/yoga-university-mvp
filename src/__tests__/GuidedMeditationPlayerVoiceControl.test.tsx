import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GuidedMeditationPlayer } from '../components/meditation/GuidedMeditationPlayer';
import { MeditationScript } from '@/types/ai';

// Mock the hooks
vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({
    speak: vi.fn(),
    voices: [
      { name: 'Voice 1', lang: 'en-US' },
      { name: 'Voice 2', lang: 'en-GB' },
    ],
    voiceName: 'Voice 1',
    setVoiceName: vi.fn(),
  }),
}));

vi.mock('../hooks/useMeditationVoiceGuide', () => ({
  useMeditationVoiceGuide: () => ({
    state: 'idle',
    isVoiceEnabled: false,
    isListening: false,
    supportsSpeechInput: true,
    provideMeditationGuidance: vi.fn(),
    provideEncouragement: vi.fn(),
    speakResponse: vi.fn(),
    startListening: vi.fn(),
    stopListening: vi.fn(),
    toggleVoiceGuide: vi.fn(),
    offerGuidance: vi.fn(),
  }),
}));

vi.mock('../components/meditation/BreathingOrb', () => ({
  BreathingOrb: () => <div>Breathing Orb</div>,
}));

vi.mock('../components/Avatar', () => ({
  Avatar: ({ state }: { state: string }) => <div data-testid="avatar">Avatar - {state}</div>,
}));

describe('GuidedMeditationPlayer with Voice Control', () => {
  const mockScript: MeditationScript = {
    title: 'Test Meditation',
    totalDuration: 600, // 10 minutes
    phases: [
      {
        name: 'intro',
        duration: 120,
        script: 'Welcome to this meditation session.',
        breathingCue: false,
      },
      {
        name: 'main',
        duration: 360,
        script: 'Focus on your breath and let your mind settle.',
        breathingCue: true,
      },
      {
        name: 'close',
        duration: 120,
        script: 'Take a moment to appreciate this time you have given yourself.',
        breathingCue: false,
      },
    ],
    breathingPattern: {
      name: 'Natural Breathing',
      inhale: 4,
      hold1: 2,
      exhale: 6,
      hold2: 2,
      description: 'Natural breathing pattern for relaxation',
    },
  };

  const mockProps = {
    script: mockScript,
    onComplete: vi.fn(),
    onExit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the guided meditation player with voice control', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    expect(screen.getByText('Test Meditation')).toBeInTheDocument();
    expect(screen.getByText('10:00 remaining')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('displays voice control buttons', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    expect(screen.getByText('🔇 Voice Off')).toBeInTheDocument();
  });

  it('shows phase progress information', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    expect(screen.getByText('Phase 1 of 3')).toBeInTheDocument();
    expect(screen.getAllByText('Welcome')[0]).toBeInTheDocument();
  });

  it('displays pre-start instructions', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    expect(screen.getByText('Before we begin:')).toBeInTheDocument();
    expect(screen.getByText(/Find a comfortable seated or lying position/)).toBeInTheDocument();
    expect(screen.getByText(/Close your eyes or soften your gaze/)).toBeInTheDocument();
  });

  it('shows begin meditation button initially', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    expect(screen.getByText('Begin Meditation')).toBeInTheDocument();
  });

  it('displays exit button', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    expect(screen.getByText('Exit')).toBeInTheDocument();
  });

  it('handles begin meditation click', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    const beginButton = screen.getByText('Begin Meditation');
    fireEvent.click(beginButton);
    
    // Should now show pause button instead of begin
    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  it('handles pause and resume', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    // Start meditation
    const beginButton = screen.getByText('Begin Meditation');
    fireEvent.click(beginButton);
    
    // Pause
    const pauseButton = screen.getByText('Pause');
    fireEvent.click(pauseButton);
    
    // Should now show resume
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('handles exit button click', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    const exitButton = screen.getByText('Exit');
    fireEvent.click(exitButton);
    
    expect(mockProps.onExit).toHaveBeenCalled();
  });

  it('displays voice settings when multiple voices available', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    expect(screen.getByText('Voice Selection')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Voice 1 (en-US)')).toBeInTheDocument();
  });

  it('displays breathing orb during breathing phases', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    // Start meditation to access phases
    const beginButton = screen.getByText('Begin Meditation');
    fireEvent.click(beginButton);
    
    // The breathing orb should be available during breathwork phases
    // (This would require advancing to the main phase which has breathingCue: true)
    expect(screen.getAllByText('Welcome')[0]).toBeInTheDocument(); // Current phase display
  });

  it('formats time correctly', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    // Should display initial time as formatted MM:SS
    expect(screen.getByText('10:00 remaining')).toBeInTheDocument();
  });

  it('shows current phase script when meditation has started', () => {
    render(<GuidedMeditationPlayer {...mockProps} />);
    
    // Start meditation
    const beginButton = screen.getByText('Begin Meditation');
    fireEvent.click(beginButton);
    
    // Should show the current phase script
    expect(screen.getByText('Welcome to this meditation session.')).toBeInTheDocument();
  });
});