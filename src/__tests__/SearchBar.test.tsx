import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../components/PoseLibrary/SearchBar';

describe('SearchBar', () => {
  const mockOnChange = vi.fn();
  const mockSuggestions = ['Downward Dog', 'Mountain Pose', 'Tree Pose', 'Warrior I'];

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
    render(<SearchBar value="" onChange={mockOnChange} suggestions={mockSuggestions} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'dog' } });
    
    await waitFor(async () => {
      const suggestionList = await screen.findByRole('listbox');
      expect(suggestionList).toBeInTheDocument();
      expect(screen.getByText('Downward Dog')).toBeInTheDocument();
    });
  });

  it('filters suggestions based on input', async () => {
    render(<SearchBar value="" onChange={mockOnChange} suggestions={mockSuggestions} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'war' } });
    
    await waitFor(async () => {
      const suggestionList = await screen.findByRole('listbox');
      expect(suggestionList).toBeInTheDocument();
      expect(screen.getByText('Warrior I')).toBeInTheDocument();
      expect(screen.queryByText('Mountain Pose')).not.toBeInTheDocument();
    });
  });

  it('selects suggestion when clicked', async () => {
    render(<SearchBar value="" onChange={mockOnChange} suggestions={mockSuggestions} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'dog' } });
    
    await waitFor(async () => {
      const suggestion = await screen.findByText('Downward Dog');
      fireEvent.click(suggestion);
    });
    
    expect(mockOnChange).toHaveBeenCalledWith('Downward Dog');
  });

  it('hides suggestions on blur', async () => {
    render(<SearchBar value="" onChange={mockOnChange} suggestions={mockSuggestions} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'dog' } });
    
    await waitFor(async () => {
      expect(await screen.findByText('Downward Dog')).toBeInTheDocument();
    });
    
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.queryByText('Downward Dog')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('limits suggestions to 5 items', async () => {
    const manySuggestions = Array.from({ length: 10 }, (_, i) => `Pose ${i + 1}`);
    render(<SearchBar value="" onChange={mockOnChange} suggestions={manySuggestions} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'pose' } });
    
    await waitFor(async () => {
      const suggestionElements = await screen.findAllByText(/Pose \d+/);
      expect(suggestionElements).toHaveLength(5);
    });
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Search poses');
  });
});