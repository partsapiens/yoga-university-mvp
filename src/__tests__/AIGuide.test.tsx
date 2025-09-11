import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIGuidePage from '../app/(main)/ai-guide/page';

// Mock the hooks
vi.mock('../hooks/useVoiceCommands', () => ({
  useVoiceCommands: () => ({
    isListening: false,
    toggle: vi.fn(),
    supportsSpeechInput: true,
  }),
}));

vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({
    speak: vi.fn(),
    voices: [],
    voiceName: '',
    setVoiceName: vi.fn(),
  }),
}));

vi.mock('../lib/api/ai', () => ({
  checkForm: vi.fn().mockResolvedValue([
    { message: 'Great alignment!' },
    { message: 'Keep your spine straight.' },
  ]),
}));

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockRejectedValue(new Error('Camera not available')),
  },
});

describe('AIGuidePage', () => {
  it('renders the main components', () => {
    render(<AIGuidePage />);
    
    expect(screen.getByText('🤖 AI Yoga Guide')).toBeInTheDocument();
    expect(screen.getByText('Camera Feed')).toBeInTheDocument();
    expect(screen.getByText('Select Pose')).toBeInTheDocument();
    expect(screen.getByText('Session Control')).toBeInTheDocument();
    expect(screen.getByText('Voice Commands')).toBeInTheDocument();
  });

  it('allows pose selection', () => {
    render(<AIGuidePage />);
    
    const butterflyButton = screen.getByRole('button', { name: /butterfly/i });
    expect(butterflyButton).toBeInTheDocument();
    
    fireEvent.click(butterflyButton);
    
    // Check if the pose is selected (status should update)
    expect(screen.getByText(/Pose: butterfly/i)).toBeInTheDocument();
  });

  it('displays voice commands help', () => {
    render(<AIGuidePage />);
    
    expect(screen.getByText(/Start session/)).toBeInTheDocument();
    expect(screen.getByText(/Analyze pose/)).toBeInTheDocument();
    expect(screen.getByText(/Repeat instructions/)).toBeInTheDocument();
    expect(screen.getByText(/Stop session/)).toBeInTheDocument();
  });

  it('shows proper initial state', () => {
    render(<AIGuidePage />);
    
    expect(screen.getByText('Camera Inactive')).toBeInTheDocument();
    expect(screen.getByText('Voice Ready')).toBeInTheDocument();
    expect(screen.getByText('Pose: None selected')).toBeInTheDocument();
    expect(screen.getByText('Status: Setup')).toBeInTheDocument();
  });

  it('enables camera controls', () => {
    render(<AIGuidePage />);
    
    const enableCameraButton = screen.getByRole('button', { name: /Enable Camera/i });
    expect(enableCameraButton).toBeInTheDocument();
    
    fireEvent.click(enableCameraButton);
    
    // Camera should remain inactive due to mock rejection
    expect(screen.getByText('Camera Inactive')).toBeInTheDocument();
  });

  it('has voice control button', () => {
    render(<AIGuidePage />);
    
    const voiceButton = screen.getByRole('button', { name: /Voice Control/i });
    expect(voiceButton).toBeInTheDocument();
    
    fireEvent.click(voiceButton);
    // Voice control functionality should be available
  });

  it('disables session controls when no pose selected', () => {
    render(<AIGuidePage />);
    
    const startButton = screen.getByRole('button', { name: /Start Guided Session/i });
    const analyzeButton = screen.getByRole('button', { name: /Analyze Pose/i });
    const repeatButton = screen.getByRole('button', { name: /Repeat Instructions/i });
    
    expect(startButton).toBeDisabled();
    expect(analyzeButton).toBeDisabled();
    expect(repeatButton).toBeDisabled();
  });

  it('enables repeat instructions when pose is selected', () => {
    render(<AIGuidePage />);
    
    // Select a pose first
    const butterflyButton = screen.getByRole('button', { name: /butterfly/i });
    fireEvent.click(butterflyButton);
    
    // Repeat instructions should now be enabled
    const repeatButton = screen.getByRole('button', { name: /Repeat Instructions/i });
    expect(repeatButton).not.toBeDisabled();
  });
});