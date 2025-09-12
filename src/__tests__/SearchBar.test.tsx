import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../components/PoseLibrary/SearchBar';

describe('SearchBar', () => {
  const mockOnChange = vi.fn();
  const mockSuggestions = ['Downward Dog', 'Mountain Pose', 'Tree Pose', 'Warrior I', 'Pose 5', 'Pose 6'];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders search input with placeholder', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search poses (English, Sanskrit, family)...');
  });

  it('calls onChange when input value changes', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'downward' } });
    expect(mockOnChange).toHaveBeenCalledWith('downward');
  });

  it('shows filtered suggestions when typing', async () => {
    const { rerender } = render(<SearchBar value="" onChange={mockOnChange} suggestions={mockSuggestions} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'dog' } });
    rerender(<SearchBar value="dog" onChange={mockOnChange} suggestions={mockSuggestions} />);

    expect(await screen.findByText('Downward Dog')).toBeInTheDocument();
  });

  it('filters suggestions based on input', async () => {
    const { rerender } = render(<SearchBar value="" onChange={mockOnChange} suggestions={mockSuggestions} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'war' } });
    rerender(<SearchBar value="war" onChange={mockOnChange} suggestions={mockSuggestions} />);

    await waitFor(() => {
      expect(screen.getByText('Warrior I')).toBeInTheDocument();
      expect(screen.queryByText('Mountain Pose')).not.toBeInTheDocument();
    });
  });

  it('selects suggestion when clicked', async () => {
    const { rerender } = render(<SearchBar value="" onChange={mockOnChange} suggestions={mockSuggestions} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'dog' } });
    rerender(<SearchBar value="dog" onChange={mockOnChange} suggestions={mockSuggestions} />);

    const suggestion = await screen.findByText('Downward Dog');
    fireEvent.click(suggestion);
    
    expect(mockOnChange).toHaveBeenCalledWith('Downward Dog');
  });

  it('hides suggestions on blur', async () => {
    const { rerender } = render(<SearchBar value="" onChange={mockOnChange} suggestions={mockSuggestions} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'dog' } });
    rerender(<SearchBar value="dog" onChange={mockOnChange} suggestions={mockSuggestions} />);
    
    expect(await screen.findByText('Downward Dog')).toBeInTheDocument();

    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByText('Downward Dog')).not.toBeInTheDocument();
    }, { timeout: 200 }); // timeout for the setTimeout in onBlur
  });

  it('limits suggestions to 5 items', async () => {
    const manySuggestions = Array.from({ length: 10 }, (_, i) => `Pose ${i + 1}`);
    const { rerender } = render(<SearchBar value="" onChange={mockOnChange} suggestions={manySuggestions} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'pose' } });
    rerender(<SearchBar value="pose" onChange={mockOnChange} suggestions={manySuggestions} />);

    const suggestionElements = await screen.findAllByText(/Pose \d+/);
    expect(suggestionElements).toHaveLength(5);
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Search poses');
  });
});