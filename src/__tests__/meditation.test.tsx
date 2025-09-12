import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MeditationPage from '../app/(main)/meditation/page';

import { vi } from 'vitest';

// Mock the fetch function
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ script: 'This is a test script.', phases: [] }),
  })
) as any;

describe('MeditationPage', () => {
  it('renders the component', () => {
    render(<MeditationPage />);
    expect(screen.getByText('AI Meditation Center')).toBeInTheDocument();
  });

  it('generates a meditation script when the form is submitted', async () => {
    render(<MeditationPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('How are you feeling right now?'), {
      target: { value: 'stressed' },
    });
    fireEvent.change(screen.getByLabelText('Duration (minutes)'), {
      target: { value: '5' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Create My Meditation'));

    // Wait for the script to be displayed
    await waitFor(() => {
      expect(screen.getByText('This is a test script.')).toBeInTheDocument();
    });
  });
});
