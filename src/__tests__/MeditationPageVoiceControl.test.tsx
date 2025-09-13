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
  generatePersonalizedAffirmations: vi.fn().mockResolvedValue(['You are peaceful', 'You are calm']),
}));

// Mock components
vi.mock('../components/meditation/MoodInput', () => ({
  MoodInput: () => <div>Mood Input Component</div>,
}));

vi.mock('../components/meditation/GuidedMeditationPlayer', () => ({
  GuidedMeditationPlayer: () => <div>Guided Meditation Player</div>,
}));

vi.mock('../components/meditation/BreathingOrb', () => ({
  BreathingOrb: () => <div>Breathing Orb</div>,
}));

vi.mock('../components/meditation/MeditationRecommendations', () => ({
  MeditationRecommendations: () => <div>Meditation Recommendations</div>,
}));

vi.mock('../components/Avatar', () => ({
  Avatar: ({ state }: { state: string }) => <div data-testid="avatar">Avatar - {state}</div>,
}));

describe('MeditationPage with Voice Control', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the meditation page with main sections', () => {
    render(<MeditationPage />);
    
    expect(screen.getByText('Meditation Center')).toBeInTheDocument();
    // Your Practice section has been removed
    expect(screen.queryByText('Your Practice')).not.toBeInTheDocument();
    expect(screen.getByText('Guided Sessions')).toBeInTheDocument();
  });

  it('displays meditation session stats', () => {
    render(<MeditationPage />);
    
    // Your Practice section has been removed, so these should no longer be present
    expect(screen.queryByText('Day Streak')).not.toBeInTheDocument();
    expect(screen.queryByText('Total Sessions')).not.toBeInTheDocument();
    expect(screen.queryByText('Minutes Practiced')).not.toBeInTheDocument();
  });

  it('shows meditation session list', () => {
    render(<MeditationPage />);
    
    expect(screen.getByText('Mindfulness Meditation')).toBeInTheDocument();
    expect(screen.getByText('Box Breathing')).toBeInTheDocument();
    expect(screen.getByText('Body Scan Meditation')).toBeInTheDocument();
    expect(screen.getByText('Loving Kindness')).toBeInTheDocument();
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

  it('shows session stats', () => {
    render(<MeditationPage />);
    
    // Your Practice section has been removed, so these should no longer be present
    expect(screen.queryByText('Your Practice')).not.toBeInTheDocument();
    expect(screen.queryByText('Day Streak')).not.toBeInTheDocument();
    expect(screen.queryByText('Total Sessions')).not.toBeInTheDocument();
    expect(screen.queryByText('Minutes Practiced')).not.toBeInTheDocument();
  });

  it('handles custom timer input changes', () => {
    render(<MeditationPage />);
    
    const timerInput = screen.getByRole('spinbutton');
    fireEvent.change(timerInput, { target: { value: '15' } });
    
    expect(timerInput).toHaveValue(15);
  });

  it('can start meditation sessions', () => {
    render(<MeditationPage />);
    
    const startButtons = screen.getAllByText('Start Session');
    expect(startButtons).toHaveLength(5); // 5 meditation techniques
    
    fireEvent.click(startButtons[1]); // Click on Mindfulness Meditation
    
    // Should show timer interface
    expect(screen.getByText('5 minute session')).toBeInTheDocument();
  });

  it('displays breathing visualizer for breathing exercises', () => {
    render(<MeditationPage />);
    
    const breathingSession = screen.getByText('Box Breathing');
    const breathingButton = breathingSession.closest('div')?.querySelector('button');
    
    if (breathingButton) {
      fireEvent.click(breathingButton);
      expect(screen.getByText('Breathing Orb')).toBeInTheDocument();
    }
  });

  it('can start meditation sessions', () => {
    render(<MeditationPage />);
    
    // Should show meditation session start buttons
    const startButtons = screen.getAllByText('Start Session');
    expect(startButtons.length).toBeGreaterThan(0);
    
    // Should be clickable
    fireEvent.click(startButtons[0]);
    // After clicking, breathing meditation section should be visible
    expect(screen.getByText('Breathing Meditation')).toBeInTheDocument();
  });

  it('handles meditation session selection', () => {
    render(<MeditationPage />);
    
    const meditationButtons = screen.getAllByText('Start Session');
    expect(meditationButtons.length).toBeGreaterThan(0);
    
    if (meditationButtons[0]) {
      fireEvent.click(meditationButtons[0]);
      // Should show breathing meditation interface
      expect(screen.getByText('Breathing Meditation')).toBeInTheDocument();
    }
  });
});