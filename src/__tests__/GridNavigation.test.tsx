import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GridNavigation from '../components/PoseLibrary/GridNavigation';

// Mock pose data
const mockPoses = [
  { id: '1', name_en: 'Downward Dog', slug: 'downward-dog' },
  { id: '2', name_en: 'Mountain Pose', slug: 'mountain-pose' },
  { id: '3', name_en: 'Tree Pose', slug: 'tree-pose' },
  { id: '4', name_en: 'Warrior I', slug: 'warrior-1' },
  { id: '5', name_en: 'Child\'s Pose', slug: 'childs-pose' },
  { id: '6', name_en: 'Plank', slug: 'plank' },
];

describe('GridNavigation', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    
    // Mock the DOM structure that would exist with pose cards
    document.body.innerHTML = `
      <div>
        <div data-pose-card tabindex="0">Pose 1</div>
        <div data-pose-card tabindex="0">Pose 2</div>
        <div data-pose-card tabindex="0">Pose 3</div>
        <div data-pose-card tabindex="0">Pose 4</div>
        <div data-pose-card tabindex="0">Pose 5</div>
        <div data-pose-card tabindex="0">Pose 6</div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('handles arrow key navigation', () => {
    render(<GridNavigation items={mockPoses} onSelect={mockOnSelect} gridColumns={3} />);

    // Test down arrow
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    
    // Test right arrow
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    
    // Test left arrow
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    
    // Test up arrow
    fireEvent.keyDown(window, { key: 'ArrowUp' });

    // Should not call onSelect for navigation keys
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('handles Enter key to select item', () => {
    render(<GridNavigation items={mockPoses} onSelect={mockOnSelect} />);

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(mockOnSelect).toHaveBeenCalledWith(mockPoses[0]);
  });

  it('handles Space key to select item', () => {
    render(<GridNavigation items={mockPoses} onSelect={mockOnSelect} />);

    fireEvent.keyDown(window, { key: ' ' });

    expect(mockOnSelect).toHaveBeenCalledWith(mockPoses[0]);
  });

  it('handles Home and End keys', () => {
    render(<GridNavigation items={mockPoses} onSelect={mockOnSelect} />);

    fireEvent.keyDown(window, { key: 'End' });
    fireEvent.keyDown(window, { key: 'Enter' });

    expect(mockOnSelect).toHaveBeenCalledWith(mockPoses[mockPoses.length - 1]);

    mockOnSelect.mockClear();

    fireEvent.keyDown(window, { key: 'Home' });
    fireEvent.keyDown(window, { key: 'Enter' });

    expect(mockOnSelect).toHaveBeenCalledWith(mockPoses[0]);
  });

  it('ignores other keys', () => {
    render(<GridNavigation items={mockPoses} onSelect={mockOnSelect} />);

    fireEvent.keyDown(window, { key: 'a' });
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.keyDown(window, { key: 'Tab' });

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('handles empty items array', () => {
    render(<GridNavigation items={[]} onSelect={mockOnSelect} />);

    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });

    expect(mockOnSelect).not.toHaveBeenCalled();
  });
});