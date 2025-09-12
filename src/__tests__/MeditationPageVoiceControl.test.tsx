import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MeditationPage from '../app/(main)/meditation/page';

// Mock the hooks
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

vi.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: () => [
    {
      streak: 0,
      lastSession: null,
      totalSessions: 0,
      totalMinutes: 0,
    },
    vi.fn(),
  ],
}));

vi.mock('../lib/api/ai', () => ({
  generateMeditationScript: vi.fn(),
}));

// Mock components
vi.mock('../components/meditation/MoodInput', () => ({
  MoodInput: () => <div>Mood Input Component</div>,
}));

vi.mock('../components/meditation/GuidedMeditationPlayer', () => ({
  GuidedMeditationPlayer: () => <div>Guided Meditation Player</div>,
}));

vi.mock('../components/meditation/EvolvingBreathingOrb', () => ({
  EvolvingBreathingOrb: () => <div>Breathing Orb</div>,
}));

vi.mock('../components/meditation/MeditationRecommendations', () => ({
  MeditationRecommendations: () => <div>Meditation Recommendations</div>,
}));

vi.mock('../components/ai/PersonalizedAffirmations', () => ({
  PersonalizedAffirmations: () => <div>Personalized Affirmations</div>,
}));

describe('MeditationPage with Voice Control', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the meditation page', () => {
    render(<MeditationPage />);
    
    expect(screen.getByText('Meditation Center')).toBeInTheDocument();
  });

  it('displays empty state message when there are no sessions', () => {
    render(<MeditationPage />);
    
    expect(screen.getByText('Welcome to the Meditation Center')).toBeInTheDocument();
    expect(screen.getByText('Explore Guided Sessions')).toBeInTheDocument();
  });

  it('displays meditation session options', () => {
    render(<MeditationPage />);
    
    expect(screen.getByText('Mindfulness Meditation')).toBeInTheDocument();
    expect(screen.getByText('Box Breathing')).toBeInTheDocument();
    expect(screen.getByText('Body Scan Meditation')).toBeInTheDocument();
    expect(screen.getByText('Loving Kindness')).toBeInTheDocument();
  });

  it('displays custom timer section', () => {
    render(<MeditationPage />);
    
    expect(screen.getByText('Custom Timer')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    expect(screen.getByText('minutes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Timer/i })).toBeInTheDocument();
  });

  it('handles custom timer input changes', () => {
    render(<MeditationPage />);
    
    const timerInput = screen.getByRole('spinbutton');
    fireEvent.change(timerInput, { target: { value: '15' } });
    
    expect(timerInput).toHaveValue(15);
  });

  it('can start meditation sessions', async () => {
    render(<MeditationPage />);
    
    const mindfulnessMeditation = screen.getByText('Mindfulness Meditation');
    const startButton = mindfulnessMeditation.closest('div.border')?.querySelector('button');

    if (startButton) {
      fireEvent.click(startButton);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/5 minute session/i)).toBeInTheDocument();
    });
  });

  it('displays breathing visualizer for breathing exercises', () => {
    render(<MeditationPage />);
    
    const breathingSession = screen.getByText('Box Breathing');
    const breathingButton = breathingSession.closest('div.border')?.querySelector('button');
    
    if (breathingButton) {
      fireEvent.click(breathingButton);
      expect(screen.getByText('Breathing Orb')).toBeInTheDocument();
    }
  });

  it('shows timer controls when session is active', async () => {
    render(<MeditationPage />);
    
    // Start a session
    const mindfulnessMeditation = screen.getByText('Mindfulness Meditation');
    const startButton = mindfulnessMeditation.closest('div.border')?.querySelector('button');

    if (startButton) {
      fireEvent.click(startButton);
    }

    // Should show play/pause controls
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });
  });
});